/**
 * Conversation routes
 */

import { Router } from 'express';
import { ConversationController } from '../controllers/conversationController';
import { authenticate } from '../middleware/auth';
import { validateConversation, validateMessage, validateUUID } from '../middleware/validator';

const router = Router();

// All conversation routes require authentication
// @ts-ignore
router.use(authenticate);

// Create conversation
// @ts-ignore
router.post('/', validateConversation, ConversationController.createConversation);

// Get all conversations
// @ts-ignore
router.get('/', ConversationController.getConversationsByUser);

// Get conversation by ID
// @ts-ignore
router.get('/:id', validateUUID('id'), ConversationController.getConversationById);

// Update conversation
// @ts-ignore
router.put('/:id', validateUUID('id'), validateConversation, ConversationController.updateConversation);

// Delete conversation
// @ts-ignore
router.delete('/:id', validateUUID('id'), ConversationController.deleteConversation);

// Add message to conversation
// @ts-ignore
router.post('/:id/messages', validateUUID('id'), validateMessage, ConversationController.addMessage);

// Get messages for a conversation
// @ts-ignore
router.get('/:id/messages', validateUUID('id'), ConversationController.getMessages);

// Delete a message
// @ts-ignore
router.delete('/:id/messages/:messageId', validateUUID('id'), validateUUID('messageId'), ConversationController.deleteMessage);

export default router;