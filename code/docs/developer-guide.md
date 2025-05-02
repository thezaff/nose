# AI-PKM Developer Guide

## Architecture Overview

AI-PKM is built with a modern stack that separates frontend and backend concerns:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL with TypeORM for ORM
- **Caching**: Redis for performance optimization
- **Monitoring**: Prometheus and Grafana

The application follows a layered architecture:

1. **Frontend Layer**: User interface components
2. **API Layer**: RESTful endpoints and request handling
3. **Service Layer**: Business logic and data processing
4. **Data Layer**: Database access and persistence

## Project Structure

```
ai-pkm/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # API controllers
│   │   ├── entity/          # TypeORM entities
│   │   ├── middleware/      # Express middleware
│   │   ├── migration/       # Database migrations
│   │   ├── routes/          # API routes
│   │   ├── scripts/         # Utility scripts
│   │   ├── services/        # Business logic
│   │   │   ├── agent/       # Agent services
│   │   │   └── nlp/         # NLP services
│   │   ├── tests/           # Test files
│   │   └── utils/           # Utility functions
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies and scripts
├── frontend/                # Frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   │   ├── Chat/        # Chat components
│   │   │   └── Knowledge/   # Knowledge graph components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   └── store/           # State management
│   └── package.json         # Dependencies and scripts
├── docs/                    # Documentation
├── docker-compose.yml       # Docker configuration
└── README.md                # Project overview
```

## Backend Architecture

### Entity Model

The core entities in the system are:

- **Node**: Fundamental unit of knowledge
- **SuperTag**: Schema definition for node types
- **Field**: Structured data fields for nodes
- **Link**: Connections between nodes
- **Conversation**: Chat sessions
- **Message**: Individual messages in conversations
- **Agent**: AI agents that process and organize knowledge

### API Endpoints

The backend exposes the following API endpoints:

- `/api/auth`: Authentication and user management
- `/api/nodes`: Knowledge node CRUD operations
- `/api/supertags`: SuperTag management
- `/api/conversations`: Conversation management
- `/api/agents`: Agent configuration and actions

### Agent System

The agent system is a core differentiator for this PKM application:

1. **Agent Coordinator**: Manages and coordinates all agent activities
2. **Organization Agent**: Categorizes and tags information
3. **Connection Agent**: Identifies relationships between information
4. **Query Agent**: Interprets natural language questions
5. **Summary Agent**: Creates summaries of knowledge areas

## Frontend Architecture

### Component Structure

The frontend is organized into reusable components:

- **Chat Components**: Handle conversation UI and interactions
- **Knowledge Components**: Visualize and interact with the knowledge graph
- **Page Components**: Combine smaller components into full pages

### State Management

State is managed using Zustand with the following stores:

- **userStore**: Authentication and user preferences
- **conversationStore**: Chat conversations and messages
- **knowledgeStore**: Knowledge nodes, links, and supertags

### Data Flow

1. User interacts with the UI
2. Actions trigger state changes in stores
3. API calls are made to the backend
4. Responses update the state
5. UI re-renders with new data

## Development Setup

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v15+)
- Redis (v7+)
- Docker and Docker Compose (for containerized development)

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/ai-pkm.git
   cd ai-pkm
   ```

2. Set up the backend:

   ```bash
   cd backend
   cp .env.example .env  # Configure your environment variables
   npm install
   npm run migration:run
   npm run dev
   ```

3. Set up the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

### Using Docker

To run the entire application stack with Docker:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## Testing

### Backend Tests

The backend includes unit tests and end-to-end tests:

```bash
# Run all tests
cd backend
npm test

# Run end-to-end tests only
npm run test:e2e
```

### Frontend Tests

The frontend uses Vitest for testing:

```bash
cd frontend
npm test
```

## Database Migrations

Database schema changes are managed through migrations:

```bash
# Generate a new migration
cd backend
npm run migration:generate -- MyMigrationName

# Run pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert
```

## Performance Optimization

The application includes several performance optimizations:

1. **Database Indexes**: Optimized queries for knowledge graph operations
2. **Redis Caching**: Frequently accessed data is cached
3. **Pagination**: Large result sets are paginated
4. **Frontend Rendering**: Knowledge graph visualization is optimized

## Deployment

### Production Setup

1. Build the Docker images:

   ```bash
   docker-compose build
   ```

2. Configure environment variables for production in `.env` files

3. Deploy using Docker Compose:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Monitoring

The application includes Prometheus and Grafana for monitoring:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## Contributing

### Code Style

- Backend: Follow the TypeScript style guide
- Frontend: Follow the React style guide
- Use ESLint for code linting

### Pull Request Process

1. Create a feature branch from `develop`
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request to `develop`
5. Code review and approval
6. Merge to `develop`

## API Documentation

For detailed API documentation, see the [API Reference](./api-reference.md).

## Agent System Documentation

For detailed information about the agent system, see the [Agent System Guide](./agent-system.md).
