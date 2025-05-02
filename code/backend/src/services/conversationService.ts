/**
 * Conversation service for handling conversation and message-related business logic
 */

import { AppDataSource } from '../config/database';
import { Conversation } from '../entity/Conversation';
import { Message } from '../entity/Message';

// Repositories
const conversationRepository = AppDataSource.getRepository(Conversation);
const messageRepository = AppDataSource.getRepository(Message);

export class ConversationService {
    /**
     * Create a new conversation
     */
    static async createConversation(
        userId: string,
        title: string,
        context?: Record<string, any>
    ): Promise<Conversation> {
        // Create new conversation
        const conversation = new Conversation();
        conversation.title = title;
        conversation.context = context || {};
        conversation.userId = userId;

        // Save conversation to database
        return await conversationRepository.save(conversation);
    }

    /**
     * Get conversation by ID
     */
    static async getConversationById(id: string, userId: string): Promise<Conversation> {
        const conversation = await conversationRepository.findOne({
            where: { id, userId },
            relations: ['messages']
        });

        if (!conversation) {
            throw new Error('Conversation not found');
        }

        return conversation;
    }

    /**
     * Get all conversations for a user
     */
    static async getConversationsByUser(
        userId: string,
        page: number = 1,
        limit: number = 20,
        searchQuery?: string
    ): Promise<{ conversations: Conversation[]; total: number }> {
        // Build query
        const queryBuilder = conversationRepository.createQueryBuilder('conversation')
            .where('conversation.userId = :userId', { userId });

        // Add search query if provided
        if (searchQuery) {
            queryBuilder.andWhere(
                'conversation.title ILIKE :searchQuery',
                { searchQuery: `%${searchQuery}%` }
            );
        }

        // Add pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Order by update date (newest first)
        queryBuilder.orderBy('conversation.updatedAt', 'DESC');

        // Execute query
        const [conversations, total] = await queryBuilder.getManyAndCount();

        return { conversations, total };
    }

    /**
     * Update a conversation
     */
    static async updateConversation(
        id: string,
        userId: string,
        updates: Partial<Conversation>
    ): Promise<Conversation> {
        // Get conversation
        const conversation = await this.getConversationById(id, userId);

        // Update conversation properties
        if (updates.title !== undefined) conversation.title = updates.title;
        if (updates.context !== undefined) conversation.context = { ...conversation.context, ...updates.context };

        // Save updated conversation
        return await conversationRepository.save(conversation);
    }

    /**
     * Delete a conversation
     */
    static async deleteConversation(id: string, userId: string): Promise<boolean> {
        // Get conversation
        const conversation = await this.getConversationById(id, userId);

        // Delete conversation
        await conversationRepository.remove(conversation);

        return true;
    }

    /**
     * Add a message to a conversation
     */
    static async addMessage(
        conversationId: string,
        userId: string,
        content: string,
        role: string,
        nodeReferences?: string[],
        entities?: Record<string, any>
    ): Promise<Message> {
        // Get conversation
        const conversation = await this.getConversationById(conversationId, userId);

        // Create new message
        const message = new Message();
        message.content = content;
        message.role = role;
        message.nodeReferences = nodeReferences || [];
        message.entities = entities || {};
        message.conversation = conversation;
        message.conversationId = conversationId;

        // Save message to database
        return await messageRepository.save(message);
    }

    /**
     * Get messages for a conversation
     */
    static async getMessages(
        conversationId: string,
        userId: string,
        page: number = 1,
        limit: number = 50
    ): Promise<{ messages: Message[]; total: number }> {
        // Get conversation
        await this.getConversationById(conversationId, userId);

        // Build query
        const queryBuilder = messageRepository.createQueryBuilder('message')
            .where('message.conversationId = :conversationId', { conversationId });

        // Add pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Order by creation date (oldest first for chat history)
        queryBuilder.orderBy('message.createdAt', 'ASC');

        // Execute query
        const [messages, total] = await queryBuilder.getManyAndCount();

        return { messages, total };
    }

    /**
     * Delete a message
     */
    static async deleteMessage(messageId: string, userId: string): Promise<boolean> {
        // Get message with conversation
        const message = await messageRepository.findOne({
            where: { id: messageId },
            relations: ['conversation']
        });

        if (!message) {
            throw new Error('Message not found');
        }

        // Check if conversation belongs to user
        if (message.conversation.userId !== userId) {
            throw new Error('Unauthorized access to message');
        }

        // Delete message
        await messageRepository.remove(message);

        return true;
    }
}