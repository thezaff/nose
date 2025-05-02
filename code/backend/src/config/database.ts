import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Create and export the AppDataSource
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ai_pkm',
    synchronize: process.env.NODE_ENV === 'development', // Auto-create database schema in development
    logging: process.env.NODE_ENV === 'development',
    entities: [path.join(__dirname, '../entity/**/*.{ts,js}')],
    migrations: [path.join(__dirname, '../migration/**/*.{ts,js}')],
    subscribers: [path.join(__dirname, '../subscriber/**/*.{ts,js}')],
});

// Function to initialize the database connection
export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log('Database connection established successfully');
    } catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};