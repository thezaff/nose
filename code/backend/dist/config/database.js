"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config();
// Create and export the AppDataSource
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'ai_pkm',
    synchronize: process.env.NODE_ENV === 'development', // Auto-create database schema in development
    logging: process.env.NODE_ENV === 'development',
    entities: [path_1.default.join(__dirname, '../entity/**/*.{ts,js}')],
    migrations: [path_1.default.join(__dirname, '../migration/**/*.{ts,js}')],
    subscribers: [path_1.default.join(__dirname, '../subscriber/**/*.{ts,js}')],
});
// Function to initialize the database connection
const initializeDatabase = async () => {
    try {
        await exports.AppDataSource.initialize();
        console.log('Database connection established successfully');
    }
    catch (error) {
        console.error('Error during database initialization:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=database.js.map