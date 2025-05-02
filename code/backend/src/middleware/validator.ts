/**
 * Request validation middleware
 */

import { Request, Response, NextFunction } from 'express';
import { validationErrorResponse } from '../utils/responseHandler';
import { validateRequiredFields, isValidEmail, isValidPassword, isValidUUID } from '../utils/validator';

// Middleware to validate user registration
export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const errors: Record<string, string> = {};

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['email', 'password']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    // Validate email
    if (!isValidEmail(email)) {
        errors.email = 'Invalid email format';
    }

    // Validate password
    if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 8 characters and contain at least one letter and one number';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

// Middleware to validate login
export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['email', 'password']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    next();
};

// Middleware to validate UUID parameters
export const validateUUID = (paramName: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const id = req.params[paramName];

        if (!id || !isValidUUID(id)) {
            return validationErrorResponse(res, {
                message: `Invalid ${paramName} format`,
                [paramName]: 'Must be a valid UUID'
            });
        }

        next();
    };
};

// Middleware to validate Node creation/update
export const validateNode = (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    const errors: Record<string, string> = {};

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['title', 'content']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    // Validate title
    if (title.trim().length < 1) {
        errors.title = 'Title cannot be empty';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

// Middleware to validate SuperTag creation/update
export const validateSuperTag = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const errors: Record<string, string> = {};

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['name']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    // Validate name
    if (name.trim().length < 1) {
        errors.name = 'Name cannot be empty';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

// Middleware to validate Conversation creation/update
export const validateConversation = (req: Request, res: Response, next: NextFunction) => {
    const { title } = req.body;
    const errors: Record<string, string> = {};

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['title']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    // Validate title
    if (title.trim().length < 1) {
        errors.title = 'Title cannot be empty';
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};

// Middleware to validate Message creation
export const validateMessage = (req: Request, res: Response, next: NextFunction) => {
    const { content, role } = req.body;
    const errors: Record<string, string> = {};

    // Check required fields
    const missingFields = validateRequiredFields(req.body, ['content', 'role']);
    if (missingFields.length > 0) {
        return validationErrorResponse(res, {
            message: 'Missing required fields',
            fields: missingFields
        });
    }

    // Validate content
    if (content.trim().length < 1) {
        errors.content = 'Content cannot be empty';
    }

    // Validate role
    const validRoles = ['user', 'assistant', 'system'];
    if (!validRoles.includes(role)) {
        errors.role = `Role must be one of: ${validRoles.join(', ')}`;
    }

    // Return errors if any
    if (Object.keys(errors).length > 0) {
        return validationErrorResponse(res, errors);
    }

    next();
};