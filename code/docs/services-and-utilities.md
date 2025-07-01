# Services and Utilities Documentation

## Overview

This document provides comprehensive documentation for all utility functions, services, and helper modules in the AI Personal Knowledge Management system, covering both frontend and backend implementations.

## Frontend Services and Utilities

### API Client Services

#### Base API Client

**File**: `src/api/client.ts`

The base API client handles authentication, request/response interceptors, and error handling.

**Features:**
- Automatic JWT token attachment
- Request/response logging
- Error handling and retry logic
- Base URL configuration

**Usage:**
```typescript
import apiClient from '@/api/client';

// GET request
const response = await apiClient.get<NodeResponse[]>('/nodes');

// POST request with data
const newNode = await apiClient.post<NodeResponse>('/nodes', {
  title: 'New Node',
  content: 'Content here'
});

// PUT request with authentication
const updatedNode = await apiClient.put<NodeResponse>(`/nodes/${id}`, data);

// DELETE request
await apiClient.delete(`/nodes/${id}`);
```

**Configuration:**
```typescript
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
  retries: number;
  retryDelay: number;
}
```

#### Node Service

**File**: `src/api/nodeService.ts`

Service for managing knowledge nodes with full CRUD operations.

**Methods:**

##### `getNodes(params?: NodeListParams): Promise<NodeListResponse>`
Retrieve nodes with pagination and filtering.

```typescript
const { nodes, total } = await nodeService.getNodes({
  page: 1,
  limit: 20,
  search: 'machine learning',
  isArchived: false
});
```

##### `getNode(id: string): Promise<NodeResponse>`
Get a single node by ID.

```typescript
const node = await nodeService.getNode('node-id-123');
```

##### `createNode(data: NodeRequest): Promise<NodeResponse>`
Create a new node.

```typescript
const newNode = await nodeService.createNode({
  title: 'Machine Learning Concepts',
  content: 'Detailed content about ML...',
  metadata: {
    tags: ['ai', 'ml'],
    category: 'learning'
  }
});
```

##### `updateNode(id: string, data: Partial<NodeRequest>): Promise<NodeResponse>`
Update an existing node.

```typescript
const updatedNode = await nodeService.updateNode('node-id', {
  title: 'Updated Title',
  content: 'Updated content...'
});
```

##### `archiveNode(id: string): Promise<NodeResponse>`
Archive a node (soft delete).

```typescript
await nodeService.archiveNode('node-id');
```

##### `restoreNode(id: string): Promise<NodeResponse>`
Restore an archived node.

```typescript
await nodeService.restoreNode('node-id');
```

##### `deleteNode(id: string): Promise<void>`
Permanently delete a node.

```typescript
await nodeService.deleteNode('node-id');
```

##### `applySupertag(nodeId: string, superTagId: string): Promise<NodeResponse>`
Apply a SuperTag to a node.

```typescript
await nodeService.applySupertag('node-id', 'tag-id');
```

##### `removeSupertag(nodeId: string, superTagId: string): Promise<NodeResponse>`
Remove a SuperTag from a node.

```typescript
await nodeService.removeSupertag('node-id', 'tag-id');
```

##### `createLink(sourceNodeId: string, targetNodeId: string, type: string, metadata?: Record<string, any>): Promise<any>`
Create a link between two nodes.

```typescript
await nodeService.createLink(
  'source-node-id',
  'target-node-id',
  'related',
  { strength: 0.8, context: 'Similar topics' }
);
```

#### Conversation Service

**File**: `src/api/conversationService.ts`

Service for managing conversations and messages.

**Methods:**

##### `getConversations(params?: ConversationListParams): Promise<ConversationListResponse>`
Retrieve all conversations for the user.

```typescript
const { conversations, total } = await conversationService.getConversations({
  page: 1,
  limit: 10
});
```

##### `createConversation(data: ConversationRequest): Promise<ConversationResponse>`
Create a new conversation.

```typescript
const conversation = await conversationService.createConversation({
  title: 'AI Discussion',
  description: 'Conversation about AI topics'
});
```

##### `addMessage(conversationId: string, data: MessageRequest): Promise<MessageResponse>`
Add a message to a conversation.

```typescript
const message = await conversationService.addMessage('conv-id', {
  content: 'Hello, how can I help?',
  role: 'user',
  metadata: { timestamp: new Date().toISOString() }
});
```

##### `getMessages(conversationId: string): Promise<MessageResponse[]>`
Get all messages for a conversation.

```typescript
const messages = await conversationService.getMessages('conv-id');
```

#### SuperTag Service

**File**: `src/api/superTagService.ts`

Service for managing SuperTags and their fields.

**Methods:**

##### `getSuperTags(params?: SuperTagListParams): Promise<SuperTagListResponse>`
Get all SuperTags for the user.

```typescript
const { superTags } = await superTagService.getSuperTags();
```

##### `createSuperTag(data: SuperTagRequest): Promise<SuperTagResponse>`
Create a new SuperTag with fields.

```typescript
const superTag = await superTagService.createSuperTag({
  name: 'Person',
  description: 'Template for person information',
  color: '#3B82F6',
  fields: [
    { name: 'Name', type: 'text', required: true },
    { name: 'Age', type: 'number', required: false },
    { name: 'Occupation', type: 'text', required: false }
  ]
});
```

##### `addField(superTagId: string, field: FieldRequest): Promise<FieldResponse>`
Add a field to a SuperTag.

```typescript
await superTagService.addField('tag-id', {
  name: 'Email',
  type: 'text',
  required: false
});
```

#### User Service

**File**: `src/api/userService.ts`

Service for user authentication and profile management.

**Methods:**

##### `register(data: RegisterRequest): Promise<AuthResponse>`
Register a new user account.

```typescript
const { user, token } = await userService.register({
  email: 'user@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe'
});
```

##### `login(data: LoginRequest): Promise<AuthResponse>`
Authenticate user and get JWT token.

```typescript
const { user, token } = await userService.login({
  email: 'user@example.com',
  password: 'securePassword123'
});
```

##### `logout(): Promise<void>`
Logout current user.

```typescript
await userService.logout();
```

##### `getProfile(): Promise<UserResponse>`
Get current user profile.

```typescript
const user = await userService.getProfile();
```

##### `updatePreferences(preferences: Record<string, any>): Promise<UserResponse>`
Update user preferences.

```typescript
await userService.updatePreferences({
  theme: 'dark',
  notifications: true,
  autoSave: true
});
```

#### Agent Service

**File**: `src/api/agentService.ts`

Service for managing AI agents and their actions.

**Methods:**

##### `getUserAgents(): Promise<AgentResponse[]>`
Get all agents for the current user.

```typescript
const agents = await agentService.getUserAgents();
```

##### `updateAgentConfiguration(agentId: string, config: Record<string, any>): Promise<AgentResponse>`
Update agent configuration.

```typescript
await agentService.updateAgentConfiguration('agent-id', {
  enabled: true,
  threshold: 0.8,
  categories: ['research', 'summary']
});
```

##### `getPendingActions(conversationId: string): Promise<AgentActionResponse[]>`
Get pending actions for a conversation.

```typescript
const actions = await agentService.getPendingActions('conv-id');
```

##### `approveAction(actionId: string): Promise<void>`
Approve an agent action.

```typescript
await agentService.approveAction('action-id');
```

##### `rejectAction(actionId: string): Promise<void>`
Reject an agent action.

```typescript
await agentService.rejectAction('action-id');
```

##### `processMessage(messageId: string): Promise<void>`
Process a message with agents.

```typescript
await agentService.processMessage('message-id');
```

### Frontend Utilities

#### Theme Utilities

**File**: `src/theme.ts`

Centralized theme configuration for Chakra UI.

**Usage:**
```typescript
import { theme } from '@/theme';
import { ChakraProvider } from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AppContent />
    </ChakraProvider>
  );
}
```

**Theme Structure:**
```typescript
interface CustomTheme {
  colors: {
    primary: Record<string, string>;
    secondary: Record<string, string>;
    background: Record<string, string>;
    text: Record<string, string>;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  components: {
    Button: ComponentStyleConfig;
    Input: ComponentStyleConfig;
    // ... other components
  };
}
```

#### Store Utilities

**File**: `src/store/index.ts`

Centralized store exports and utilities.

**Exports:**
```typescript
export {
  useUserStore,
  useKnowledgeStore,
  useConversationStore,
  useNavigationStore,
  useLayoutStore
} from './stores';

export type {
  UserState,
  KnowledgeState,
  ConversationState,
  NavigationState,
  LayoutState
} from './types';
```

### State Management Stores

#### Knowledge Store

**File**: `src/store/knowledgeStore.ts`

Zustand store for managing knowledge nodes and related state.

**State Interface:**
```typescript
interface KnowledgeState {
  // Data
  nodes: NodeResponse[];
  selectedNode: NodeResponse | null;
  links: LinkResponse[];
  superTags: SuperTagResponse[];
  
  // UI State
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: KnowledgeFilters;
  
  // Actions
  fetchNodes: () => Promise<void>;
  createNode: (data: NodeRequest) => Promise<NodeResponse>;
  updateNode: (id: string, data: Partial<NodeRequest>) => Promise<NodeResponse>;
  deleteNode: (id: string) => Promise<void>;
  selectNode: (node: NodeResponse | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<KnowledgeFilters>) => void;
  clearError: () => void;
}
```

**Usage:**
```typescript
import { useKnowledgeStore } from '@/store';

function KnowledgeComponent() {
  const {
    nodes,
    selectedNode,
    isLoading,
    fetchNodes,
    createNode,
    selectNode
  } = useKnowledgeStore();

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  const handleCreateNode = async () => {
    await createNode({
      title: 'New Node',
      content: 'Content here...'
    });
  };

  return (
    <div>
      {isLoading ? 'Loading...' : 'Loaded'}
      {nodes.map(node => (
        <div key={node.id} onClick={() => selectNode(node)}>
          {node.title}
        </div>
      ))}
    </div>
  );
}
```

#### Conversation Store

**File**: `src/store/conversationStore.ts`

Zustand store for managing conversations and messages.

**State Interface:**
```typescript
interface ConversationState {
  // Data
  conversations: ConversationResponse[];
  currentConversation: ConversationResponse | null;
  messages: MessageResponse[];
  agentActions: AgentActionResponse[];
  
  // UI State
  isLoading: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  createConversation: (data: ConversationRequest) => Promise<ConversationResponse>;
  selectConversation: (conversation: ConversationResponse) => void;
  sendMessage: (content: string) => Promise<MessageResponse>;
  fetchMessages: (conversationId: string) => Promise<void>;
  fetchAgentActions: (conversationId: string) => Promise<void>;
  approveAction: (actionId: string) => Promise<void>;
  rejectAction: (actionId: string) => Promise<void>;
}
```

#### User Store

**File**: `src/store/userStore.ts`

Zustand store for user authentication and profile management.

**State Interface:**
```typescript
interface UserState {
  // Data
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<UserResponse>) => Promise<void>;
  updatePreferences: (preferences: Record<string, any>) => Promise<void>;
  checkAuthStatus: () => void;
}
```

#### Navigation Store

**File**: `src/store/navigationStore.ts`

Zustand store for navigation state and tree management.

**State Interface:**
```typescript
interface NavigationState {
  // Tree Data
  treeNodes: TreeNode[];
  expandedNodes: Set<string>;
  selectedNodeId: string | null;
  selectedConversationId: string | null;
  
  // Search and Filters
  searchQuery: string;
  showArchived: boolean;
  
  // UI State
  isLoading: boolean;
  
  // Actions
  loadTreeData: () => Promise<void>;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  selectNode: (nodeId: string) => void;
  selectConversation: (conversationId: string) => void;
  setSearchQuery: (query: string) => void;
  toggleShowArchived: () => void;
}
```

#### Layout Store

**File**: `src/store/layoutStore.ts`

Zustand store for layout and UI state management.

**State Interface:**
```typescript
interface LayoutState {
  // Sidebar
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  
  // Panels
  contextPanelVisible: boolean;
  contextPanelWidth: number;
  
  // Main Content
  activeView: 'knowledge' | 'chat' | 'graph';
  
  // Actions
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
  toggleContextPanel: () => void;
  setContextPanelWidth: (width: number) => void;
  setActiveView: (view: string) => void;
}
```

## Backend Services and Utilities

### Service Layer

#### Node Service

**File**: `src/services/nodeService.ts`

Business logic for node operations.

**Methods:**

##### `createNode(userId: string, title: string, content: string, metadata?: Record<string, any>): Promise<Node>`
Create a new knowledge node.

```typescript
const node = await NodeService.createNode(
  userId,
  'Machine Learning Basics',
  'Introduction to ML concepts...',
  { category: 'education', tags: ['ml', 'ai'] }
);
```

##### `getNodeById(id: string, userId: string): Promise<Node>`
Get a node by ID with user ownership validation.

```typescript
const node = await NodeService.getNodeById('node-id', userId);
```

##### `getNodesByUser(userId: string, page: number, limit: number, search?: string, isArchived?: boolean): Promise<{ nodes: Node[], total: number }>`
Get paginated nodes for a user with optional search and archive filtering.

```typescript
const { nodes, total } = await NodeService.getNodesByUser(
  userId,
  1,
  20,
  'machine learning',
  false
);
```

##### `updateNode(id: string, userId: string, updates: Partial<NodeRequest>): Promise<Node>`
Update a node with validation.

```typescript
const updatedNode = await NodeService.updateNode(
  'node-id',
  userId,
  { title: 'Updated Title', content: 'New content...' }
);
```

##### `archiveNode(id: string, userId: string): Promise<Node>`
Archive a node (soft delete).

```typescript
await NodeService.archiveNode('node-id', userId);
```

##### `restoreNode(id: string, userId: string): Promise<Node>`
Restore an archived node.

```typescript
await NodeService.restoreNode('node-id', userId);
```

##### `deleteNode(id: string, userId: string): Promise<void>`
Permanently delete a node.

```typescript
await NodeService.deleteNode('node-id', userId);
```

#### Conversation Service

**File**: `src/services/conversationService.ts`

Business logic for conversation and message operations.

**Methods:**

##### `createConversation(userId: string, title: string, description?: string): Promise<Conversation>`
Create a new conversation.

```typescript
const conversation = await ConversationService.createConversation(
  userId,
  'AI Discussion',
  'Conversation about AI topics'
);
```

##### `addMessage(conversationId: string, userId: string, content: string, role: string, metadata?: Record<string, any>): Promise<Message>`
Add a message to a conversation.

```typescript
const message = await ConversationService.addMessage(
  'conv-id',
  userId,
  'Hello, how can I help?',
  'user',
  { timestamp: new Date().toISOString() }
);
```

##### `getConversationsByUser(userId: string): Promise<Conversation[]>`
Get all conversations for a user.

```typescript
const conversations = await ConversationService.getConversationsByUser(userId);
```

##### `getMessagesByConversation(conversationId: string, userId: string): Promise<Message[]>`
Get all messages for a conversation.

```typescript
const messages = await ConversationService.getMessagesByConversation('conv-id', userId);
```

#### SuperTag Service

**File**: `src/services/superTagService.ts`

Business logic for SuperTag operations.

**Methods:**

##### `createSuperTag(userId: string, name: string, description?: string, color?: string): Promise<SuperTag>`
Create a new SuperTag.

```typescript
const superTag = await SuperTagService.createSuperTag(
  userId,
  'Person',
  'Template for person information',
  '#3B82F6'
);
```

##### `addField(superTagId: string, userId: string, field: FieldRequest): Promise<Field>`
Add a field to a SuperTag.

```typescript
const field = await SuperTagService.addField(
  'tag-id',
  userId,
  { name: 'Email', type: 'text', required: false }
);
```

##### `applyToNode(superTagId: string, nodeId: string, userId: string): Promise<NodeSuperTag>`
Apply a SuperTag to a node.

```typescript
await SuperTagService.applyToNode('tag-id', 'node-id', userId);
```

#### User Service

**File**: `src/services/userService.ts`

Business logic for user operations.

**Methods:**

##### `createUser(email: string, password: string, firstName?: string, lastName?: string): Promise<User>`
Create a new user account.

```typescript
const user = await UserService.createUser(
  'user@example.com',
  'hashedPassword',
  'John',
  'Doe'
);
```

##### `authenticateUser(email: string, password: string): Promise<{ user: User, token: string }>`
Authenticate user and generate JWT token.

```typescript
const { user, token } = await UserService.authenticateUser(
  'user@example.com',
  'password'
);
```

##### `updatePreferences(userId: string, preferences: Record<string, any>): Promise<User>`
Update user preferences.

```typescript
await UserService.updatePreferences(userId, {
  theme: 'dark',
  notifications: true
});
```

#### Agent Service

**File**: `src/services/agentService.ts`

Business logic for AI agent operations.

**Methods:**

##### `processMessageWithAgents(messageId: string, userId: string): Promise<AgentAction[]>`
Process a message with available agents.

```typescript
const actions = await AgentService.processMessageWithAgents('message-id', userId);
```

##### `approveAction(actionId: string, userId: string): Promise<void>`
Approve and execute an agent action.

```typescript
await AgentService.approveAction('action-id', userId);
```

##### `rejectAction(actionId: string, userId: string): Promise<void>`
Reject an agent action.

```typescript
await AgentService.rejectAction('action-id', userId);
```

### Utility Functions

#### Response Handler

**File**: `src/utils/responseHandler.ts`

Standardized response formatting for API endpoints.

**Functions:**

##### `successResponse(res: Response, data: any, message: string, statusCode: number = 200): Response`
Format success response.

```typescript
return successResponse(res, user, 'User created successfully', 201);
```

##### `errorResponse(res: Response, message: string, statusCode: number = 500): Response`
Format error response.

```typescript
return errorResponse(res, 'User not found', 404);
```

##### `notFoundResponse(res: Response, message: string = 'Resource not found'): Response`
Format not found response.

```typescript
return notFoundResponse(res, 'Node not found');
```

#### Route Handler

**File**: `src/utils/routeHandler.ts`

Wrapper for handling async route handlers with error catching.

**Function:**

##### `createHandler(handler: Function): Function`
Wrap async route handlers with error handling.

```typescript
import { createHandler } from '../utils/routeHandler';

router.get('/nodes', createHandler(NodeController.getNodes));
```

#### Validation Utilities

**File**: `src/utils/validation.ts`

Input validation utilities.

**Functions:**

##### `validateEmail(email: string): boolean`
Validate email format.

```typescript
const isValid = validateEmail('user@example.com'); // true
```

##### `validatePassword(password: string): { isValid: boolean, errors: string[] }`
Validate password strength.

```typescript
const { isValid, errors } = validatePassword('myPassword123');
```

##### `sanitizeInput(input: string): string`
Sanitize user input to prevent XSS.

```typescript
const clean = sanitizeInput('<script>alert("xss")</script>'); // Clean string
```

#### Database Utilities

**File**: `src/utils/database.ts`

Database connection and query utilities.

**Functions:**

##### `getConnection(): Promise<Connection>`
Get database connection.

```typescript
const connection = await getConnection();
```

##### `executeTransaction<T>(callback: (manager: EntityManager) => Promise<T>): Promise<T>`
Execute database transaction.

```typescript
const result = await executeTransaction(async (manager) => {
  const user = await manager.save(User, userData);
  const profile = await manager.save(Profile, profileData);
  return { user, profile };
});
```

#### Logging Utilities

**File**: `src/utils/logger.ts`

Centralized logging configuration.

**Usage:**
```typescript
import logger from '../utils/logger';

logger.info('User created successfully', { userId: user.id });
logger.error('Database connection failed', { error: error.message });
logger.warn('Rate limit exceeded', { ip: req.ip });
```

**Log Levels:**
- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `debug`: Debug-level messages

#### Cache Utilities

**File**: `src/utils/cache.ts`

Redis cache utilities.

**Functions:**

##### `get<T>(key: string): Promise<T | null>`
Get value from cache.

```typescript
const user = await cache.get<User>(`user:${userId}`);
```

##### `set(key: string, value: any, ttl?: number): Promise<void>`
Set value in cache with optional TTL.

```typescript
await cache.set(`user:${userId}`, user, 3600); // 1 hour TTL
```

##### `del(key: string): Promise<void>`
Delete value from cache.

```typescript
await cache.del(`user:${userId}`);
```

##### `clear(): Promise<void>`
Clear all cache entries.

```typescript
await cache.clear();
```

### Middleware

#### Authentication Middleware

**File**: `src/middleware/auth.ts`

JWT authentication middleware.

**Usage:**
```typescript
import { authenticate } from '../middleware/auth';

router.get('/protected', authenticate, (req, res) => {
  // req.userId is available
  res.json({ userId: req.userId });
});
```

#### Validation Middleware

**File**: `src/middleware/validator.ts`

Request validation middleware.

**Functions:**

##### `validateNode(req: Request, res: Response, next: NextFunction): void`
Validate node creation/update data.

##### `validateRegistration(req: Request, res: Response, next: NextFunction): void`
Validate user registration data.

##### `validateUUID(field: string): Function`
Validate UUID parameters.

**Usage:**
```typescript
import { validateNode, validateUUID } from '../middleware/validator';

router.post('/nodes', validateNode, NodeController.createNode);
router.get('/nodes/:id', validateUUID('id'), NodeController.getNodeById);
```

#### Rate Limiting Middleware

**File**: `src/middleware/rateLimiter.ts`

Rate limiting implementation.

**Usage:**
```typescript
import { createRateLimiter } from '../middleware/rateLimiter';

const authLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  message: 'Too many authentication attempts'
});

router.post('/auth/login', authLimiter, AuthController.login);
```

### Configuration

#### Database Configuration

**File**: `src/config/database.ts`

TypeORM database configuration.

```typescript
export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ai_pkm',
  entities: [User, Node, Conversation, Message, SuperTag, Field],
  migrations: ['src/migration/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
};
```

#### Redis Configuration

**File**: `src/config/redis.ts`

Redis connection configuration.

```typescript
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
};
```

#### Environment Configuration

**File**: `src/config/environment.ts`

Environment variable validation and defaults.

```typescript
export const config = {
  port: parseInt(process.env.PORT || '3001'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',
  openaiApiKey: process.env.OPENAI_API_KEY,
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
};
```

## Testing Utilities

### Frontend Test Utilities

**File**: `src/test-utils/index.ts`

React Testing Library utilities with store providers.

```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';

interface CustomRenderOptions extends RenderOptions {
  preloadedState?: Partial<AppState>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: CustomRenderOptions
) {
  const { preloadedState, ...renderOptions } = options || {};

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';
```

### Backend Test Utilities

**File**: `src/tests/testUtils.ts`

Database and request testing utilities.

```typescript
import { DataSource } from 'typeorm';
import request from 'supertest';
import app from '../app';

export class TestDatabase {
  private static connection: DataSource;

  static async initialize(): Promise<void> {
    this.connection = new DataSource({
      type: 'sqlite',
      database: ':memory:',
      entities: [/* entities */],
      synchronize: true,
    });
    await this.connection.initialize();
  }

  static async cleanup(): Promise<void> {
    await this.connection.destroy();
  }

  static getConnection(): DataSource {
    return this.connection;
  }
}

export const createTestUser = async () => {
  const response = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: 'testPassword123',
      firstName: 'Test',
      lastName: 'User'
    });
  
  return response.body.data;
};

export const authenticateTestUser = async (user: any) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: user.email,
      password: 'testPassword123'
    });
  
  return response.body.data.token;
};
```

This comprehensive documentation covers all services, utilities, and helper functions in the AI PKM system, providing developers with the information needed to effectively use and extend the system's functionality.