/**
 * User service for handling user-related business logic
 */

import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entity/User';

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// User repository
const userRepository = AppDataSource.getRepository(User);

export class UserService {
    /**
     * Register a new user
     */
    static async register(email: string, password: string, preferences?: Record<string, any>): Promise<User> {
        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User();
        user.email = email;
        user.passwordHash = passwordHash;
        user.preferences = preferences || {};

        // Save user to database
        return await userRepository.save(user);
    }

    /**
     * Login user and generate JWT token
     */
    static async login(email: string, password: string): Promise<{ user: User; token: string }> {
        // Find user by email
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN } as SignOptions
        );

        return { user, token };
    }

    /**
     * Get user by ID
     */
    static async getUserById(id: string): Promise<User> {
        const user = await userRepository.findOne({ where: { id } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    /**
     * Update user preferences
     */
    static async updatePreferences(userId: string, preferences: Record<string, any>): Promise<User> {
        const user = await this.getUserById(userId);

        // Update preferences
        user.preferences = { ...user.preferences, ...preferences };

        // Save updated user
        return await userRepository.save(user);
    }

    /**
     * Change user password
     */
    static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User> {
        const user = await this.getUserById(userId);

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Current password is incorrect');
        }

        // Hash new password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.passwordHash = passwordHash;

        // Save updated user
        return await userRepository.save(user);
    }
}