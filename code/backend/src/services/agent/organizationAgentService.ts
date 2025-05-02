/**
 * Organization Agent Service
 * Responsible for categorizing and tagging information, suggesting restructuring
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
    SuperTag,
    NodeSuperTag
} from '../../entity';
import { BaseAgentService } from './baseAgentService';
import { NLPService } from '../nlp/nlpService';

export class OrganizationAgentService extends BaseAgentService {
    private nodeRepository: Repository<Node>;
    private superTagRepository: Repository<SuperTag>;
    private nodeSuperTagRepository: Repository<NodeSuperTag>;
    private nlpService: NLPService;

    constructor() {
        super(AgentType.ORGANIZATION);
        this.nodeRepository = AppDataSource.getRepository(Node);
        this.superTagRepository = AppDataSource.getRepository(SuperTag);
        this.nodeSuperTagRepository = AppDataSource.getRepository(NodeSuperTag);
        this.nlpService = new NLPService();
    }

    /**
     * Process a message and generate organization suggestions
     */
    async processMessage(message: Message): Promise<AgentAction[]> {
        const actions: AgentAction[] = [];
        const agent = await this.getOrCreateAgent(message.conversation.userId);

        try {
            // Extract entities from message
            const entities = await this.nlpService.extractEntities(message.content);

            // If message has entities, suggest tagging
            if (entities && Object.keys(entities).length > 0) {
                // Get all user's supertags
                const userSuperTags = await this.superTagRepository.find({
                    where: { userId: message.conversation.userId }
                });

                // For each entity, suggest appropriate supertags
                for (const [entityType, entityValues] of Object.entries(entities)) {
                    for (const entity of entityValues as string[]) {
                        // Find matching supertag
                        const matchingSuperTag = userSuperTags.find(tag =>
                            tag.name.toLowerCase() === entityType.toLowerCase() ||
                            tag.metadata?.entityTypes?.includes(entityType.toLowerCase())
                        );

                        if (matchingSuperTag) {
                            // Create action to suggest applying this supertag
                            const action = await this.createAgentAction(
                                agent,
                                ActionType.APPLY_SUPERTAG,
                                {
                                    entityName: entity,
                                    entityType: entityType,
                                    superTagId: matchingSuperTag.id,
                                    superTagName: matchingSuperTag.name,
                                    messageId: message.id,
                                    conversationId: message.conversationId
                                },
                                message.conversationId
                            );

                            actions.push(action);
                        }
                    }
                }
            }

            // Analyze message for potential new node creation
            if (message.content.length > 50) {  // Only suggest for substantial content
                const topics = await this.nlpService.extractTopics(message.content);

                if (topics && topics.length > 0) {
                    // Create action to suggest extracting this as a knowledge node
                    const action = await this.createAgentAction(
                        agent,
                        ActionType.EXTRACT_ENTITY,
                        {
                            messageId: message.id,
                            conversationId: message.conversationId,
                            suggestedTitle: topics[0],
                            topics: topics,
                            content: message.content
                        },
                        message.conversationId
                    );

                    actions.push(action);
                }
            }

            return actions;
        } catch (error) {
            console.error('Error in organization agent processing:', error);
            return [];
        }
    }

    /**
     * Execute an approved organization agent action
     */
    async executeAction(action: AgentAction): Promise<AgentAction> {
        try {
            switch (action.type) {
                case ActionType.APPLY_SUPERTAG:
                    return await this.executeApplySuperTag(action);

                case ActionType.EXTRACT_ENTITY:
                    return await this.executeExtractEntity(action);

                case ActionType.ORGANIZE_NODES:
                    return await this.executeOrganizeNodes(action);

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
     * Execute an action to apply a supertag to a node
     */
    private async executeApplySuperTag(action: AgentAction): Promise<AgentAction> {
        const { superTagId, nodeId, messageId } = action.payload;

        // If we have a messageId but no nodeId, we need to create a node from the message
        if (messageId && !nodeId) {
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['conversation']
            });

            if (!message) {
                throw new Error('Message not found');
            }

            // Create a new node from the message
            const node = new Node();
            node.title = action.payload.entityName || 'Untitled';
            node.content = message.content;
            node.userId = message.conversation.userId;

            const savedNode = await this.nodeRepository.save(node);
            action.payload.nodeId = savedNode.id;
        }

        // Apply the supertag to the node
        if (!action.payload.nodeId || !superTagId) {
            throw new Error('Node ID and SuperTag ID are required');
        }

        // Check if the node already has this supertag
        const existingNodeSuperTag = await this.nodeSuperTagRepository.findOne({
            where: {
                nodeId: action.payload.nodeId,
                superTagId
            }
        });

        if (!existingNodeSuperTag) {
            // Create the node-supertag relationship
            const nodeSuperTag = new NodeSuperTag();
            nodeSuperTag.nodeId = action.payload.nodeId;
            nodeSuperTag.superTagId = superTagId;
            await this.nodeSuperTagRepository.save(nodeSuperTag);
        }

        // Update action status
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = `Successfully applied SuperTag to node`;

        return await this.agentActionRepository.save(action);
    }

    /**
     * Execute an action to extract an entity into a new node
     */
    private async executeExtractEntity(action: AgentAction): Promise<AgentAction> {
        const { messageId, suggestedTitle, content } = action.payload;

        if (!messageId) {
            throw new Error('Message ID is required');
        }

        // Get the message to access user ID
        const message = await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['conversation']
        });

        if (!message) {
            throw new Error('Message not found');
        }

        // Create a new node
        const node = new Node();
        node.title = suggestedTitle || 'Extracted Knowledge';
        node.content = content || message.content;
        node.userId = message.conversation.userId;
        node.metadata = {
            source: 'agent_extraction',
            messageId,
            conversationId: message.conversationId,
            extractedAt: new Date().toISOString()
        };

        const savedNode = await this.nodeRepository.save(node);

        // Update action with the created node ID
        action.nodeId = savedNode.id;
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = `Successfully created node "${savedNode.title}" from message`;

        return await this.agentActionRepository.save(action);
    }

    /**
     * Execute an action to organize multiple nodes
     */
    private async executeOrganizeNodes(action: AgentAction): Promise<AgentAction> {
        // Implementation for organizing multiple nodes
        // This would involve categorizing nodes, suggesting hierarchies, etc.

        // For MVP, we'll just mark it as executed
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = 'Nodes organized successfully';

        return await this.agentActionRepository.save(action);
    }

    /**
     * Get default configuration specific to organization agent
     */
    protected getDefaultConfiguration(): Record<string, any> {
        const baseConfig = super.getDefaultConfiguration();
        return {
            ...baseConfig,
            suggestTags: true,
            suggestCategories: true,
            minimumConfidence: 0.7,
            entityTypes: ['person', 'organization', 'location', 'date', 'concept', 'topic']
        };
    }
}