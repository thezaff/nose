/**
 * Summary Agent Service
 * Responsible for creating summaries of knowledge areas and identifying insights
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

export class SummaryAgentService extends BaseAgentService {
    private nodeRepository: Repository<Node>;
    private superTagRepository: Repository<SuperTag>;
    private nodeSuperTagRepository: Repository<NodeSuperTag>;
    private nlpService: NLPService;

    constructor() {
        super(AgentType.SUMMARY);
        this.nodeRepository = AppDataSource.getRepository(Node);
        this.superTagRepository = AppDataSource.getRepository(SuperTag);
        this.nodeSuperTagRepository = AppDataSource.getRepository(NodeSuperTag);
        this.nlpService = new NLPService();
    }

    /**
     * Process a message and generate summary suggestions
     */
    async processMessage(message: Message): Promise<AgentAction[]> {
        const actions: AgentAction[] = [];
        const agent = await this.getOrCreateAgent(message.conversation.userId);

        try {
            // Extract topics from message
            const topics = await this.nlpService.extractTopics(message.content);

            if (topics && topics.length > 0) {
                // For each topic, check if we have enough related nodes to generate a summary
                for (const topic of topics) {
                    // Find nodes related to this topic
                    const relatedNodes = await this.findNodesRelatedToTopic(
                        topic,
                        message.conversation.userId
                    );

                    // If we have enough related nodes, suggest a summary
                    if (relatedNodes.length >= 3) {
                        // Create action to suggest a summary
                        const action = await this.createAgentAction(
                            agent,
                            ActionType.SUGGEST_SUMMARY,
                            {
                                topic: topic,
                                relatedNodeIds: relatedNodes.map(node => node.id),
                                relatedNodeTitles: relatedNodes.map(node => node.title),
                                messageId: message.id,
                                conversationId: message.conversationId
                            },
                            message.conversationId
                        );

                        actions.push(action);
                    }
                }
            }

            return actions;
        } catch (error) {
            console.error('Error in summary agent processing:', error);
            return [];
        }
    }

    /**
     * Execute an approved summary agent action
     */
    async executeAction(action: AgentAction): Promise<AgentAction> {
        try {
            switch (action.type) {
                case ActionType.SUGGEST_SUMMARY:
                    return await this.executeSuggestSummary(action);

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
     * Execute an action to generate a summary
     */
    private async executeSuggestSummary(action: AgentAction): Promise<AgentAction> {
        const { topic, relatedNodeIds, conversationId } = action.payload;

        if (!relatedNodeIds || !Array.isArray(relatedNodeIds) || relatedNodeIds.length === 0) {
            throw new Error('Related node IDs are required');
        }

        // Get the related nodes
        const nodes = await Promise.all(
            relatedNodeIds.map(id => this.nodeRepository.findOne({ where: { id } }))
        );

        // Filter out any null values
        const validNodes = nodes.filter(node => node !== null) as Node[];

        if (validNodes.length === 0) {
            throw new Error('No valid nodes found');
        }

        // Create context from nodes
        const context = this.createContextFromNodes(validNodes);

        // Generate summary
        const summary = await this.nlpService.generateSummary(context, 500);

        // Create a new node with the summary
        const summaryNode = new Node();
        summaryNode.title = `Summary: ${topic}`;
        summaryNode.content = summary;
        summaryNode.userId = validNodes[0].userId;  // Use the user ID from one of the related nodes
        summaryNode.metadata = {
            type: 'summary',
            topic: topic,
            relatedNodeIds: relatedNodeIds,
            generatedAt: new Date().toISOString(),
            actionId: action.id
        };

        const savedSummaryNode = await this.nodeRepository.save(summaryNode);

        // If we have a conversation ID, create a message with the summary
        if (conversationId) {
            const message = new Message();
            message.content = `**Summary of ${topic}**\n\n${summary}`;
            message.role = 'assistant';
            message.conversationId = conversationId;
            message.nodeReferences = [...relatedNodeIds, savedSummaryNode.id];
            message.entities = {};

            await this.messageRepository.save(message);
        }

        // Update action with the created node ID
        action.nodeId = savedSummaryNode.id;
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = `Successfully created summary node "${savedSummaryNode.title}"`;

        return await this.agentActionRepository.save(action);
    }

    /**
     * Find nodes related to a specific topic
     */
    private async findNodesRelatedToTopic(topic: string, userId: string): Promise<Node[]> {
        // Get all user's nodes
        const userNodes = await this.nodeRepository.find({
            where: { userId },
            take: 100  // Limit to prevent performance issues
        });

        // Calculate relevance scores for each node
        const scoredNodes = await Promise.all(
            userNodes.map(async node => {
                // Calculate similarity between topic and node title
                const titleSimilarity = await this.nlpService.calculateSimilarity(topic, node.title);

                // Calculate similarity between topic and node content (if not too long)
                let contentSimilarity = 0;
                if (node.content.length < 2000) {
                    contentSimilarity = await this.nlpService.calculateSimilarity(topic, node.content);
                }

                // Combine scores (title similarity is weighted more heavily)
                const score = titleSimilarity * 0.4 + contentSimilarity * 0.6;

                return { node, score };
            })
        );

        // Sort by score (highest first) and take top results
        const topNodes = scoredNodes
            .sort((a, b) => b.score - a.score)
            .filter(item => item.score > 0.6)  // Only include nodes with good relevance
            .slice(0, 10)  // Take top 10
            .map(item => item.node);

        return topNodes;
    }

    /**
     * Create a context string from a list of nodes
     */
    private createContextFromNodes(nodes: Node[]): string {
        let context = '';

        for (const node of nodes) {
            context += `Title: ${node.title}\n`;
            context += `Content: ${node.content}\n\n`;
        }

        return context;
    }

    /**
     * Get default configuration specific to summary agent
     */
    protected getDefaultConfiguration(): Record<string, any> {
        const baseConfig = super.getDefaultConfiguration();
        return {
            ...baseConfig,
            minRelatedNodes: 3,
            relevanceThreshold: 0.6,
            maxSummaryLength: 500,
            summaryInterval: 7,  // days
            proactivityLevel: 'low'  // Summary agent is less proactive by default
        };
    }
}