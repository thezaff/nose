/**
 * Script to run database migrations
 * Usage: npm run migration:run
 */

import { AppDataSource } from '../config/database';
import logger from '../config/logger';

async function runMigrations() {
    try {
        // Initialize the data source
        await AppDataSource.initialize();
        logger.info('Database connection established');

        // Run migrations
        const migrations = await AppDataSource.runMigrations();

        if (migrations.length === 0) {
            logger.info('No migrations to run');
        } else {
            logger.info(`Successfully ran ${migrations.length} migrations:`);
            migrations.forEach(migration => {
                logger.info(`- ${migration.name}`);
            });
        }

        // Close the connection
        await AppDataSource.destroy();
        logger.info('Database connection closed');

        process.exit(0);
    } catch (error) {
        logger.error('Error running migrations:', error);
        process.exit(1);
    }
}

// Run the migrations
runMigrations();