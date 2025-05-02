/**
 * Query Agent Service
 * Responsible for interpreting natural language questions, retrieving and synthesizing information
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

export class QueryAgentService extends BaseAgentService {
    private nodeRepository: Repository<Node>;
    private linkRepository: Repository<Link>;
    private nlpService: NLPService;

    constructor() {
        super(AgentType.QUERY);
        this.nodeRepository = AppDataSource.getRepository(Node);
        this.linkRepository = AppDataSource.getRepository(Link);
        this.nlpService = new NLPService();
    }

    /**
     * Process a message and generate query responses
     */
    async processMessage(message: Message): Promise<AgentAction[]> {
        const actions: AgentAction[] = [];
        const agent = await this.getOrCreateAgent(message.conversation.userId);

        try {
            // Check if the message is a question
            if (this.isQuestion(message.content)) {
                // Find relevant nodes for this question
                const relevantNodes = await this.findRelevantNodes(
                    message.content,
                    message.conversation.userId
                );

                if (relevantNodes.length > 0) {
                    // Create context from relevant nodes
                    const context = this.createContextFromNodes(relevantNodes);

                    // Generate answer using NLP service
                    const answer = await this.nlpService.answerQuestion(message.content, context);

                    // Create action for the query response
                    const action = await this.createAgentAction(
                        agent,
                        ActionType.ANSWER_QUERY,
                        {
                            question: message.content,
                            answer: answer,
                            relevantNodeIds: relevantNodes.map(node => node.id),
                            relevantNodeTitles: relevantNodes.map(node => node.title),
                            messageId: message.id,
                            conversationId: message.conversationId
                        },
                        message.conversationId
                    );

                    actions.push(action);
                }
            }

            return actions;
        } catch (error) {
            console.error('Error in query agent processing:', error);
            return [];
        }
    }

    /**
     * Execute an approved query agent action
     */
    async executeAction(action: AgentAction): Promise<AgentAction> {
        try {
            switch (action.type) {
                case ActionType.ANSWER_QUERY:
                    return await this.executeAnswerQuery(action);

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
     * Execute an action to answer a query
     */
    private async executeAnswerQuery(action: AgentAction): Promise<AgentAction> {
        const { answer, messageId, conversationId } = action.payload;

        if (!messageId || !conversationId) {
            throw new Error('Message ID and Conversation ID are required');
        }

        // Get the original message
        const originalMessage = await this.messageRepository.findOne({
            where: { id: messageId },
            relations: ['conversation']
        });

        if (!originalMessage) {
            throw new Error('Original message not found');
        }

        // Create a response message in the conversation
        const responseMessage = new Message();
        responseMessage.content = answer;
        responseMessage.role = 'assistant';
        responseMessage.conversationId = conversationId;
        responseMessage.conversation = originalMessage.conversation;
        responseMessage.nodeReferences = action.payload.relevantNodeIds || [];
        responseMessage.entities = {};

        await this.messageRepository.save(responseMessage);

        // Update action status
        action.status = ActionStatus.EXECUTED;
        action.executedAt = new Date();
        action.result = 'Successfully answered query';

        return await this.agentActionRepository.save(action);
    }

    /**
     * Check if a message is a question
     */
    private isQuestion(text: string): boolean {
        // Simple heuristic: check if the text ends with a question mark
        // or starts with common question words
        const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'can', 'could', 'would', 'should', 'is', 'are', 'do', 'does'];

        const trimmedText = text.trim().toLowerCase();

        if (trimmedText.endsWith('?')) {
            return true;
        }

        for (const word of questionWords) {
            if (trimmedText.startsWith(word + ' ')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find nodes relevant to a question
     */
    private async findRelevantNodes(question: string, userId: string): Promise<Node[]> {
        // Get all user's nodes
        const userNodes = await this.nodeRepository.find({
            where: { userId },
            take: 100,  // Limit to prevent performance issues
            order: { updatedAt: 'DESC' }  // Get most recent nodes
        });

        // Calculate relevance scores for each node
        const scoredNodes = await Promise.all(
            userNodes.map(async node => {
                // Calculate similarity between question and node title
                const titleSimilarity = await this.nlpService.calculateSimilarity(question, node.title);

                // Calculate similarity between question and node content (if not too long)
                let contentSimilarity = 0;
                if (node.content.length < 2000) {
                    contentSimilarity = await this.nlpService.calculateSimilarity(question, node.content);
                }

                // Combine scores (title similarity is weighted more heavily)
                const score = titleSimilarity * 0.4 + contentSimilarity * 0.6;

                return { node, score };
            })
        );

        // Sort by score (highest first) and take top results
        const topNodes = scoredNodes
            .sort((a, b) => b.score - a.score)
            .filter(item => item.score > 0.5)  // Only include nodes with reasonable relevance
            .slice(0, 5)  // Take top 5
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
     * Get default configuration specific to query agent
     */
    protected getDefaultConfiguration(): Record<string, any> {
        const baseConfig = super.getDefaultConfiguration();
        return {
            ...baseConfig,
            relevanceThreshold: 0.5,
            maxContextNodes: 5,
            includeNodeReferences: true,
            autoExecute: true  // Query agent can auto-execute by default
        };
    }
}