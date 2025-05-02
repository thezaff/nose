/**
 * Authentication controller
 */

import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import {
    successResponse,
    errorResponse,
    unauthorizedResponse
} from '../utils/responseHandler';
import { sanitizeObject } from '../utils/validator';

export class AuthController {
    /**
     * Register a new user
     */
    static async register(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password, preferences } = req.body;

            // Register user
            const user = await UserService.register(email, password, preferences);

            // Remove sensitive data
            const sanitizedUser = sanitizeObject(user, ['passwordHash']);

            return successResponse(res, sanitizedUser, 'User registered successfully', 201);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Registration failed';
            return errorResponse(res, message, 400);
        }
    }

    /**
     * Login user
     */
    static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            // Login user
            const { user, token } = await UserService.login(email, password);

            // Remove sensitive data
            const sanitizedUser = sanitizeObject(user, ['passwordHash']);

            return successResponse(res, { user: sanitizedUser, token }, 'Login successful');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            return unauthorizedResponse(res, message);
        }
    }

    /**
     * Get current user profile
     */
    static async getProfile(req: Request, res: Response): Promise<Response> {
        try {
            // User is attached to request by auth middleware
            const user = req.user;

            if (!user) {
                return unauthorizedResponse(res);
            }

            // Remove sensitive data
            const sanitizedUser = sanitizeObject(user, ['passwordHash']);

            return successResponse(res, sanitizedUser, 'User profile retrieved successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get user profile';
            return errorResponse(res, message);
        }
    }

    /**
     * Update user preferences
     */
    static async updatePreferences(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { preferences } = req.body;

            if (!userId) {
                return unauthorizedResponse(res);
            }

            // Update preferences
            const user = await UserService.updatePreferences(userId, preferences);

            // Remove sensitive data
            const sanitizedUser = sanitizeObject(user, ['passwordHash']);

            return successResponse(res, sanitizedUser, 'Preferences updated successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update preferences';
            return errorResponse(res, message);
        }
    }

    /**
     * Change user password
     */
    static async changePassword(req: Request, res: Response): Promise<Response> {
        try {
            const userId = req.userId;
            const { currentPassword, newPassword } = req.body;

            if (!userId) {
                return unauthorizedResponse(res);
            }

            // Change password
            await UserService.changePassword(userId, currentPassword, newPassword);

            return successResponse(res, null, 'Password changed successfully');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to change password';
            return errorResponse(res, message, 400);
        }
    }

    /**
     * Logout user (client-side only)
     */
    static async logout(req: Request, res: Response): Promise<Response> {
        // JWT tokens are stateless, so logout is handled on the client side
        // by removing the token from storage
        return successResponse(res, null, 'Logged out successfully');
    }
}