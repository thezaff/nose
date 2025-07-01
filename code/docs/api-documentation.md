# AI Personal Knowledge Management System - API Documentation

## Overview

This documentation covers all public APIs, functions, and components for the AI Personal Knowledge Management (PKM) system. The system consists of a React TypeScript frontend and a Node.js/TypeScript backend with PostgreSQL database.

## Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **UI Library**: Chakra UI v3 and Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Additional Libraries**: D3.js, Framer Motion, React Router

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with bcrypt
- **Cache**: Redis
- **AI Integration**: OpenAI API
- **Logging**: Winston

## Backend API Endpoints

### Authentication API (`/api/auth`)

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}
```

**Response:**
```typescript
interface AuthResponse {
  user: UserResponse;
  token: string;
}

interface UserResponse {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  preferences: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body:**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response:** Same as register response.

**Example:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

#### POST `/api/auth/logout`
Logout user (invalidate token).

**Headers:** `Authorization: Bearer <token>`

#### GET `/api/auth/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `UserResponse`

#### PUT `/api/auth/preferences`
Update user preferences.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```typescript
interface PreferencesRequest {
  preferences: Record<string, any>;
}
```

#### PUT `/api/auth/change-password`
Change user password.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

### Nodes API (`/api/nodes`)

All endpoints require authentication via `Authorization: Bearer <token>` header.

#### POST `/api/nodes`
Create a new knowledge node.

**Request Body:**
```typescript
interface NodeRequest {
  title: string;
  content: string;
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
interface NodeResponse {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/nodes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Machine Learning Concepts",
    "content": "Key concepts in machine learning include...",
    "metadata": {
      "tags": ["ml", "ai"],
      "category": "learning"
    }
  }'
```

#### GET `/api/nodes`
Get all nodes for the authenticated user with pagination and filtering.

**Query Parameters:**
```typescript
interface NodeListParams {
  page?: number;        // Default: 1
  limit?: number;       // Default: 20
  search?: string;      // Search in title and content
  superTagId?: string;  // Filter by SuperTag
  isArchived?: boolean; // Default: false
}
```

**Response:**
```typescript
interface NodeListResponse {
  nodes: NodeResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Example:**
```bash
curl "http://localhost:3001/api/nodes?page=1&limit=10&search=machine%20learning" \
  -H "Authorization: Bearer <token>"
```

#### GET `/api/nodes/:id`
Get a specific node by ID.

**Response:** `NodeResponse`

#### PUT `/api/nodes/:id`
Update a node.

**Request Body:** `Partial<NodeRequest>`

**Response:** `NodeResponse`

#### PUT `/api/nodes/:id/archive`
Archive a node.

**Response:** `NodeResponse`

#### PUT `/api/nodes/:id/restore`
Restore an archived node.

**Response:** `NodeResponse`

#### DELETE `/api/nodes/:id`
Delete a node permanently.

**Response:** Success message

### SuperTags API (`/api/supertags`)

SuperTags are structured templates that can be applied to nodes to add structured data.

#### POST `/api/supertags`
Create a new SuperTag.

**Request Body:**
```typescript
interface SuperTagRequest {
  name: string;
  description?: string;
  color?: string;
  fields?: FieldRequest[];
}

interface FieldRequest {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required?: boolean;
  options?: string[]; // For select type
}
```

**Response:**
```typescript
interface SuperTagResponse {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  fields: FieldResponse[];
}

interface FieldResponse {
  id: string;
  name: string;
  type: string;
  required: boolean;
  options?: string[];
  order: number;
}
```

#### GET `/api/supertags`
Get all SuperTags for the user.

**Response:**
```typescript
interface SuperTagListResponse {
  superTags: SuperTagResponse[];
  total: number;
}
```

#### GET `/api/supertags/:id`
Get a specific SuperTag.

#### PUT `/api/supertags/:id`
Update a SuperTag.

#### DELETE `/api/supertags/:id`
Delete a SuperTag.

#### POST `/api/supertags/:id/fields`
Add a field to a SuperTag.

#### DELETE `/api/supertags/:id/fields/:fieldId`
Remove a field from a SuperTag.

#### POST `/api/supertags/:id/nodes/:nodeId`
Apply a SuperTag to a node.

#### DELETE `/api/supertags/:id/nodes/:nodeId`
Remove a SuperTag from a node.

#### GET `/api/supertags/:id/nodes`
Get all nodes that have a specific SuperTag applied.

### Conversations API (`/api/conversations`)

Manage chat conversations and messages.

#### POST `/api/conversations`
Create a new conversation.

**Request Body:**
```typescript
interface ConversationRequest {
  title: string;
  description?: string;
}
```

**Response:**
```typescript
interface ConversationResponse {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}
```

#### GET `/api/conversations`
Get all conversations for the user.

**Response:**
```typescript
interface ConversationListResponse {
  conversations: ConversationResponse[];
  total: number;
}
```

#### GET `/api/conversations/:id`
Get a specific conversation.

#### PUT `/api/conversations/:id`
Update a conversation.

#### DELETE `/api/conversations/:id`
Delete a conversation.

#### POST `/api/conversations/:id/messages`
Add a message to a conversation.

**Request Body:**
```typescript
interface MessageRequest {
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata?: Record<string, any>;
}
```

**Response:**
```typescript
interface MessageResponse {
  id: string;
  content: string;
  role: string;
  metadata: Record<string, any>;
  createdAt: string;
  conversationId: string;
}
```

#### GET `/api/conversations/:id/messages`
Get all messages for a conversation.

#### DELETE `/api/conversations/:id/messages/:messageId`
Delete a specific message.

### Agents API (`/api/agents`)

Manage AI agents and their actions.

#### GET `/api/agents`
Get all agents for the current user.

**Response:**
```typescript
interface AgentResponse {
  id: string;
  name: string;
  type: string;
  configuration: Record<string, any>;
  isActive: boolean;
  userId: string;
}
```

#### PATCH `/api/agents/:id/configuration`
Update agent configuration.

**Request Body:**
```typescript
interface AgentConfigurationRequest {
  configuration: Record<string, any>;
}
```

#### GET `/api/agents/actions/conversation/:conversationId`
Get pending agent actions for a conversation.

**Response:**
```typescript
interface AgentActionResponse {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  payload: Record<string, any>;
  agentId: string;
  conversationId?: string;
  messageId?: string;
  createdAt: string;
}
```

#### POST `/api/agents/actions/:actionId/approve`
Approve an agent action.

#### POST `/api/agents/actions/:actionId/reject`
Reject an agent action.

#### POST `/api/agents/process-message/:messageId`
Process a message with agents.

#### POST `/api/agents/initialize`
Initialize agents for a new user.

## Frontend Components

### Core Components

#### `<AppLayout>`
Main application layout component that provides the overall structure.

**Props:**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Usage:**
```tsx
import { AppLayout } from './components/Layout';

function App() {
  return (
    <AppLayout>
      <MainContent />
    </AppLayout>
  );
}
```

#### `<NavigationTree>`
Hierarchical navigation component for browsing nodes and conversations.

**Props:**
```typescript
interface NavigationTreeProps {
  onNodeSelect?: (nodeId: string) => void;
  onConversationSelect?: (conversationId: string) => void;
  selectedNodeId?: string;
  selectedConversationId?: string;
}
```

**Usage:**
```tsx
import { NavigationTree } from './components/Layout';

function Sidebar() {
  const handleNodeSelect = (nodeId: string) => {
    // Handle node selection
  };

  return (
    <NavigationTree
      onNodeSelect={handleNodeSelect}
      selectedNodeId="node-123"
    />
  );
}
```

#### `<KnowledgeGraph>`
Interactive D3.js-based visualization of knowledge nodes and their relationships.

**Props:**
```typescript
interface KnowledgeGraphProps {
  nodes: NodeResponse[];
  links: LinkResponse[];
  onNodeClick?: (node: NodeResponse) => void;
  width?: number;
  height?: number;
  selectedNodeId?: string;
}
```

**Usage:**
```tsx
import { KnowledgeGraph } from './components/Knowledge';

function KnowledgeView() {
  const { nodes, links } = useKnowledgeStore();

  return (
    <KnowledgeGraph
      nodes={nodes}
      links={links}
      onNodeClick={(node) => console.log('Selected:', node)}
      width={800}
      height={600}
    />
  );
}
```

### Chat Components

#### `<ChatWindow>`
Main chat interface component.

**Props:**
```typescript
interface ChatWindowProps {
  conversationId: string;
  onMessageSent?: (message: MessageResponse) => void;
}
```

#### `<ChatMessage>`
Individual message component.

**Props:**
```typescript
interface ChatMessageProps {
  message: MessageResponse;
  onDelete?: (messageId: string) => void;
  onCreateNode?: (messageId: string, title: string, content: string) => void;
}
```

#### `<ChatInput>`
Message input component with rich text support.

**Props:**
```typescript
interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}
```

#### `<RelatedNodes>`
Component showing nodes related to the current conversation.

**Props:**
```typescript
interface RelatedNodesProps {
  conversationId: string;
  onNodeClick?: (node: NodeResponse) => void;
}
```

#### `<AgentSuggestion>`
Component for displaying and managing agent suggestions.

**Props:**
```typescript
interface AgentSuggestionProps {
  actionId: string;
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
}
```

### Knowledge Components

#### `<NodeDetail>`
Detailed view and editor for a knowledge node.

**Props:**
```typescript
interface NodeDetailProps {
  nodeId: string;
  onSave?: (node: NodeResponse) => void;
  onDelete?: (nodeId: string) => void;
  readOnly?: boolean;
}
```

#### `<KnowledgePanel>`
Panel for managing knowledge nodes with search and filtering.

**Props:**
```typescript
interface KnowledgePanelProps {
  onNodeSelect?: (node: NodeResponse) => void;
  selectedNodeId?: string;
  showArchived?: boolean;
}
```

### Layout Components

#### `<Sidebar>`
Application sidebar with navigation and context panels.

**Props:**
```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

#### `<MainPanel>`
Main content area component.

**Props:**
```typescript
interface MainPanelProps {
  children: React.ReactNode;
}
```

#### `<ContextPanel>`
Context-sensitive panel showing related information.

**Props:**
```typescript
interface ContextPanelProps {
  contextType: 'node' | 'conversation' | 'search';
  contextId?: string;
}
```

## Frontend Services

### API Services

All API services are located in `src/api/` and provide typed interfaces for backend communication.

#### `nodeService`
Service for managing knowledge nodes.

**Methods:**
```typescript
interface NodeService {
  getNodes(params?: NodeListParams): Promise<NodeListResponse>;
  getNode(id: string): Promise<NodeResponse>;
  createNode(data: NodeRequest): Promise<NodeResponse>;
  updateNode(id: string, data: Partial<NodeRequest>): Promise<NodeResponse>;
  archiveNode(id: string): Promise<NodeResponse>;
  restoreNode(id: string): Promise<NodeResponse>;
  deleteNode(id: string): Promise<void>;
  applySupertag(nodeId: string, superTagId: string): Promise<NodeResponse>;
  removeSupertag(nodeId: string, superTagId: string): Promise<NodeResponse>;
  createLink(sourceNodeId: string, targetNodeId: string, type: string, metadata?: Record<string, any>): Promise<any>;
  deleteLink(linkId: string): Promise<void>;
}
```

**Usage:**
```typescript
import { nodeService } from '../api';

// Create a new node
const newNode = await nodeService.createNode({
  title: 'My New Node',
  content: 'Content here...',
  metadata: { category: 'research' }
});

// Get nodes with filtering
const { nodes, total } = await nodeService.getNodes({
  page: 1,
  limit: 10,
  search: 'machine learning'
});
```

#### `conversationService`
Service for managing conversations and messages.

**Methods:**
```typescript
interface ConversationService {
  getConversations(params?: ConversationListParams): Promise<ConversationListResponse>;
  getConversation(id: string): Promise<ConversationResponse>;
  createConversation(data: ConversationRequest): Promise<ConversationResponse>;
  updateConversation(id: string, data: Partial<ConversationRequest>): Promise<ConversationResponse>;
  deleteConversation(id: string): Promise<void>;
  addMessage(conversationId: string, data: MessageRequest): Promise<MessageResponse>;
  getMessages(conversationId: string): Promise<MessageResponse[]>;
  deleteMessage(conversationId: string, messageId: string): Promise<void>;
}
```

#### `superTagService`
Service for managing SuperTags.

#### `userService`
Service for user authentication and profile management.

#### `agentService`
Service for managing AI agents and their actions.

### Custom Hooks

#### `useChatKnowledge`
Hook that integrates chat and knowledge functionality.

**Interface:**
```typescript
interface UseChatKnowledgeProps {
  conversationId?: string;
}

interface UseChatKnowledgeResult {
  messages: MessageResponse[];
  relatedNodes: NodeResponse[];
  isLoadingMessages: boolean;
  isLoadingNodes: boolean;
  sendMessage: (content: string) => Promise<MessageResponse>;
  createNodeFromMessage: (messageId: string, title: string, content: string) => Promise<NodeResponse>;
  findRelatedNodesForMessage: (messageId: string) => NodeResponse[];
  processMessageWithAgents: (messageId: string) => Promise<void>;
}
```

**Usage:**
```typescript
import { useChatKnowledge } from '../hooks/useChatKnowledge';

function ChatComponent({ conversationId }: { conversationId: string }) {
  const {
    messages,
    relatedNodes,
    sendMessage,
    createNodeFromMessage
  } = useChatKnowledge({ conversationId });

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleCreateNode = async (messageId: string) => {
    await createNodeFromMessage(
      messageId,
      'Node from Message',
      'Content from the message...'
    );
  };

  return (
    <div>
      {/* Chat UI implementation */}
    </div>
  );
}
```

## State Management (Zustand Stores)

### `useKnowledgeStore`
Manages knowledge nodes state.

**State:**
```typescript
interface KnowledgeState {
  nodes: NodeResponse[];
  selectedNode: NodeResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchNodes: () => Promise<void>;
  createNode: (data: NodeRequest) => Promise<NodeResponse>;
  updateNode: (id: string, data: Partial<NodeRequest>) => Promise<NodeResponse>;
  deleteNode: (id: string) => Promise<void>;
  selectNode: (node: NodeResponse | null) => void;
}
```

### `useConversationStore`
Manages conversations and messages state.

### `useUserStore`
Manages user authentication and profile state.

### `useNavigationStore`
Manages navigation and UI state.

### `useLayoutStore`
Manages layout and panel states.

## Data Models

### Node Entity
```typescript
interface Node {
  id: string;
  title: string;
  content: string;
  isArchived: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  nodeSuperTags: NodeSuperTag[];
  fieldValues: FieldValue[];
  outgoingLinks: Link[];
  incomingLinks: Link[];
}
```

### SuperTag Entity
```typescript
interface SuperTag {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  fields: Field[];
  nodeSuperTags: NodeSuperTag[];
}
```

### Conversation Entity
```typescript
interface Conversation {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: User;
  messages: Message[];
}
```

### Message Entity
```typescript
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  metadata: Record<string, any>;
  createdAt: Date;
  conversationId: string;
  conversation: Conversation;
}
```

## Error Handling

### API Error Responses
All API endpoints return standardized error responses:

```typescript
interface ErrorResponse {
  success: false;
  message: string;
  error?: string;
  code?: string;
}
```

### Frontend Error Handling
Use try-catch blocks with API services:

```typescript
try {
  const node = await nodeService.createNode(data);
  // Handle success
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
  } else if (error.response?.status === 400) {
    // Handle validation error
  } else {
    // Handle other errors
  }
}
```

## Authentication

### JWT Token Usage
Include JWT token in all authenticated requests:

```typescript
const token = localStorage.getItem('authToken');
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
```

### Token Refresh
Tokens should be refreshed when they expire. The frontend automatically handles this through the API client.

## Performance Considerations

### Pagination
Use pagination for large datasets:

```typescript
// Backend
const { nodes, total } = await NodeService.getNodesByUser(
  userId,
  page,
  limit,
  searchQuery
);

// Frontend
const { nodes } = await nodeService.getNodes({
  page: 1,
  limit: 20,
  search: 'query'
});
```

### Caching
- Redis is used for session storage and caching frequently accessed data
- Frontend uses Zustand for client-side state caching

### Search Optimization
- Use database indexes for search queries
- Implement debouncing for search inputs on the frontend

## Deployment

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_pkm
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRY=24h

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Server
PORT=3001
NODE_ENV=production
```

#### Frontend
Environment variables are handled through Vite:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_WS_URL=ws://localhost:3001
```

### Docker Deployment
Use the provided Docker configuration:

```bash
# Build and run with Docker Compose
cd code
docker-compose up --build

# Or build individual services
docker build -t ai-pkm-backend -f Dockerfile.backend .
docker build -t ai-pkm-frontend -f Dockerfile.frontend .
```

## Testing

### Backend Testing
```bash
cd code/backend
npm test                    # Run all tests
npm run test:e2e           # Run end-to-end tests
```

### Frontend Testing
```bash
cd code/frontend
npm test                   # Run component tests
```

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ai-pkm-system

# Install backend dependencies
cd code/backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
cd ../backend
npm run migration:run

# Start development servers
npm run dev                # Backend
cd ../frontend
npm run dev                # Frontend
```

### Development Commands
```bash
# Backend
npm run dev                # Start development server
npm run build              # Build for production
npm run lint               # Run ESLint
npm run migration:generate # Generate new migration

# Frontend
npm run dev                # Start development server
npm run build              # Build for production
npm run preview            # Preview production build
npm run lint               # Run ESLint
```

## API Rate Limiting

API endpoints are rate-limited to prevent abuse:
- Authentication endpoints: 5 requests per minute per IP
- General API endpoints: 100 requests per minute per user
- Search endpoints: 20 requests per minute per user

## WebSocket Events (Future Enhancement)

The system is designed to support real-time updates through WebSocket connections:

```typescript
// Client-side WebSocket handling
const ws = new WebSocket('ws://localhost:3001');

ws.on('nodeCreated', (node: NodeResponse) => {
  // Handle real-time node creation
});

ws.on('messageReceived', (message: MessageResponse) => {
  // Handle real-time message updates
});
```

## Contributing

### Code Style
- Use TypeScript for all new code
- Follow ESLint rules defined in the configuration
- Use Prettier for code formatting
- Write unit tests for new functionality

### Commit Messages
Follow conventional commit format:
```
feat: add new node creation API
fix: resolve authentication token expiry
docs: update API documentation
```

This documentation provides a comprehensive overview of all public APIs, functions, and components in the AI PKM system. For additional implementation details, refer to the source code and inline documentation.