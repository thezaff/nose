/**
 * Node routes
 */

import { Router } from 'express';
import { NodeController } from '../controllers/nodeController';
import { authenticate } from '../middleware/auth';
import { validateNode, validateUUID } from '../middleware/validator';

const router = Router();

// All node routes require authentication
// @ts-ignore
router.use(authenticate);

// Create node
// @ts-ignore
router.post('/', validateNode, NodeController.createNode);

// Get all nodes
// @ts-ignore
router.get('/', NodeController.getNodesByUser);

// Get archived nodes
// @ts-ignore
router.get('/archived', NodeController.getNodesByUser);

// Get node by ID
// @ts-ignore
router.get('/:id', validateUUID('id'), NodeController.getNodeById);

// Update node
// @ts-ignore
router.put('/:id', validateUUID('id'), validateNode, NodeController.updateNode);

// Archive node
// @ts-ignore
router.put('/:id/archive', validateUUID('id'), NodeController.archiveNode);

// Restore node
// @ts-ignore
router.put('/:id/restore', validateUUID('id'), NodeController.restoreNode);

// Delete node
// @ts-ignore
router.delete('/:id', validateUUID('id'), NodeController.deleteNode);

export default router;