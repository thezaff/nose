/**
 * Authentication middleware
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entity/User';
import { unauthorizedResponse } from '../utils/responseHandler';

// Extend Express Request interface to include user property
declare global {
    namespace Express {
        interface Request {
            user?: User;
            userId?: string;
        }
    }
}

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to authenticate JWT token
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return unauthorizedResponse(res, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Find user by id
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            return unauthorizedResponse(res, 'User not found');
        }

        // Attach user to request object
        req.user = user;
        req.userId = user.id;

        next();
    } catch (error) {
        return unauthorizedResponse(res, 'Invalid token');
    }
};

// Optional authentication middleware - doesn't require authentication but attaches user if token is valid
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        // Find user by id
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (user) {
            // Attach user to request object
            req.user = user;
            req.userId = user.id;
        }

        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};