/**
 * Agent routes
 */

import express from 'express';
import { AgentController } from '../controllers/agentController';
import { authenticate } from '../middleware/auth';
import { createHandler } from '../utils/routeHandler';

const router = express.Router();

// Apply authentication middleware to all agent routes
// @ts-ignore
router.use(authenticate);

// Get all agents for the current user
router.get('/', createHandler(AgentController.getUserAgents));

// Update agent configuration
router.patch('/:id/configuration', createHandler(AgentController.updateAgentConfiguration));

// Get pending agent actions for a conversation
router.get('/actions/conversation/:conversationId', createHandler(AgentController.getPendingActions));

// Approve an agent action
router.post('/actions/:actionId/approve', createHandler(AgentController.approveAction));

// Reject an agent action
router.post('/actions/:actionId/reject', createHandler(AgentController.rejectAction));

// Process a message with agents
router.post('/process-message/:messageId', createHandler(AgentController.processMessage));

// Initialize agents for a new user
router.post('/initialize', createHandler(AgentController.initializeAgentsForUser));

export default router;