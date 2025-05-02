/**
 * Utility for handling Express route handlers
 */

import { Request, Response, NextFunction, RequestHandler } from 'express';

// Type for controller methods that return Response
type ControllerMethod = (req: Request, res: Response, next?: NextFunction) => Promise<Response> | Response;

/**
 * Wraps controller methods to be used as Express route handlers
 * This handles the TypeScript type mismatch between our controller methods (which return Response)
 * and Express route handlers (which should return void)
 */
export const createHandler = (fn: ControllerMethod): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = fn(req, res, next);
            if (result instanceof Promise) {
                result.catch((error) => next(error));
            }
        } catch (error) {
            next(error);
        }
    };
};