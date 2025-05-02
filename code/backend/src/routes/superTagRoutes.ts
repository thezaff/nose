/**
 * SuperTag routes
 */

import { Router } from 'express';
import { SuperTagController } from '../controllers/superTagController';
import { authenticate } from '../middleware/auth';
import { validateSuperTag, validateUUID } from '../middleware/validator';

const router = Router();

// All SuperTag routes require authentication
// @ts-ignore
router.use(authenticate);

// Create SuperTag
// @ts-ignore
router.post('/', validateSuperTag, SuperTagController.createSuperTag);

// Get all SuperTags
// @ts-ignore
router.get('/', SuperTagController.getSuperTagsByUser);

// Get SuperTag by ID
// @ts-ignore
router.get('/:id', validateUUID('id'), SuperTagController.getSuperTagById);

// Update SuperTag
// @ts-ignore
router.put('/:id', validateUUID('id'), validateSuperTag, SuperTagController.updateSuperTag);

// Delete SuperTag
// @ts-ignore
router.delete('/:id', validateUUID('id'), SuperTagController.deleteSuperTag);

// Add field to SuperTag
// @ts-ignore
router.post('/:id/fields', validateUUID('id'), SuperTagController.addField);

// Remove field from SuperTag
// @ts-ignore
router.delete('/:id/fields/:fieldId', validateUUID('id'), validateUUID('fieldId'), SuperTagController.removeField);

// Apply SuperTag to Node
// @ts-ignore
router.post('/:id/nodes/:nodeId', validateUUID('id'), validateUUID('nodeId'), SuperTagController.applyToNode);

// Remove SuperTag from Node
// @ts-ignore
router.delete('/:id/nodes/:nodeId', validateUUID('id'), validateUUID('nodeId'), SuperTagController.removeFromNode);

// Get all Nodes with a specific SuperTag
// @ts-ignore
router.get('/:id/nodes', validateUUID('id'), SuperTagController.getNodesBySuperTag);

export default router;