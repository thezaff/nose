/**
 * Node controller
 */

import { Request, Response } from 'express';
import { NodeService } from '../services/nodeService';
import {
    successResponse,
    errorResponse,
    notFoundResponse
} from '../utils/responseHandler';

export class NodeController {
    /**
     * Create a new node
     */
    static async createNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { title, content, metadata } = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Create node
            const node = await NodeService.createNode(userId, title, content, metadata);

            return successResponse(res, node, 'Node created successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create node';
            return errorResponse(res, message);
        }
    }

    /**
     * Get node by ID
     */
    static async getNodeById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get node
            const node = await NodeService.getNodeById(id, userId);

            return successResponse(res, node, 'Node retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve node';
            return notFoundResponse(res, message);
        }
    }

    /**
     * Get all nodes for a user
     */
    static async getNodesByUser(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { page = '1', limit = '20', search, archived = 'false' } = req.query;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Parse query parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);
            const searchQuery = search as string;
            const isArchived = archived === 'true';

            // Get nodes
            const { nodes, total } = await NodeService.getNodesByUser(
                userId,
                pageNum,
                limitNum,
                searchQuery,
                isArchived
            );

            return successResponse(
                res,
                {
                    nodes,
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                },
                'Nodes retrieved successfully'
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve nodes';
            return errorResponse(res, message);
        }
    }

    /**
     * Update a node
     */
    static async updateNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const updates = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Update node
            const node = await NodeService.updateNode(id, userId, updates);

            return successResponse(res, node, 'Node updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update node';
            return errorResponse(res, message);
        }
    }

    /**
     * Archive a node
     */
    static async archiveNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Archive node
            const node = await NodeService.archiveNode(id, userId);

            return successResponse(res, node, 'Node archived successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to archive node';
            return errorResponse(res, message);
        }
    }

    /**
     * Restore an archived node
     */
    static async restoreNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Restore node
            const node = await NodeService.restoreNode(id, userId);

            return successResponse(res, node, 'Node restored successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to restore node';
            return errorResponse(res, message);
        }
    }

    /**
     * Delete a node
     */
    static async deleteNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Delete node
            await NodeService.deleteNode(id, userId);

            return successResponse(res, null, 'Node deleted successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete node';
            return errorResponse(res, message);
        }
    }
}