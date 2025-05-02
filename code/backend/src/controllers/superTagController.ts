/**
 * SuperTag controller
 */

import { Request, Response } from 'express';
import { SuperTagService } from '../services/superTagService';
import {
    successResponse,
    errorResponse,
    notFoundResponse
} from '../utils/responseHandler';

export class SuperTagController {
    /**
     * Create a new SuperTag
     */
    static async createSuperTag(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { name, description } = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Create SuperTag
            const superTag = await SuperTagService.createSuperTag(userId, name, description);

            return successResponse(res, superTag, 'SuperTag created successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create SuperTag';
            return errorResponse(res, message);
        }
    }

    /**
     * Get SuperTag by ID
     */
    static async getSuperTagById(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Get SuperTag
            const superTag = await SuperTagService.getSuperTagById(id, userId);

            return successResponse(res, superTag, 'SuperTag retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve SuperTag';
            return notFoundResponse(res, message);
        }
    }

    /**
     * Get all SuperTags for a user
     */
    static async getSuperTagsByUser(req: Request, res: Response): Promise<Response> {
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

            // Get SuperTags
            const { superTags, total } = await SuperTagService.getSuperTagsByUser(
                userId,
                pageNum,
                limitNum,
                searchQuery
            );

            return successResponse(
                res,
                {
                    superTags,
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum)
                },
                'SuperTags retrieved successfully'
            );
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to retrieve SuperTags';
            return errorResponse(res, message);
        }
    }

    /**
     * Update a SuperTag
     */
    static async updateSuperTag(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const updates = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Update SuperTag
            const superTag = await SuperTagService.updateSuperTag(id, userId, updates);

            return successResponse(res, superTag, 'SuperTag updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update SuperTag';
            return errorResponse(res, message);
        }
    }

    /**
     * Delete a SuperTag
     */
    static async deleteSuperTag(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Delete SuperTag
            await SuperTagService.deleteSuperTag(id, userId);

            return successResponse(res, null, 'SuperTag deleted successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete SuperTag';
            return errorResponse(res, message);
        }
    }

    /**
     * Add a field to a SuperTag
     */
    static async addField(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { name, type, required, options } = req.body;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Add field
            const field = await SuperTagService.addField(
                id,
                userId,
                name,
                type,
                required,
                options
            );

            return successResponse(res, field, 'Field added successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to add field';
            return errorResponse(res, message);
        }
    }

    /**
     * Remove a field from a SuperTag
     */
    static async removeField(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id, fieldId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Remove field
            await SuperTagService.removeField(fieldId, userId);

            return successResponse(res, null, 'Field removed successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to remove field';
            return errorResponse(res, message);
        }
    }

    /**
     * Apply a SuperTag to a Node
     */
    static async applyToNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id, nodeId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Apply SuperTag to Node
            const nodeSuperTag = await SuperTagService.applyToNode(id, nodeId, userId);

            return successResponse(res, nodeSuperTag, 'SuperTag applied to Node successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to apply SuperTag to Node';
            return errorResponse(res, message);
        }
    }

    /**
     * Remove a SuperTag from a Node
     */
    static async removeFromNode(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id, nodeId } = req.params;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Remove SuperTag from Node
            await SuperTagService.removeFromNode(id, nodeId, userId);

            return successResponse(res, null, 'SuperTag removed from Node successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to remove SuperTag from Node';
            return errorResponse(res, message);
        }
    }

    /**
     * Get all Nodes with a specific SuperTag
     */
    static async getNodesBySuperTag(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { id } = req.params;
            const { page = '1', limit = '20' } = req.query;

            if (!userId) {
                return errorResponse(res, 'User ID is required', 401);
            }

            // Parse query parameters
            const pageNum = parseInt(page as string, 10);
            const limitNum = parseInt(limit as string, 10);

            // Get Nodes
            const { nodes, total } = await SuperTagService.getNodesBySuperTag(
                id,
                userId,
                pageNum,
                limitNum
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
            const message = error instanceof Error ? error.message : 'Failed to retrieve Nodes';
            return errorResponse(res, message);
        }
    }
}