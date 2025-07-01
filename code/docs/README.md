# AI Personal Knowledge Management System - Complete Documentation

## Overview

Welcome to the comprehensive documentation for the AI Personal Knowledge Management (PKM) system. This documentation covers all public APIs, components, services, and utilities in the system, providing developers with everything they need to understand, use, and extend the application.

## System Architecture

The AI PKM system is a full-stack application built with modern technologies:

### Frontend Stack
- **React 19** with TypeScript for the user interface
- **Chakra UI** and **Tailwind CSS** for styling and components
- **Zustand** for state management
- **D3.js** for interactive knowledge graph visualization
- **Vite** for build tooling and development server

### Backend Stack
- **Node.js** with **Express.js** for the API server
- **TypeScript** for type safety
- **PostgreSQL** with **TypeORM** for data persistence
- **Redis** for caching and session management
- **JWT** for authentication
- **OpenAI API** for AI-powered features

## Documentation Structure

This documentation is organized into several comprehensive guides:

### 📋 [API Documentation](./api-documentation.md)
Complete reference for all backend APIs and frontend services including:
- **Authentication APIs** - User registration, login, profile management
- **Node APIs** - Knowledge node CRUD operations
- **Conversation APIs** - Chat and messaging functionality
- **SuperTag APIs** - Structured tagging system
- **Agent APIs** - AI agent management and actions
- **Frontend Services** - API client libraries and utilities
- **Data Models** - Complete entity definitions
- **Error Handling** - Standardized error responses
- **Performance Considerations** - Pagination, caching, optimization

### 🧩 [Component Documentation](./component-documentation.md)
Detailed guide to all React components including:
- **Layout Components** - AppLayout, Sidebar, NavigationTree, MainPanel
- **Knowledge Components** - KnowledgeGraph, NodeDetail, KnowledgePanel
- **Chat Components** - ChatWindow, ChatMessage, ChatInput, RelatedNodes
- **Custom Hooks** - useChatKnowledge and other specialized hooks
- **Props and Interfaces** - Complete TypeScript definitions
- **Usage Examples** - Practical implementation patterns
- **Styling and Theming** - CSS conventions and responsive design
- **Performance Optimizations** - Memoization, virtualization, lazy loading
- **Testing Strategies** - Unit and integration testing approaches
- **Accessibility** - ARIA labels and keyboard navigation

### 🔧 [Services and Utilities](./services-and-utilities.md)
Comprehensive guide to all utility functions and services:
- **Frontend Services** - API clients for all backend endpoints
- **State Management** - Zustand stores for application state
- **Backend Services** - Business logic layer implementations
- **Utility Functions** - Helper functions and common operations
- **Middleware** - Authentication, validation, rate limiting
- **Configuration** - Database, Redis, environment setup
- **Testing Utilities** - Test helpers and mock implementations

## Quick Start Guide

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- Redis 6 or higher
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-pkm-system
   ```

2. **Install dependencies**
   ```bash
   # Backend dependencies
   cd code/backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy environment template
   cd ../backend
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Database setup**
   ```bash
   # Run database migrations
   npm run migration:run
   ```

5. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd code/backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd code/frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: Available in this documentation

## Key Features

### 🧠 Knowledge Management
- **Node-based Knowledge Storage** - Store information in interconnected nodes
- **Rich Text Editing** - Markdown support with advanced formatting
- **Metadata Management** - Custom fields and properties for nodes
- **Search and Filtering** - Advanced search across all content
- **Archive System** - Soft delete with restore functionality

### 🏷️ SuperTag System
- **Structured Templates** - Define custom data structures
- **Dynamic Fields** - Text, number, date, boolean, and select field types
- **Node Application** - Apply templates to knowledge nodes
- **Field Validation** - Ensure data integrity and consistency

### 💬 Intelligent Chat
- **Conversation Management** - Organize chats by topic and context
- **Message Threading** - Maintain conversation flow and history
- **Node Integration** - Create knowledge nodes from chat messages
- **Real-time Updates** - Live message updates and notifications

### 🤖 AI Agents
- **Automated Actions** - AI-powered suggestions and automations
- **Approval Workflow** - Human-in-the-loop validation
- **Customizable Behavior** - Configure agent actions and thresholds
- **Context Awareness** - Agents understand conversation and knowledge context

### 📊 Knowledge Graph
- **Interactive Visualization** - D3.js-powered graph rendering
- **Node Relationships** - Visual representation of knowledge connections
- **Clustering and Filtering** - Group related nodes and apply filters
- **Zoom and Pan** - Navigate large knowledge graphs efficiently

### 🔐 Security and Authentication
- **JWT Authentication** - Secure token-based authentication
- **User Management** - Registration, login, profile management
- **Permission System** - User-scoped data access
- **Input Validation** - Comprehensive request validation

## Development Workflow

### Code Organization

```
code/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── api/              # API client services
│   │   ├── hooks/            # Custom React hooks
│   │   ├── store/            # Zustand state management
│   │   ├── pages/            # Page components
│   │   └── theme.ts          # Chakra UI theme
│   ├── public/               # Static assets
│   └── package.json
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── controllers/      # API endpoint handlers
│   │   ├── services/         # Business logic layer
│   │   ├── entity/           # TypeORM entities
│   │   ├── routes/           # Express route definitions
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   ├── config/           # Configuration files
│   │   └── migration/        # Database migrations
│   └── package.json
└── docs/                     # Documentation files
```

### API Design Patterns

The system follows RESTful API conventions with consistent patterns:

- **Resource Naming** - Plural nouns for collections (`/nodes`, `/conversations`)
- **HTTP Methods** - GET (read), POST (create), PUT (update), DELETE (remove)
- **Status Codes** - Standard HTTP status codes for all responses
- **Error Handling** - Consistent error response format
- **Authentication** - JWT tokens in Authorization header
- **Pagination** - Limit/offset pagination for large datasets

### Component Architecture

React components follow these principles:

- **Single Responsibility** - Each component has a clear, focused purpose
- **Props Interface** - TypeScript interfaces for all component props
- **Composition** - Components composed of smaller, reusable parts
- **State Management** - Zustand stores for complex state, local state for UI
- **Error Boundaries** - Graceful error handling and user feedback
- **Accessibility** - ARIA labels and keyboard navigation support

### Testing Strategy

The application includes comprehensive testing:

- **Unit Tests** - Individual function and component testing
- **Integration Tests** - API endpoint and store integration testing
- **E2E Tests** - Complete user workflow testing
- **Test Utilities** - Shared helpers and mock implementations

## Deployment

### Production Environment

The system supports multiple deployment options:

#### Docker Deployment
```bash
# Build and run with Docker Compose
cd code
docker-compose up --build
```

#### Manual Deployment
```bash
# Build frontend
cd code/frontend
npm run build

# Build backend
cd ../backend
npm run build

# Start production server
npm start
```

### Environment Variables

#### Backend Configuration
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ai_pkm
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-secure-jwt-secret
JWT_EXPIRY=24h

# OpenAI Integration
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=3001
NODE_ENV=production
```

#### Frontend Configuration
```env
VITE_API_BASE_URL=https://api.yourapp.com
VITE_WS_URL=wss://api.yourapp.com
```

### Monitoring and Logging

- **Application Logs** - Winston logging with file rotation
- **API Metrics** - Request/response logging and timing
- **Error Tracking** - Comprehensive error logging and alerting
- **Performance Monitoring** - Database query optimization and caching metrics

## Contributing

### Development Guidelines

1. **Code Style** - Use TypeScript for all new code
2. **Testing** - Write tests for new functionality
3. **Documentation** - Update documentation for API changes
4. **Git Workflow** - Use feature branches and pull requests
5. **Commit Messages** - Follow conventional commit format

### Code Review Process

1. Create feature branch from `main`
2. Implement changes with tests
3. Update relevant documentation
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

## Support and Resources

### Getting Help

- **Documentation** - This comprehensive guide covers all aspects
- **Issues** - Report bugs and feature requests via GitHub issues
- **Discussions** - Ask questions and share ideas in GitHub discussions

### Additional Resources

- **Architecture Overview** - See `ai_pkm_architecture.md` for system design
- **Frontend Redesign** - See `ai-pkm-frontend-redesign.md` for UI/UX details
- **API Reference** - Complete endpoint documentation in this guide
- **Component Library** - Detailed component usage examples

## Version History

### Current Version
- **Version**: 1.0.0
- **Release Date**: 2024
- **Major Features**: Full-stack PKM system with AI integration

### Planned Features
- Real-time collaboration
- Advanced AI agents
- Mobile application
- Plugin system
- Export/import functionality

---

This documentation provides a complete reference for developing with the AI PKM system. Each section includes practical examples, best practices, and implementation details to help developers effectively use and extend the application.

For specific implementation details, refer to the individual documentation files linked throughout this guide.