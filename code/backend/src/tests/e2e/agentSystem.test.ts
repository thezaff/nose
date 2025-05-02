import request from 'supertest';
import { AppDataSource } from '../../config/database';
import { createTestUser, cleanupTestData } from '../utils/testUtils';
import { User, Agent, AgentAction, Conversation, Message } from '../../entity';

// Import the express app
import app from '../../app';

describe('Agent System Operations', () => {
    let testUser: User;
    let authToken: string;
    let conversationId: string;
    let messageId: string;
    let agentId: string;
    let actionId: string;

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

    test('Should retrieve user agents', async () => {
        const response = await request(app)
            .get('/api/agents')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('agents');
        expect(Array.isArray(response.body.data.agents)).toBe(true);

        // Store an agent ID for later tests
        if (response.body.data.agents.length > 0) {
            agentId = response.body.data.agents[0].id;
        } else {
            // If no agents exist, we'll need to initialize them
            const initResponse = await request(app)
                .post('/api/agents/initialize')
                .set('Authorization', `Bearer ${authToken}`);

            expect(initResponse.status).toBe(200);

            // Fetch agents again
            const agentsResponse = await request(app)
                .get('/api/agents')
                .set('Authorization', `Bearer ${authToken}`);

            expect(agentsResponse.status).toBe(200);
            expect(agentsResponse.body.data.agents.length).toBeGreaterThan(0);

            agentId = agentsResponse.body.data.agents[0].id;
        }
    });

    test('Should create a conversation for agent testing', async () => {
        const response = await request(app)
            .post('/api/conversations')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'Agent Test Conversation' });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');

        conversationId = response.body.data.id;
    });

    test('Should send a message to the conversation', async () => {
        const response = await request(app)
            .post(`/api/conversations/${conversationId}/messages`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                content: 'I need to organize my notes about machine learning and neural networks.',
                role: 'user'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');

        messageId = response.body.data.id;
    });

    test('Should process message with agents', async () => {
        const response = await request(app)
            .post(`/api/agents/process-message/${messageId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('actions');
        expect(Array.isArray(response.body.data.actions)).toBe(true);

        // Store an action ID if any actions were generated
        if (response.body.data.actions.length > 0) {
            actionId = response.body.data.actions[0].id;
        }
    });

    test('Should get pending agent actions for conversation', async () => {
        const response = await request(app)
            .get(`/api/agents/actions/pending/${conversationId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('actions');
        expect(Array.isArray(response.body.data.actions)).toBe(true);
    });

    test('Should approve an agent action if available', async () => {
        // Skip this test if no action was generated
        if (!actionId) {
            console.log('Skipping action approval test - no actions were generated');
            return;
        }

        const response = await request(app)
            .post(`/api/agents/actions/${actionId}/approve`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.id).toBe(actionId);
        expect(response.body.data.approved).toBe(true);
        expect(response.body.data.status).toBe('completed');
    });

    test('Should update agent configuration', async () => {
        const response = await request(app)
            .put(`/api/agents/${agentId}/configuration`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                proactivityLevel: 'high',
                autoExecute: true,
                notifyUser: true
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.id).toBe(agentId);
        expect(response.body.data.configuration).toHaveProperty('proactivityLevel', 'high');
        expect(response.body.data.configuration).toHaveProperty('autoExecute', true);
    });
});