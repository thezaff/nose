# AI-PKM Deployment Guide

This guide provides detailed instructions for setting up and deploying the AI-PKM application in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Production Deployment](#production-deployment)
   - [Docker Deployment](#docker-deployment)
   - [Manual Deployment](#manual-deployment)
4. [Database Migration](#database-migration)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring Setup](#monitoring-setup)
7. [Backup and Recovery](#backup-and-recovery)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying AI-PKM, ensure you have the following:

### Development Environment

- Node.js (v18 or later)
- npm (v9 or later)
- PostgreSQL (v15 or later)
- Redis (v7 or later)
- Git

### Production Environment

- Docker and Docker Compose (for containerized deployment)
- Nginx (for manual deployment)
- PostgreSQL (v15 or later)
- Redis (v7 or later)
- Node.js (v18 or later) (for manual deployment)
- SSL certificate (for HTTPS)

## Development Setup

Follow these steps to set up a development environment:

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/ai-pkm.git
cd ai-pkm
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Use your favorite text editor to modify the .env file

# Run database migrations
npm run migration:run

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:3001>

## Production Deployment

### Docker Deployment

The recommended way to deploy AI-PKM in production is using Docker and Docker Compose.

#### 1. Prepare Environment Files

```bash
# Backend environment
cp backend/.env.example backend/.env
# Edit backend/.env with production settings
```

#### 2. Build and Deploy

```bash
# Build and start all services in detached mode
docker-compose up -d

# Check logs
docker-compose logs -f
```

#### 3. Verify Deployment

- Frontend: <http://your-server-ip> (port 80)
- Backend API: <http://your-server-ip:3001>

### Manual Deployment

If you prefer to deploy without Docker, follow these steps:

#### 1. Backend Deployment

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm ci

# Build the application
npm run build

# Set up environment variables
cp .env.example .env
# Edit .env with production settings

# Run database migrations
npm run migration:run

# Start the server (consider using PM2 or similar)
pm2 start dist/index.js --name ai-pkm-backend
```

#### 2. Frontend Deployment

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm ci

# Build the application
npm run build

# The build output will be in the dist directory
# Configure your web server (e.g., Nginx) to serve these files
```

#### 3. Nginx Configuration

Create an Nginx configuration for the frontend:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/ai-pkm/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migration

### Running Migrations

```bash
# Navigate to backend directory
cd backend

# Run pending migrations
npm run migration:run
```

### Creating New Migrations

```bash
# Generate a migration based on entity changes
npm run migration:generate -- MyMigrationName

# Create an empty migration
npm run migration:create -- MyMigrationName
```

### Reverting Migrations

```bash
# Revert the most recent migration
npm run migration:revert
```

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | production |
| PORT | Backend server port | 3001 |
| DB_HOST | PostgreSQL host | postgres |
| DB_PORT | PostgreSQL port | 5432 |
| DB_USERNAME | PostgreSQL username | postgres |
| DB_PASSWORD | PostgreSQL password | your_password |
| DB_DATABASE | PostgreSQL database name | ai_pkm |
| JWT_SECRET | Secret for JWT tokens | your_jwt_secret |
| JWT_EXPIRES_IN | JWT token expiration | 1h |
| JWT_REFRESH_SECRET | Secret for refresh tokens | your_refresh_secret |
| JWT_REFRESH_EXPIRES_IN | Refresh token expiration | 7d |
| OPENAI_API_KEY | OpenAI API key | your_openai_key |
| REDIS_HOST | Redis host | redis |
| REDIS_PORT | Redis port | 6379 |
| REDIS_PASSWORD | Redis password | your_redis_password |
| REDIS_DB | Redis database number | 0 |

### Frontend Environment

The frontend environment is configured at build time. Create a `.env` file in the frontend directory:

```
VITE_API_URL=http://your-api-url:3001
VITE_APP_NAME=AI-PKM
```

## Monitoring Setup

The Docker Compose configuration includes Prometheus and Grafana for monitoring.

### Accessing Monitoring Tools

- Prometheus: <http://your-server-ip:9090>
- Grafana: <http://your-server-ip:3000>

### Default Grafana Login

- Username: admin
- Password: admin (you'll be prompted to change it on first login)

### Setting Up Dashboards

1. Log in to Grafana
2. Go to "Dashboards" > "Import"
3. Import the dashboard JSON files from the `monitoring/dashboards` directory

## Backup and Recovery

### Database Backup

```bash
# Using Docker
docker-compose exec postgres pg_dump -U postgres ai_pkm > backup.sql

# Direct PostgreSQL
pg_dump -U postgres ai_pkm > backup.sql
```

### Database Restore

```bash
# Using Docker
cat backup.sql | docker-compose exec -T postgres psql -U postgres ai_pkm

# Direct PostgreSQL
psql -U postgres ai_pkm < backup.sql
```

### Application Data Backup

Ensure you back up the following:

1. PostgreSQL data
2. Redis data (if persistence is enabled)
3. Environment files
4. Custom configurations

## Troubleshooting

### Common Issues

#### Backend Won't Start

1. Check database connection
2. Verify environment variables
3. Check logs: `docker-compose logs backend`

#### Frontend Shows API Errors

1. Ensure backend is running
2. Check API URL configuration
3. Verify network connectivity between frontend and backend

#### Database Migration Errors

1. Check database connection
2. Ensure migrations are run in order
3. Check for conflicts in migration files

### Logs

Access logs for troubleshooting:

```bash
# Docker logs
docker-compose logs -f [service_name]

# Backend logs (manual deployment)
tail -f logs/application.log
tail -f logs/error.log
```

### Getting Help

If you encounter issues not covered in this guide:

1. Check the [GitHub Issues](https://github.com/your-org/ai-pkm/issues)
2. Join our [Discord community](https://discord.gg/your-discord)
3. Contact support at <support@your-domain.com>
