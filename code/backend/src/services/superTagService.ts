/**
 * SuperTag service for handling supertag-related business logic
 */

import { AppDataSource } from '../config/database';
import { SuperTag } from '../entity/SuperTag';
import { Field } from '../entity/Field';
import { NodeSuperTag } from '../entity/NodeSuperTag';
import { Node } from '../entity/Node';

// Repositories
const superTagRepository = AppDataSource.getRepository(SuperTag);
const fieldRepository = AppDataSource.getRepository(Field);
const nodeSuperTagRepository = AppDataSource.getRepository(NodeSuperTag);
const nodeRepository = AppDataSource.getRepository(Node);

export class SuperTagService {
    /**
     * Create a new SuperTag
     */
    static async createSuperTag(
        userId: string,
        name: string,
        description?: string
    ): Promise<SuperTag> {
        // Create new SuperTag
        const superTag = new SuperTag();
        superTag.name = name;
        superTag.description = description || '';
        superTag.userId = userId;

        // Save SuperTag to database
        return await superTagRepository.save(superTag);
    }

    /**
     * Get SuperTag by ID
     */
    static async getSuperTagById(id: string, userId: string): Promise<SuperTag> {
        const superTag = await superTagRepository.findOne({
            where: { id, userId },
            relations: ['fields', 'nodeSuperTags', 'nodeSuperTags.node']
        });

        if (!superTag) {
            throw new Error('SuperTag not found');
        }

        return superTag;
    }

    /**
     * Get all SuperTags for a user
     */
    static async getSuperTagsByUser(
        userId: string,
        page: number = 1,
        limit: number = 20,
        searchQuery?: string
    ): Promise<{ superTags: SuperTag[]; total: number }> {
        // Build query
        const queryBuilder = superTagRepository.createQueryBuilder('superTag')
            .where('superTag.userId = :userId', { userId });

        // Add search query if provided
        if (searchQuery) {
            queryBuilder.andWhere(
                '(superTag.name ILIKE :searchQuery OR superTag.description ILIKE :searchQuery)',
                { searchQuery: `%${searchQuery}%` }
            );
        }

        // Add pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Order by name
        queryBuilder.orderBy('superTag.name', 'ASC');

        // Execute query
        const [superTags, total] = await queryBuilder.getManyAndCount();

        return { superTags, total };
    }

    /**
     * Update a SuperTag
     */
    static async updateSuperTag(
        id: string,
        userId: string,
        updates: Partial<SuperTag>
    ): Promise<SuperTag> {
        // Get SuperTag
        const superTag = await this.getSuperTagById(id, userId);

        // Update SuperTag properties
        if (updates.name !== undefined) superTag.name = updates.name;
        if (updates.description !== undefined) superTag.description = updates.description;

        // Save updated SuperTag
        return await superTagRepository.save(superTag);
    }

    /**
     * Delete a SuperTag
     */
    static async deleteSuperTag(id: string, userId: string): Promise<boolean> {
        // Get SuperTag
        const superTag = await this.getSuperTagById(id, userId);

        // Delete SuperTag
        await superTagRepository.remove(superTag);

        return true;
    }

    /**
     * Add a field to a SuperTag
     */
    static async addField(
        superTagId: string,
        userId: string,
        name: string,
        type: string,
        required: boolean = false,
        options?: Record<string, any>
    ): Promise<Field> {
        // Get SuperTag
        const superTag = await this.getSuperTagById(superTagId, userId);

        // Create new field
        const field = new Field();
        field.name = name;
        field.type = type;
        field.isRequired = required;
        field.defaultValue = options ? JSON.stringify(options) : '';
        field.superTag = superTag;

        // Save field to database
        return await fieldRepository.save(field);
    }

    /**
     * Remove a field from a SuperTag
     */
    static async removeField(fieldId: string, userId: string): Promise<boolean> {
        // Get field with SuperTag
        const field = await fieldRepository.findOne({
            where: { id: fieldId },
            relations: ['superTag']
        });

        if (!field) {
            throw new Error('Field not found');
        }

        // Check if SuperTag belongs to user
        if (field.superTag.userId !== userId) {
            throw new Error('Unauthorized access to field');
        }

        // Delete field
        await fieldRepository.remove(field);

        return true;
    }

    /**
     * Apply a SuperTag to a Node
     */
    static async applyToNode(
        superTagId: string,
        nodeId: string,
        userId: string
    ): Promise<NodeSuperTag> {
        // Get SuperTag and Node
        const superTag = await this.getSuperTagById(superTagId, userId);
        const node = await nodeRepository.findOne({ where: { id: nodeId, userId } });

        if (!node) {
            throw new Error('Node not found');
        }

        // Check if NodeSuperTag already exists
        const existingNodeSuperTag = await nodeSuperTagRepository.findOne({
            where: { nodeId, superTagId }
        });

        if (existingNodeSuperTag) {
            return existingNodeSuperTag;
        }

        // Create new NodeSuperTag
        const nodeSuperTag = new NodeSuperTag();
        nodeSuperTag.node = node;
        nodeSuperTag.superTag = superTag;

        // Save NodeSuperTag to database
        return await nodeSuperTagRepository.save(nodeSuperTag);
    }

    /**
     * Remove a SuperTag from a Node
     */
    static async removeFromNode(
        superTagId: string,
        nodeId: string,
        userId: string
    ): Promise<boolean> {
        // Get NodeSuperTag
        const nodeSuperTag = await nodeSuperTagRepository.findOne({
            where: { nodeId, superTagId },
            relations: ['node', 'superTag']
        });

        if (!nodeSuperTag) {
            throw new Error('Node does not have this SuperTag');
        }

        // Check if Node and SuperTag belong to user
        if (nodeSuperTag.node.userId !== userId || nodeSuperTag.superTag.userId !== userId) {
            throw new Error('Unauthorized access');
        }

        // Delete NodeSuperTag
        await nodeSuperTagRepository.remove(nodeSuperTag);

        return true;
    }

    /**
     * Get all Nodes with a specific SuperTag
     */
    static async getNodesBySuperTag(
        superTagId: string,
        userId: string,
        page: number = 1,
        limit: number = 20
    ): Promise<{ nodes: Node[]; total: number }> {
        // Get SuperTag
        await this.getSuperTagById(superTagId, userId);

        // Build query
        const queryBuilder = nodeRepository.createQueryBuilder('node')
            .innerJoin('node.nodeSuperTags', 'nodeSuperTag', 'nodeSuperTag.superTagId = :superTagId', { superTagId })
            .where('node.userId = :userId', { userId })
            .andWhere('node.isArchived = :isArchived', { isArchived: false });

        // Add pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Order by creation date (newest first)
        queryBuilder.orderBy('node.createdAt', 'DESC');

        // Execute query
        const [nodes, total] = await queryBuilder.getManyAndCount();

        return { nodes, total };
    }
}