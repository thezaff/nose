import request from 'supertest';
import { AppDataSource } from '../../config/database';
import { createTestUser, cleanupTestData } from '../utils/testUtils';
import { User, Node, Link, SuperTag } from '../../entity';

// Import the express app
import app from '../../app';

describe('Knowledge Graph Operations', () => {
    let testUser: User;
    let authToken: string;
    let nodeId1: string;
    let nodeId2: string;
    let superTagId: string;

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

    test('Should create a new node', async () => {
        const response = await request(app)
            .post('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Node 1',
                content: 'This is a test node for knowledge graph testing.'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe('Test Node 1');

        nodeId1 = response.body.data.id;
    });

    test('Should create a second node', async () => {
        const response = await request(app)
            .post('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Test Node 2',
                content: 'This is another test node for knowledge graph testing.'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe('Test Node 2');

        nodeId2 = response.body.data.id;
    });

    test('Should create a supertag', async () => {
        const response = await request(app)
            .post('/api/supertags')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                name: 'Test SuperTag',
                description: 'A test supertag for knowledge organization'
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe('Test SuperTag');

        superTagId = response.body.data.id;
    });

    test('Should apply a supertag to a node', async () => {
        const response = await request(app)
            .post(`/api/nodes/${nodeId1}/supertags`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                superTagId: superTagId
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.nodeSuperTags).toContainEqual(expect.objectContaining({
            superTagId: superTagId
        }));
    });

    test('Should create a link between nodes', async () => {
        const response = await request(app)
            .post('/api/nodes/links')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                sourceNodeId: nodeId1,
                targetNodeId: nodeId2,
                type: 'related',
                strength: 0.8
            });

        expect(response.status).toBe(201);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.sourceNodeId).toBe(nodeId1);
        expect(response.body.data.targetNodeId).toBe(nodeId2);
    });

    test('Should retrieve all nodes', async () => {
        const response = await request(app)
            .get('/api/nodes')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('nodes');
        expect(Array.isArray(response.body.data.nodes)).toBe(true);
        expect(response.body.data.nodes.length).toBeGreaterThanOrEqual(2);

        // Check if our created nodes are in the response
        const nodeIds = response.body.data.nodes.map((node: any) => node.id);
        expect(nodeIds).toContain(nodeId1);
        expect(nodeIds).toContain(nodeId2);
    });

    test('Should retrieve all links', async () => {
        const response = await request(app)
            .get('/api/nodes/links')
            .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('links');
        expect(Array.isArray(response.body.data.links)).toBe(true);
        expect(response.body.data.links.length).toBeGreaterThan(0);

        // Check if our created link is in the response
        const link = response.body.data.links.find(
            (l: any) => l.sourceNodeId === nodeId1 && l.targetNodeId === nodeId2
        );
        expect(link).toBeDefined();
        expect(link.type).toBe('related');
    });

    test('Should update a node', async () => {
        const response = await request(app)
            .put(`/api/nodes/${nodeId1}`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                title: 'Updated Test Node 1',
                content: 'This node has been updated.'
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.title).toBe('Updated Test Node 1');
        expect(response.body.data.content).toBe('This node has been updated.');
    });
});