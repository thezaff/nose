/**
 * Conversation controller
 */

import { Request, Response } from 'express';
import { ConversationService } from '../services/conversationService';
import {
    successResponse,
    errorResponse,
    notFoundResponse
} from '../utils/responseHandler';

export class ConversationController {
    /**
     * Create a new conversation
     */
    static async createConversation(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { title, context } = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Create conversation
            const conversation = await ConversationService.createConversation(userId, title, context);

            return successResponse(res, conversation, 'Conversation created successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create conversation';
            return errorResponse(res, message);
        }
    }

    /**
     * Get conversation by ID
     */
    static async getConversationById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get conversation
            const conversation = await ConversationService.getConversationById(id, userId);

            return successResponse(res, conversation, 'Conversation retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve conversation';
            return notFoundResponse(res, message);
        }
    }

    /**
     * Get all conversations for a user
     */
    static async getConversationsByUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { page = '1', limit = '20', search } = req.query;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Parse query parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);
            const searchQuery = search as string;

            // Get conversations
            const { conversations, total } = await ConversationService.getConversationsByUser(
                userId,
                pageNum,
                limitNum,
                searchQuery
            );

            return successResponse(
                res,
                {
                    conversations,
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                },
                'Conversations retrieved successfully'
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve conversations';
            return errorResponse(res, message);
        }
    }

    /**
     * Update a conversation
     */
    static async updateConversation(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const updates = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Update conversation
            const conversation = await ConversationService.updateConversation(id, userId, updates);

            return successResponse(res, conversation, 'Conversation updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update conversation';
            return errorResponse(res, message);
        }
    }

    /**
     * Delete a conversation
     */
    static async deleteConversation(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Delete conversation
            await ConversationService.deleteConversation(id, userId);

            return successResponse(res, null, 'Conversation deleted successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete conversation';
            return errorResponse(res, message);
        }
    }

    /**
     * Add a message to a conversation
     */
    static async addMessage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { content, role, nodeReferences, entities } = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Add message
            const message = await ConversationService.addMessage(
                id,
                userId,
                content,
                role,
                nodeReferences,
                entities
            );

            return successResponse(res, message, 'Message added successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add message';
            return errorResponse(res, message);
        }
    }

    /**
     * Get messages for a conversation
     */
    static async getMessages(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { page = '1', limit = '50' } = req.query;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Parse query parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            // Get messages
            const { messages, total } = await ConversationService.getMessages(
                id,
                userId,
                pageNum,
                limitNum
            );

            return successResponse(
                res,
                {
                    messages,
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                },
                'Messages retrieved successfully'
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve messages';
            return errorResponse(res, message);
        }
    }

    /**
     * Delete a message
     */
    static async deleteMessage(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id, messageId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Delete message
            await ConversationService.deleteMessage(messageId, userId);

            return successResponse(res, null, 'Message deleted successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete message';
            return errorResponse(res, message);
        }
    }
}