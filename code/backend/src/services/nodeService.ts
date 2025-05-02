/**
 * Node service for handling node-related business logic
 */

import { AppDataSource } from '../config/database';
import { Node } from '../entity/Node';
import { User } from '../entity/User';
import { Link } from '../entity/Link';
import { cacheService } from '../config/cache';
import { In } from 'typeorm';

// Repositories
const nodeRepository = AppDataSource.getRepository(Node);
const linkRepository = AppDataSource.getRepository(Link);

export class NodeService {
    /**
     * Create a new node
     */
    static async createNode(
        userId: string,
        title: string,
        content: string,
        metadata?: Record<string, any>
    ): Promise<Node> {
        // Create new node
        const node = new Node();
        node.title = title;
        node.content = content;
        node.metadata = metadata || {};
        node.userId = userId;

        // Save node to database
        return await nodeRepository.save(node);
    }

    /**
     * Get node by ID
     */
    static async getNodeById(id: string, userId: string): Promise<Node> {
        const node = await nodeRepository.findOne({
            where: { id, userId },
            relations: ['nodeSuperTags', 'nodeSuperTags.superTag', 'fieldValues', 'outgoingLinks', 'incomingLinks']
        });

        if (!node) {
            throw new Error('Node not found');
        }

        return node;
    }

    /**
     * Get all nodes for a user
     */
    static async getNodesByUser(
        userId: string,
        page: number = 1,
        limit: number = 20,
        searchQuery?: string,
        isArchived: boolean = false,
        superTagId?: string,
        sortBy: string = 'createdAt',
        sortOrder: 'ASC' | 'DESC' = 'DESC'
    ): Promise<{ nodes: Node[]; total: number }> {
        // Generate cache key based on parameters
        const cacheKey = `nodes:user:${userId}:page:${page}:limit:${limit}:search:${searchQuery || ''}:archived:${isArchived}:superTag:${superTagId || ''}:sort:${sortBy}:${sortOrder}`;

        // Try to get from cache first
        return await cacheService.getOrSet(
            cacheKey,
            async () => {
                // Build query
                const queryBuilder = nodeRepository.createQueryBuilder('node')
                    .where('node.userId = :userId', { userId })
                    .andWhere('node.isArchived = :isArchived', { isArchived });

                // Add search query if provided
                if (searchQuery) {
                    queryBuilder.andWhere(
                        '(node.title ILIKE :searchQuery OR node.content ILIKE :searchQuery)',
                        { searchQuery: `%${searchQuery}%` }
                    );
                }

                // Filter by superTag if provided
                if (superTagId) {
                    queryBuilder
                        .innerJoin('node.nodeSuperTags', 'nst')
                        .andWhere('nst.superTagId = :superTagId', { superTagId });
                }

                // Add pagination
                const skip = (page - 1) * limit;
                queryBuilder.skip(skip).take(limit);

                // Add sorting
                queryBuilder.orderBy(`node.${sortBy}`, sortOrder);

                // Execute query with optimized count
                const [nodes, total] = await queryBuilder.getManyAndCount();

                return { nodes, total };
            },
            300 // Cache for 5 minutes
        );
    }

    /**
     * Get related nodes for a specific node
     */
    static async getRelatedNodes(
        nodeId: string,
        userId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ nodes: Node[]; total: number }> {
        // Generate cache key
        const cacheKey = `nodes:related:${nodeId}:page:${page}:limit:${limit}`;

        return await cacheService.getOrSet(
            cacheKey,
            async () => {
                // First, get all linked node IDs (both incoming and outgoing)
                const links = await linkRepository.find({
                    where: [
                        { sourceNodeId: nodeId },
                        { targetNodeId: nodeId }
                    ]
                });

                // Extract the related node IDs
                const relatedNodeIds = links.map(link =>
                    link.sourceNodeId === nodeId ? link.targetNodeId : link.sourceNodeId
                );

                if (relatedNodeIds.length === 0) {
                    return { nodes: [], total: 0 };
                }

                // Calculate pagination
                const skip = (page - 1) * limit;

                // Get the related nodes with pagination
                const [nodes, total] = await nodeRepository.findAndCount({
                    where: {
                        id: In(relatedNodeIds),
                        userId
                    },
                    skip,
                    take: limit,
                    order: {
                        createdAt: 'DESC'
                    }
                });

                return { nodes, total };
            },
            300 // Cache for 5 minutes
        );
    }

    /**
     * Update a node
     */
    static async updateNode(
        id: string,
        userId: string,
        updates: Partial<Node>
    ): Promise<Node> {
        // Get node
        const node = await this.getNodeById(id, userId);

        // Update node properties
        if (updates.title !== undefined) node.title = updates.title;
        if (updates.content !== undefined) node.content = updates.content;
        if (updates.metadata !== undefined) node.metadata = { ...node.metadata, ...updates.metadata };
        if (updates.isArchived !== undefined) node.isArchived = updates.isArchived;

        // Save updated node
        const updatedNode = await nodeRepository.save(node);

        // Clear related caches
        await cacheService.clearByPrefix(`nodes:user:${userId}`);
        await cacheService.clearByPrefix(`nodes:related:${id}`);

        return updatedNode;
    }

    /**
     * Archive a node
     */
    static async archiveNode(id: string, userId: string): Promise<Node> {
        return await this.updateNode(id, userId, { isArchived: true });
    }

    /**
     * Restore an archived node
     */
    static async restoreNode(id: string, userId: string): Promise<Node> {
        return await this.updateNode(id, userId, { isArchived: false });
    }

    /**
     * Delete a node
     */
    static async deleteNode(id: string, userId: string): Promise<boolean> {
        // Get node
        const node = await this.getNodeById(id, userId);

        // Delete node
        await nodeRepository.remove(node);

        // Clear related caches
        await cacheService.clearByPrefix(`nodes:user:${userId}`);
        await cacheService.clearByPrefix(`nodes:related:${id}`);

        return true;
    }
}