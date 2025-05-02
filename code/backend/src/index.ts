import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import app from './app';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 3001;

// Initialize database and start server
const startServer = async () => {
    try {
        // Initialize database connection
        await initializeDatabase();

        // Start the server
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();