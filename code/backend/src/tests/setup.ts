import { AppDataSource } from '../config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.test' });

// Global setup before all tests
beforeAll(async () => {
    // Initialize the test database connection
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        console.log('Test database connection established');
    } catch (error) {
        console.error('Error during test database initialization:', error);
        throw error;
    }
});

// Global teardown after all tests
afterAll(async () => {
    // Close the database connection
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        console.log('Test database connection closed');
    }
});