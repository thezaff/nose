/**
 * Agent Coordinator Service
 * Manages and coordinates all agent activities
 */

import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import {
    Agent,
    AgentType,
    AgentAction,
    ActionStatus,
    Message,
    User
} from '../../entity';
import { OrganizationAgentService } from './organizationAgentService';
import { ConnectionAgentService } from './connectionAgentService';
import { QueryAgentService } from './queryAgentService';
import { SummaryAgentService } from './summaryAgentService';

export class AgentCoordinatorService {
    private agentRepository: Repository<Agent>;
    private agentActionRepository: Repository<AgentAction>;
    private messageRepository: Repository<Message>;
    private userRepository: Repository<User>;

    // Agent services
    private organizationAgent: OrganizationAgentService;
    private connectionAgent: ConnectionAgentService;
    private queryAgent: QueryAgentService;
    private summaryAgent: SummaryAgentService;

    constructor() {
        // Initialize repositories
        this.agentRepository = AppDataSource.getRepository(Agent);
        this.agentActionRepository = AppDataSource.getRepository(AgentAction);
        this.messageRepository = AppDataSource.getRepository(Message);
        this.userRepository = AppDataSource.getRepository(User);

        // Initialize agent services
        this.organizationAgent = new OrganizationAgentService();
        this.connectionAgent = new ConnectionAgentService();
        this.queryAgent = new QueryAgentService();
        this.summaryAgent = new SummaryAgentService();
    }

    /**
     * Process a new message with all agents
     * @param messageId The ID of the message to process
     * @returns Array of agent actions generated
     */
    async processMessage(messageId: string): Promise<AgentAction[]> {
        try {
            // Get the message with conversation
            const message = await this.messageRepository.findOne({
                where: { id: messageId },
                relations: ['conversation']
            });

            if (!message) {
                throw new Error('Message not found');
            }

            // Skip processing for assistant messages
            if (message.role !== 'user') {
                return [];
            }

            // Get user to check agent preferences
            const user = await this.userRepository.findOne({
                where: { id: message.conversation.userId }
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Get user preferences for agents
            const agentPreferences = user.preferences?.agents || {};

            // Process message with each agent type based on user preferences
            const allActions: AgentAction[] = [];

            // Process with Organization Agent
            if (agentPreferences.organization?.enabled !== false) {
                const organizationActions = await this.organizationAgent.processMessage(message);
                allActions.push(...organizationActions);
            }

            // Process with Connection Agent
            if (agentPreferences.connection?.enabled !== false) {
                const connectionActions = await this.connectionAgent.processMessage(message);
                allActions.push(...connectionActions);
            }

            // Process with Query Agent
            if (agentPreferences.query?.enabled !== false) {
                const queryActions = await this.queryAgent.processMessage(message);

                // Auto-execute query actions if configured
                for (const action of queryActions) {
                    const agent = await this.agentRepository.findOne({
                        where: { id: action.agentId }
                    });

                    if (agent && agent.configuration?.autoExecute) {
                        action.approved = true;
                        action.status = ActionStatus.APPROVED;
                        await this.agentActionRepository.save(action);
                        await this.executeAction(action.id);
                    } else {
                        allActions.push(action);
                    }
                }
            }

            // Process with Summary Agent
            if (agentPreferences.summary?.enabled !== false) {
                const summaryActions = await this.summaryAgent.processMessage(message);
                allActions.push(...summaryActions);
            }

            return allActions;
        } catch (error) {
            console.error('Error in agent coordinator processing:', error);
            return [];
        }
    }

    /**
     * Get pending agent actions for a conversation
     * @param conversationId The conversation ID
     * @returns Array of pending agent actions
     */
    async getPendingActionsForConversation(conversationId: string): Promise<AgentAction[]> {
        return await this.agentActionRepository.find({
            where: {
                conversationId,
                status: ActionStatus.PENDING,
                approved: false
            },
            relations: ['agent'],
            order: {
                createdAt: 'DESC'
            }
        });
    }

    /**
     * Approve an agent action
     * @param actionId The action ID to approve
     * @returns The updated agent action
     */
    async approveAction(actionId: string): Promise<AgentAction> {
        const action = await this.agentActionRepository.findOne({
            where: { id: actionId }
        });

        if (!action) {
            throw new Error('Action not found');
        }

        // Update action status
        action.approved = true;
        action.status = ActionStatus.APPROVED;

        await this.agentActionRepository.save(action);

        // Execute the approved action
        return await this.executeAction(actionId);
    }

    /**
     * Reject an agent action
     * @param actionId The action ID to reject
     * @returns The updated agent action
     */
    async rejectAction(actionId: string): Promise<AgentAction> {
        const action = await this.agentActionRepository.findOne({
            where: { id: actionId }
        });

        if (!action) {
            throw new Error('Action not found');
        }

        // Update action status
        action.approved = false;
        action.status = ActionStatus.REJECTED;

        return await this.agentActionRepository.save(action);
    }

    /**
     * Execute an approved agent action
     * @param actionId The action ID to execute
     * @returns The executed agent action
     */
    async executeAction(actionId: string): Promise<AgentAction> {
        const action = await this.agentActionRepository.findOne({
            where: { id: actionId },
            relations: ['agent']
        });

        if (!action) {
            throw new Error('Action not found');
        }

        if (!action.approved) {
            throw new Error('Cannot execute unapproved action');
        }

        // Execute action based on agent type
        switch (action.agent.type) {
            case AgentType.ORGANIZATION:
                return await this.organizationAgent.executeAction(action);

            case AgentType.CONNECTION:
                return await this.connectionAgent.executeAction(action);

            case AgentType.QUERY:
                return await this.queryAgent.executeAction(action);

            case AgentType.SUMMARY:
                return await this.summaryAgent.executeAction(action);

            default:
                throw new Error(`Unknown agent type: ${action.agent.type}`);
        }
    }

    /**
     * Get all agents for a user
     * @param userId The user ID
     * @returns Array of agents
     */
    async getUserAgents(userId: string): Promise<Agent[]> {
        return await this.agentRepository.find({
            where: { userId }
        });
    }

    /**
     * Update agent configuration
     * @param agentId The agent ID
     * @param configuration The new configuration
     * @returns The updated agent
     */
    async updateAgentConfiguration(agentId: string, configuration: Record<string, any>): Promise<Agent> {
        const agent = await this.agentRepository.findOne({
            where: { id: agentId }
        });

        if (!agent) {
            throw new Error('Agent not found');
        }

        // Update configuration
        agent.configuration = {
            ...agent.configuration,
            ...configuration
        };

        return await this.agentRepository.save(agent);
    }

    /**
     * Initialize default agents for a new user
     * @param userId The user ID
     */
    async initializeAgentsForUser(userId: string): Promise<void> {
        // Create one agent of each type for the user
        const agentTypes = Object.values(AgentType);

        for (const type of agentTypes) {
            // Check if agent already exists
            const existingAgent = await this.agentRepository.findOne({
                where: {
                    userId,
                    type
                }
            });

            if (!existingAgent) {
                // Create new agent
                const agent = new Agent();
                agent.userId = userId;
                agent.type = type;
                agent.isActive = true;

                // Set name and description based on type
                switch (type) {
                    case AgentType.ORGANIZATION:
                        agent.name = 'Organization Agent';
                        agent.description = 'Automatically categorizes and tags information, suggests restructuring';
                        agent.configuration = {
                            proactivityLevel: 'medium',
                            autoExecute: false,
                            notifyUser: true,
                            suggestTags: true,
                            suggestCategories: true,
                            minimumConfidence: 0.7
                        };
                        break;

                    case AgentType.CONNECTION:
                        agent.name = 'Connection Agent';
                        agent.description = 'Identifies relationships between information, suggests links';
                        agent.configuration = {
                            proactivityLevel: 'medium',
                            autoExecute: false,
                            notifyUser: true,
                            similarityThreshold: 0.7,
                            maxConnectionsPerEntity: 3
                        };
                        break;

                    case AgentType.QUERY:
                        agent.name = 'Query Agent';
                        agent.description = 'Interprets natural language questions, retrieves and synthesizes information';
                        agent.configuration = {
                            proactivityLevel: 'high',
                            autoExecute: true,
                            notifyUser: true,
                            relevanceThreshold: 0.5,
                            maxContextNodes: 5
                        };
                        break;

                    case AgentType.SUMMARY:
                        agent.name = 'Summary Agent';
                        agent.description = 'Creates summaries of knowledge areas, identifies insights';
                        agent.configuration = {
                            proactivityLevel: 'low',
                            autoExecute: false,
                            notifyUser: true,
                            minRelatedNodes: 3,
                            relevanceThreshold: 0.6
                        };
                        break;
                }

                await this.agentRepository.save(agent);
            }
        }
    }
}