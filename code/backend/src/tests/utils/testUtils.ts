import { Express } from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { User } from '../../entity';
import { AppDataSource } from '../../config/database';

/**
 * Create a test user and return the user object and auth token
 */
export const createTestUser = async (): Promise<{ user: User; token: string }> => {
    const userRepository = AppDataSource.getRepository(User);

    // Create a test user
    const user = new User();
    user.email = `test-${Date.now()}@example.com`;
    user.passwordHash = 'hashedPassword'; // In a real test, you'd use bcrypt
    user.preferences = {
        theme: 'light',
        agents: {
            organization: { enabled: true },
            connection: { enabled: true },
            query: { enabled: true, autoExecute: true },
            summary: { enabled: true }
        }
    };

    await userRepository.save(user);

    // Generate a token for the user
    const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'test_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } as jwt.SignOptions
    );

    return { user, token };
};

/**
 * Clean up test data
 */
export const cleanupTestData = async (): Promise<void> => {
    // Add cleanup logic for test data here
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.delete({ email: Like('test-%@example.com') });
};

/**
 * Helper to make authenticated requests
 */
export const authRequest = (app: Express, token: string) => {
    return {
        get: (url: string) => request(app).get(url).set('Authorization', `Bearer ${token}`),
        post: (url: string, body?: any) => request(app).post(url).set('Authorization', `Bearer ${token}`).send(body),
        put: (url: string, body?: any) => request(app).put(url).set('Authorization', `Bearer ${token}`).send(body),
        delete: (url: string) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
    };
};

// Import TypeORM operators
import { Like } from 'typeorm';