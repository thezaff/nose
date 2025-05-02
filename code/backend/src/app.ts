import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import nodeRoutes from './routes/nodeRoutes';
import superTagRoutes from './routes/superTagRoutes';
import conversationRoutes from './routes/conversationRoutes';
import agentRoutes from './routes/agentRoutes';
import { errorResponse } from './utils/responseHandler';
import logger, { stream } from './config/logger';

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup request logging
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream }));

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
    res.send('AI PKM API is running');
});

// Import and use routes
app.use('/api/auth', authRoutes);
app.use('/api/nodes', nodeRoutes);
app.use('/api/supertags', superTagRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/agents', agentRoutes);

// Error handling middleware
// @ts-ignore
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error('Error processing request', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        ip: req.ip
    });
    return errorResponse(res, err.message || 'Internal Server Error');
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Metrics endpoint for Prometheus
app.get('/metrics', (req: Request, res: Response) => {
    // In a real implementation, you would use a library like prom-client
    // to collect and expose metrics
    res.status(200).json({
        status: 'ok',
        metrics: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        }
    });
});

export default app;