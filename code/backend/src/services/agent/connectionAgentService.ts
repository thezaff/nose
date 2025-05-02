/**
 * Connection Agent Service
 * Responsible for identifying relationships between information and suggesting links
 */

import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import {
    Agent,
    AgentType,
    AgentAction,
    ActionType,
    ActionStatus,
    Message,
    Node,
    Link
} from '../../entity';
import { BaseAgentService } from './baseAgentService';
import { NLPService } from '../nlp/nlpService';

export class ConnectionAgentService extends BaseAgentService {
    private nodeRepository: Repository<Node>;
    private linkRepository: Repository<Link>;
    private nlpService: NLPService;

    constructor() {
        super(AgentType.CONNECTION);
        this.nodeRepository = AppDataSource.getRepository(Node);
        this.linkRepository = AppDataSource.getRepository(Link);
        this.nlpService = new NLPService();
    }

    /**
     * Process a message and generate connection suggestions
     */
    async processMessage(message: Message): Promise<AgentAction[]> {
        const actions: AgentAction[] = [];
        const agent = await this.getOrCreateAgent(message.conversation.userId);

        try {
            // Extract entities from message
            const entities = await this.nlpService.extractEntities(message.content);

            // If message has entities, look for potential connections
            if (entities && Object.keys(entities).length > 0) {
                // Get all user's nodes
                const userNodes = await this.nodeRepository.find({
                    where: { userId: message.conversation.userId },
                    take: 100,  // Limit to prevent performance issues
                    order: { updatedAt: 'DESC' }  // Get most recent nodes
                });

                // For each entity, find potentially related nodes
                for (const [entityType, entityValues] of Object.entries(entities)) {
                    for (const entity of entityValues as string[]) {
                        // Find nodes that might be related to this entity
                        const potentialConnections = await this.findPotentialConnections(
                            entity,
                            userNodes,
                            message.conversation.userId
                        );

                        // Create connection suggestions
                        for (const connection of potentialConnections) {
                            // Create action to suggest this connection
                            const action = await this.createAgentAction(
                                agent,
                                ActionType.CREATE_CONNECTION,
                                {
                                    entityName: entity,
                                    entityType: entityType,
                                    sourceNodeId: connection.nodeId,
                                    sourceNodeTitle: connection.nodeTitle,
                                    targetNodeId: null,  // Will be created if approved
                                    targetNodeTitle: entity,
                                    messageId: message.id,
                                    conversationId: message.conversationId,
                                    similarity: connection.similarity,
                                    reason: connection.reason
                                },
                                message.conversationId
                            );

                            actions.push(action);
                        }
                    }
                }
            }

            return actions;
        } catch (error) {
            console.error('Error in connection agent processing:', error);
            return [];
        }
    }

    /**
     * Execute an approved connection agent action
     */
    async executeAction(action: AgentAction): Promise<AgentAction> {
        try {
            switch (action.type) {
                case ActionType.CREATE_CONNECTION:
                    return await this.executeCreateConnection(action);

                default:
                    throw new Error(`Unsupported action type: ${action.type}`);
            }
        } catch (error) {
            // Update action status to failed
            action.status = ActionStatus.FAILED;
            action.result = error instanceof Error ? error.message : 'Unknown error';
            return await this.agentActionRepository.save(action);
        }
    }

    /**
     * Execute an action to create a connection between nodes
     */
    private async executeCreateConnection(action: AgentAction): Promise<AgentAction> {
        const { sourceNodeId, targetNodeId, messageId, entityName } = action.payload;

        // Ensure we have a source node
        if (!sourceNodeId) {
            throw new Error('Source node ID is required');
        }

        // Get source node
        const sourceNode = await this.nodeRepository.findOne({
            where: { id: sourceNodeId }
        });

        if (!sourceNode) {
            throw new Error('Source node not found');
        }

        let targetNode;

        // If we have a target node ID, use it
        if (targetNodeId) {
            targetNode = await this.nodeRepository.findOne({
                where: { id: targetNodeId }
            });

            if (!targetNode) {
                throw new Error('Target node not found');
            }
        }
        // Otherwise, if we have a message ID, create a node from the message
        else if (messageId) {
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['conversation']
            });

            if (!message) {
                throw new Error('Message not found');
            }

            // Create a new node from the message
            targetNode = new Node();
            targetNode.title = entityName || 'Untitled';
            targetNode.content = message.content;
            targetNode.userId = message.conversation.userId;
            targetNode.metadata = {
                source: 'agent_connection',
                messageId,
                conversationId: message.conversationId,
                extractedAt: new Date().toISOString()
            };

            targetNode = await this.nodeRepository.save(targetNode);

            // Update action with the created node ID
            action.payload.targetNodeId = targetNode.id;
        } else {
            throw new Error('Either target node ID or message ID is required');
        }

        // Create the link between nodes
        const link = new Link();
        link.sourceNodeId = sourceNode.id;
        link.targetNodeId = targetNode.id;
        link.type = 'related';
        link.metadata = {
            createdBy: 'connection_agent',
            reason: action.payload.reason || 'Semantic similarity',
            similarity: action.payload.similarity || null,
            actionId: action.id
        };

        await this.linkRepository.save(link);

        // Update action status
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = `Successfully created connection between "${sourceNode.title}" and "${targetNode.title}"`;

        return await this.agentActionRepository.save(action);
    }

    /**
     * Find potential connections between an entity and existing nodes
     */
    private async findPotentialConnections(
        entity: string,
        nodes: Node[],
        userId: string
    ): Promise<Array<{ nodeId: string; nodeTitle: string; similarity: number; reason: string }>> {
        const connections: Array<{ nodeId: string; nodeTitle: string; similarity: number; reason: string }> = [];

        // For each node, calculate similarity with the entity
        for (const node of nodes) {
            // Skip if node title is too short
            if (node.title.length < 3) continue;

            // Calculate similarity between entity and node title
            const titleSimilarity = await this.nlpService.calculateSimilarity(entity, node.title);

            // If similarity is high enough, add to potential connections
            if (titleSimilarity > 0.7) {
                connections.push({
                    nodeId: node.id,
                    nodeTitle: node.title,
                    similarity: titleSimilarity,
                    reason: 'Title similarity'
                });
                continue;  // Skip content check if title is already similar
            }

            // If node content is not too long, check content similarity
            if (node.content.length < 1000) {
                const contentSimilarity = await this.nlpService.calculateSimilarity(entity, node.content);

                if (contentSimilarity > 0.7) {
                    connections.push({
                        nodeId: node.id,
                        nodeTitle: node.title,
                        similarity: contentSimilarity,
                        reason: 'Content similarity'
                    });
                }
            }
        }

        // Sort by similarity (highest first) and limit to top 3
        return connections
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 3);
    }

    /**
     * Get default configuration specific to connection agent
     */
    protected getDefaultConfiguration(): Record<string, any> {
        const baseConfig = super.getDefaultConfiguration();
        return {
            ...baseConfig,
            similarityThreshold: 0.7,
            maxConnectionsPerEntity: 3,
            considerRecentNodesFirst: true,
            maxNodeAge: 30  // days
        };
    }
}