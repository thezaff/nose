# AI-First Personal Knowledge Management (PKM)

![AI-PKM Logo](docs/images/logo.png)

AI-PKM is a next-generation personal knowledge management system that uses chat as the primary input method and leverages AI agents to enhance the knowledge management experience.

## Features

- **Chat-Based Interface**: Interact with your knowledge base through natural language
- **Knowledge Graph**: Visualize connections between your knowledge nodes
- **AI Agents**: Intelligent agents that help organize, connect, and retrieve knowledge
- **SuperTag System**: Flexible schema system for structured knowledge
- **Real-Time Collaboration**: Share and collaborate on knowledge in real-time

## Screenshots

![Chat Interface](docs/images/chat-interface.png)
![Knowledge Graph](docs/images/knowledge-graph.png)

## Architecture

AI-PKM is built with a modern stack:

- **Frontend**: React, TypeScript, D3.js for visualizations
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with TypeORM
- **Caching**: Redis for performance
- **AI**: Integration with OpenAI API

For more details, see the [Architecture Document](ai_pkm_architecture.md).

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (v15+)
- Redis (v7+)
- OpenAI API key

### Installation

#### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/your-org/ai-pkm.git
cd ai-pkm

# Configure environment variables
cp backend/.env.example backend/.env
# Edit .env with your configuration

# Start with Docker Compose
docker-compose up -d
```

#### Manual Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ai-pkm.git
cd ai-pkm

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run migration:run
npm run build
npm start

# Frontend setup
cd ../frontend
npm install
npm run build
# Serve the build directory with your preferred web server
```

### Usage

1. Open your browser and navigate to `http://localhost` (Docker) or `http://localhost:5173` (development)
2. Create an account or log in
3. Start chatting with the system to create and retrieve knowledge
4. Explore the knowledge graph to visualize connections

For detailed usage instructions, see the [User Guide](docs/user-guide.md).

## Documentation

- [User Guide](docs/user-guide.md): How to use the application
- [Developer Guide](docs/developer-guide.md): Codebase overview and development guidelines
- [Agent System](docs/agent-system.md): Details about the AI agent system
- [Deployment Guide](docs/deployment.md): Instructions for deployment
- [API Reference](docs/api-reference.md): API documentation

## Development

### Backend Development

```bash
cd backend
npm install
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

For detailed deployment instructions, see the [Deployment Guide](docs/deployment.md).

## Contributing

We welcome contributions to AI-PKM! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com/) for the AI capabilities
- [Tana](https://tana.inc/) for inspiration on the SuperTag system
- All open-source libraries and frameworks used in this project

## Contact

For questions or support, please contact us at:

- Email: <support@ai-pkm.example.com>
- Twitter: [@ai_pkm](https://twitter.com/ai_pkm)
- Discord: [AI-PKM Community](https://discord.gg/ai-pkm)
