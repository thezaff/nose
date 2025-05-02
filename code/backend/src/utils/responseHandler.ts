/**
 * Utility functions for handling API responses and errors
 */

import { Response } from 'express';

// Standard success response
export const successResponse = (res: Response, data: any, message: string = 'Success', statusCode: number = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Error response
export const errorResponse = (res: Response, message: string = 'An error occurred', statusCode: number = 500, errors: any = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        errors
    });
};

// Not found response
export const notFoundResponse = (res: Response, message: string = 'Resource not found') => {
    return errorResponse(res, message, 404);
};

// Validation error response
export const validationErrorResponse = (res: Response, errors: any) => {
    return errorResponse(res, 'Validation error', 400, errors);
};

// Unauthorized response
export const unauthorizedResponse = (res: Response, message: string = 'Unauthorized access') => {
    return errorResponse(res, message, 401);
};

// Forbidden response
export const forbiddenResponse = (res: Response, message: string = 'Access forbidden') => {
    return errorResponse(res, message, 403);
};