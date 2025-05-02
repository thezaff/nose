/**
 * Authentication routes
 */

import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegistration, validateLogin } from '../middleware/validator';

const router = Router();

// Public routes
// @ts-ignore - TypeScript doesn't like the return type of the controller methods
router.post('/register', validateRegistration, AuthController.register);
// @ts-ignore
router.post('/login', validateLogin, AuthController.login);
// @ts-ignore
router.post('/logout', AuthController.logout);

// Protected routes
// @ts-ignore
router.get('/profile', authenticate, AuthController.getProfile);
// @ts-ignore
router.put('/preferences', authenticate, AuthController.updatePreferences);
// @ts-ignore
router.put('/change-password', authenticate, AuthController.changePassword);

export default router;