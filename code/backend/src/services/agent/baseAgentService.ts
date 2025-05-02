/**
 * Base Agent Service
 * Provides common functionality for all agent types
 */

import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/database';
import { Agent, AgentType, AgentAction, ActionType, ActionStatus } from '../../entity';
import { Message } from '../../entity';

export abstract class BaseAgentService {
    protected agentRepository: Repository<Agent>;
    protected agentActionRepository: Repository<AgentAction>;
    protected messageRepository: Repository<Message>;

    constructor(protected agentType: AgentType) {
        this.agentRepository = AppDataSource.getRepository(Agent);
        this.agentActionRepository = AppDataSource.getRepository(AgentAction);
        this.messageRepository = AppDataSource.getRepository(Message);
    }

    /**
     * Process a message and generate agent actions
     * This method should be implemented by each specific agent type
     */
    abstract processMessage(message: Message): Promise<AgentAction[]>;

    /**
     * Execute an approved agent action
     * This method should be implemented by each specific agent type
     */
    abstract executeAction(action: AgentAction): Promise<AgentAction>;

    /**
     * Create a new agent action
     */
    protected async createAgentAction(
        agent: Agent,
        type: ActionType,
        payload: Record<string, any>,
        conversationId?: string,
        nodeId?: string
    ): Promise<AgentAction> {
        const action = new AgentAction();
        action.type = type;
        action.payload = payload;
        action.status = ActionStatus.PENDING;
        action.approved = false;
        action.agent = agent;
        action.agentId = agent.id;

        if (conversationId) {
            action.conversationId = conversationId;
        }

        if (nodeId) {
            action.nodeId = nodeId;
        }

        return await this.agentActionRepository.save(action);
    }

    /**
     * Get or create an agent of the specified type for a user
     */
    protected async getOrCreateAgent(userId: string): Promise<Agent> {
        // Try to find an existing agent of this type for the user
        let agent = await this.agentRepository.findOne({
            where: {
                userId,
                type: this.agentType
            }
        });

        // If no agent exists, create a new one
        if (!agent) {
            agent = new Agent();
            agent.userId = userId;
            agent.type = this.agentType;
            agent.name = this.getDefaultAgentName();
            agent.description = this.getDefaultAgentDescription();
            agent.configuration = this.getDefaultConfiguration();
            agent.isActive = true;

            agent = await this.agentRepository.save(agent);
        }

        return agent;
    }

    /**
     * Get the default name for this agent type
     */
    protected getDefaultAgentName(): string {
        switch (this.agentType) {
            case AgentType.ORGANIZATION:
                return 'Organization Agent';
            case AgentType.CONNECTION:
                return 'Connection Agent';
            case AgentType.QUERY:
                return 'Query Agent';
            case AgentType.SUMMARY:
                return 'Summary Agent';
            default:
                return 'Agent';
        }
    }

    /**
     * Get the default description for this agent type
     */
    protected getDefaultAgentDescription(): string {
        switch (this.agentType) {
            case AgentType.ORGANIZATION:
                return 'Automatically categorizes and tags information, suggests restructuring';
            case AgentType.CONNECTION:
                return 'Identifies relationships between information, suggests links';
            case AgentType.QUERY:
                return 'Interprets natural language questions, retrieves and synthesizes information';
            case AgentType.SUMMARY:
                return 'Creates summaries of knowledge areas, identifies insights';
            default:
                return 'AI agent for knowledge management';
        }
    }

    /**
     * Get the default configuration for this agent type
     */
    protected getDefaultConfiguration(): Record<string, any> {
        return {
            proactivityLevel: 'medium', // low, medium, high
            autoExecute: false,
            notifyUser: true
        };
    }
}