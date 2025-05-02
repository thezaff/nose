/**
 * Agent controller
 */

import { Request, Response } from 'express';
import { AgentCoordinatorService } from '../services/agent/agentCoordinatorService';
import {
    successResponse,
    errorResponse,
    notFoundResponse
} from '../utils/responseHandler';

export class AgentController {
    private static agentCoordinatorService = new AgentCoordinatorService();

    /**
     * Get all agents for the current user
     */
    static async getUserAgents(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get user's agents
            const agents = await this.agentCoordinatorService.getUserAgents(userId);

            return successResponse(res, agents, 'Agents retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve agents';
            return errorResponse(res, message);
        }
    }

    /**
     * Update agent configuration
     */
    static async updateAgentConfiguration(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const configuration = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get the agent to verify ownership
            const agents = await this.agentCoordinatorService.getUserAgents(userId);
            const agent = agents.find(a => a.id === id);

            if (!agent) {
                return notFoundResponse(res, 'Agent not found or does not belong to user');
            }

            // Update agent configuration
            const updatedAgent = await this.agentCoordinatorService.updateAgentConfiguration(id, configuration);

            return successResponse(res, updatedAgent, 'Agent configuration updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update agent configuration';
            return errorResponse(res, message);
        }
    }

    /**
     * Get pending agent actions for a conversation
     */
    static async getPendingActions(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { conversationId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get pending actions
            const actions = await this.agentCoordinatorService.getPendingActionsForConversation(conversationId);

            return successResponse(res, actions, 'Pending actions retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve pending actions';
            return errorResponse(res, message);
        }
    }

    /**
     * Approve an agent action
     */
    static async approveAction(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { actionId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Approve and execute the action
            const action = await this.agentCoordinatorService.approveAction(actionId);

            return successResponse(res, action, 'Action approved and executed successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to approve action';
            return errorResponse(res, message);
        }
    }

    /**
     * Reject an agent action
     */
    static async rejectAction(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { actionId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Reject the action
            const action = await this.agentCoordinatorService.rejectAction(actionId);

            return successResponse(res, action, 'Action rejected successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to reject action';
            return errorResponse(res, message);
        }
    }

    /**
     * Process a message with agents
     */
    static async processMessage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { messageId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Process the message with all agents
            const actions = await this.agentCoordinatorService.processMessage(messageId);

            return successResponse(res, actions, 'Message processed successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to process message';
            return errorResponse(res, message);
        }
    }

    /**
     * Initialize agents for a new user
     */
    static async initializeAgentsForUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Initialize default agents for the user
            await this.agentCoordinatorService.initializeAgentsForUser(userId);

            return successResponse(res, null, 'Agents initialized successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to initialize agents';
            return errorResponse(res, message);
        }
    }
}