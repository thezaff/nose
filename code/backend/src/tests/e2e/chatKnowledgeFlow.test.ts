import request from 'supertest';
import express from 'express';
import { AppDataSource } from '../../config/database';
import { createTestUser, cleanupTestData } from '../utils/testUtils';
import { User, Conversation, Message, Node } from '../../entity';

// Import the express app
import app from '../../app';

describe('Chat-based Knowledge Creation Flow', () => {
    let testUser: User;
    let authToken: string;
    let conversationId: string;
    let messageId: string;

    beforeAll(async () => {
        // Create a test user and get auth token
        const testData = await createTestUser();
        testUser = testData.user;
        authToken = testData.token;
    });

    afterAll(async () => {
        // Clean up test data
        await cleanupTestData();
    });

    test('Should create a new conversation', async () => {
        const response = await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Test Conversation' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe('Test Conversation');

        conversationId = response.body.data.id;
    });

    test('Should send a message to the conversation', async () => {
        const response = await request(app)
            .post(`/api/conversations/${conversationId}/messages`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ content: 'This is a test message about artificial intelligence and knowledge management.', role: 'user' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.content).toBe('This is a test message about artificial intelligence and knowledge management.');
        expect(response.body.data.role).toBe('user');

        messageId = response.body.data.id;
    });

    test('Should process message with agents', async () => {
        const response = await request(app)
            .post(`/api/agents/process-message/${messageId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('actions');
        expect(Array.isArray(response.body.data.actions)).toBe(true);
    });

    test('Should create a knowledge node from message', async () => {
        const response = await request(app)
            .post(`/api/nodes/from-message/${messageId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'AI and Knowledge Management',
                content: 'This is a test message about artificial intelligence and knowledge management.'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe('AI and Knowledge Management');

        // Verify the node was created in the database
        const nodeRepository = AppDataSource.getRepository(Node);
        const node = await nodeRepository.findOne({ where: { id: response.body.data.id } });
        expect(node).toBeDefined();
        expect(node?.title).toBe('AI and Knowledge Management');
    });

    test('Should retrieve related nodes for a conversation', async () => {
        const response = await request(app)
            .get(`/api/conversations/${conversationId}/related-nodes`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('nodes');
        expect(Array.isArray(response.body.data.nodes)).toBe(true);
        expect(response.body.data.nodes.length).toBeGreaterThan(0);
    });
});