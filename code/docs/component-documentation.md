# React Components Documentation

## Overview

This document provides detailed documentation for all React components in the AI Personal Knowledge Management system. Each component is documented with its props, usage examples, and implementation notes.

## Component Architecture

The components are organized into the following categories:
- **Layout Components**: Core layout and navigation
- **Knowledge Components**: Knowledge graph and node management
- **Chat Components**: Conversation and messaging interface
- **Common Components**: Reusable UI components

## Layout Components

### AppLayout

The main application layout component that provides the overall structure including sidebar, main content area, and responsive design.

**File**: `src/components/Layout/AppLayout.tsx`

**Props:**
```typescript
interface AppLayoutProps {
  children: React.ReactNode;
}
```

**Features:**
- Responsive design with collapsible sidebar
- Theme-aware styling
- Consistent spacing and layout
- Handles routing and navigation state

**Usage:**
```tsx
import { AppLayout } from '@/components/Layout';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/knowledge" element={<KnowledgeGraph />} />
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>
    </AppLayout>
  );
}
```

**CSS Classes:**
- `.app-layout`: Main container
- `.app-layout__sidebar`: Sidebar area
- `.app-layout__main`: Main content area

### Sidebar

Navigation sidebar with collapsible design and context-aware panels.

**File**: `src/components/Layout/Sidebar.tsx`

**Props:**
```typescript
interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  children?: React.ReactNode;
}
```

**Features:**
- Collapsible sidebar with animation
- Navigation tree integration
- Context panels for selected items
- Responsive breakpoints

**Usage:**
```tsx
import { Sidebar } from '@/components/Layout';

function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar
      isCollapsed={isCollapsed}
      onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
    >
      <NavigationTree />
      <ContextPanel />
    </Sidebar>
  );
}
```

### NavigationTree

Hierarchical tree navigation for browsing nodes, conversations, and tags.

**File**: `src/components/Layout/NavigationTree.tsx`

**Props:**
```typescript
interface NavigationTreeProps {
  onNodeSelect?: (nodeId: string) => void;
  onConversationSelect?: (conversationId: string) => void;
  onTagSelect?: (tagId: string) => void;
  selectedNodeId?: string;
  selectedConversationId?: string;
  selectedTagId?: string;
  showArchived?: boolean;
  searchQuery?: string;
}
```

**Features:**
- Expandable/collapsible tree nodes
- Search and filtering
- Drag-and-drop support
- Context menus for actions
- Virtual scrolling for performance

**Usage:**
```tsx
import { NavigationTree } from '@/components/Layout';

function SidebarNavigation() {
  const [selectedNode, setSelectedNode] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <NavigationTree
      onNodeSelect={setSelectedNode}
      selectedNodeId={selectedNode}
      searchQuery={searchQuery}
      showArchived={false}
    />
  );
}
```

**Tree Node Structure:**
```typescript
interface TreeNode {
  id: string;
  type: 'node' | 'conversation' | 'tag' | 'folder';
  title: string;
  children?: TreeNode[];
  isExpanded?: boolean;
  metadata?: Record<string, any>;
}
```

### MainPanel

Main content area component with flexible layout support.

**File**: `src/components/Layout/MainPanel.tsx`

**Props:**
```typescript
interface MainPanelProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Features:**
- Flexible header and footer slots
- Scrollable content area
- Responsive design
- Theme integration

**Usage:**
```tsx
import { MainPanel } from '@/components/Layout';

function ContentArea() {
  return (
    <MainPanel
      header={<PageHeader title="Knowledge Graph" />}
      footer={<StatusBar />}
    >
      <KnowledgeGraph />
    </MainPanel>
  );
}
```

### ContextPanel

Context-sensitive panel that shows relevant information based on current selection.

**File**: `src/components/Layout/ContextPanel.tsx`

**Props:**
```typescript
interface ContextPanelProps {
  contextType: 'node' | 'conversation' | 'search' | 'tag';
  contextId?: string;
  isVisible?: boolean;
  onClose?: () => void;
}
```

**Features:**
- Dynamic content based on context type
- Resizable panel
- Quick actions for selected items
- Related items display

**Usage:**
```tsx
import { ContextPanel } from '@/components/Layout';

function ContextSidebar() {
  const { selectedNode } = useKnowledgeStore();

  return (
    <ContextPanel
      contextType="node"
      contextId={selectedNode?.id}
      isVisible={!!selectedNode}
    />
  );
}
```

## Knowledge Components

### KnowledgeGraph

Interactive D3.js-based visualization of knowledge nodes and their relationships.

**File**: `src/components/Knowledge/KnowledgeGraph.tsx`

**Props:**
```typescript
interface KnowledgeGraphProps {
  nodes: NodeResponse[];
  links: LinkResponse[];
  onNodeClick?: (node: NodeResponse) => void;
  onNodeDoubleClick?: (node: NodeResponse) => void;
  onLinkClick?: (link: LinkResponse) => void;
  width?: number;
  height?: number;
  selectedNodeId?: string;
  highlightedNodeIds?: string[];
  zoom?: boolean;
  pan?: boolean;
  showLabels?: boolean;
  colorScheme?: 'default' | 'category' | 'cluster';
}
```

**Features:**
- Force-directed graph layout
- Zoom and pan interactions
- Node clustering and filtering
- Custom color schemes
- Interactive tooltips
- Performance optimization for large graphs

**Usage:**
```tsx
import { KnowledgeGraph } from '@/components/Knowledge';

function GraphView() {
  const { nodes, links, selectedNode } = useKnowledgeStore();

  const handleNodeClick = (node: NodeResponse) => {
    useKnowledgeStore.getState().selectNode(node);
  };

  return (
    <KnowledgeGraph
      nodes={nodes}
      links={links}
      onNodeClick={handleNodeClick}
      selectedNodeId={selectedNode?.id}
      width={1200}
      height={800}
      zoom={true}
      showLabels={true}
      colorScheme="category"
    />
  );
}
```

**Graph Customization:**
```typescript
interface GraphTheme {
  nodeRadius: number;
  linkWidth: number;
  colors: {
    nodes: Record<string, string>;
    links: Record<string, string>;
    selected: string;
    highlighted: string;
  };
  fonts: {
    family: string;
    size: number;
  };
}
```

### NodeDetail

Comprehensive node editor with rich text editing, metadata management, and tag assignment.

**File**: `src/components/Knowledge/NodeDetail.tsx`

**Props:**
```typescript
interface NodeDetailProps {
  nodeId: string;
  onSave?: (node: NodeResponse) => void;
  onDelete?: (nodeId: string) => void;
  onArchive?: (nodeId: string) => void;
  readOnly?: boolean;
  showMetadata?: boolean;
  showRelations?: boolean;
}
```

**Features:**
- Rich text editor with markdown support
- Metadata field editing
- Tag assignment and management
- Version history
- Auto-save functionality
- Relation management

**Usage:**
```tsx
import { NodeDetail } from '@/components/Knowledge';

function NodeEditor({ nodeId }: { nodeId: string }) {
  const handleSave = async (node: NodeResponse) => {
    await nodeService.updateNode(node.id, node);
    toast.success('Node saved successfully');
  };

  return (
    <NodeDetail
      nodeId={nodeId}
      onSave={handleSave}
      showMetadata={true}
      showRelations={true}
      readOnly={false}
    />
  );
}
```

**Editor Features:**
- Markdown syntax highlighting
- Image and file attachments
- Link creation to other nodes
- Tag autocomplete
- Metadata field validation

### KnowledgePanel

Panel for browsing, searching, and managing knowledge nodes.

**File**: `src/components/Knowledge/KnowledgePanel.tsx`

**Props:**
```typescript
interface KnowledgePanelProps {
  onNodeSelect?: (node: NodeResponse) => void;
  onNodeCreate?: () => void;
  selectedNodeId?: string;
  showArchived?: boolean;
  showCreateButton?: boolean;
  searchPlaceholder?: string;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'relevance';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    tags?: string[];
    dateRange?: [Date, Date];
    contentType?: string[];
  };
}
```

**Features:**
- Advanced search with filters
- Multiple view modes (list, grid, cards)
- Sorting and filtering options
- Bulk operations
- Infinite scrolling

**Usage:**
```tsx
import { KnowledgePanel } from '@/components/Knowledge';

function KnowledgeBrowser() {
  const [selectedNode, setSelectedNode] = useState<string>();
  const [filters, setFilters] = useState({
    tags: [],
    dateRange: undefined,
  });

  return (
    <KnowledgePanel
      onNodeSelect={setSelectedNode}
      selectedNodeId={selectedNode}
      sortBy="updatedAt"
      sortOrder="desc"
      filterBy={filters}
      showCreateButton={true}
    />
  );
}
```

## Chat Components

### ChatWindow

Main chat interface with message history, input, and related nodes.

**File**: `src/components/Chat/ChatWindow.tsx`

**Props:**
```typescript
interface ChatWindowProps {
  conversationId: string;
  onMessageSent?: (message: MessageResponse) => void;
  onNodeCreate?: (messageId: string, title: string, content: string) => void;
  showRelatedNodes?: boolean;
  showAgentSuggestions?: boolean;
  autoScroll?: boolean;
  maxHeight?: number;
}
```

**Features:**
- Real-time message display
- Message threading
- Agent action suggestions
- Related nodes sidebar
- Message search
- Export functionality

**Usage:**
```tsx
import { ChatWindow } from '@/components/Chat';

function ConversationView({ conversationId }: { conversationId: string }) {
  const handleMessageSent = (message: MessageResponse) => {
    // Handle new message
    console.log('New message:', message);
  };

  const handleNodeCreate = async (messageId: string, title: string, content: string) => {
    await nodeService.createNode({ title, content, metadata: { sourceMessageId: messageId } });
  };

  return (
    <ChatWindow
      conversationId={conversationId}
      onMessageSent={handleMessageSent}
      onNodeCreate={handleNodeCreate}
      showRelatedNodes={true}
      showAgentSuggestions={true}
      autoScroll={true}
    />
  );
}
```

### ChatMessage

Individual message component with actions and formatting.

**File**: `src/components/Chat/ChatMessage.tsx`

**Props:**
```typescript
interface ChatMessageProps {
  message: MessageResponse;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, content: string) => void;
  onCreateNode?: (messageId: string, title: string, content: string) => void;
  onCopy?: (content: string) => void;
  showTimestamp?: boolean;
  showActions?: boolean;
  isEditing?: boolean;
}
```

**Features:**
- Message formatting (markdown, code blocks)
- Action menu (edit, delete, create node)
- Timestamp display
- Copy to clipboard
- Message reactions

**Usage:**
```tsx
import { ChatMessage } from '@/components/Chat';

function MessageList({ messages }: { messages: MessageResponse[] }) {
  const handleDelete = async (messageId: string) => {
    await conversationService.deleteMessage(conversationId, messageId);
  };

  return (
    <div className="message-list">
      {messages.map(message => (
        <ChatMessage
          key={message.id}
          message={message}
          onDelete={handleDelete}
          showTimestamp={true}
          showActions={true}
        />
      ))}
    </div>
  );
}
```

### ChatInput

Message input component with rich text support and file attachments.

**File**: `src/components/Chat/ChatInput.tsx`

**Props:**
```typescript
interface ChatInputProps {
  onSendMessage: (content: string, attachments?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
  maxLength?: number;
  allowAttachments?: boolean;
  allowFormatting?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}
```

**Features:**
- Rich text editing
- File attachments
- Emoji picker
- Message templates
- Keyboard shortcuts
- Auto-complete for node references

**Usage:**
```tsx
import { ChatInput } from '@/components/Chat';

function MessageComposer() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    setIsLoading(true);
    try {
      await conversationService.addMessage(conversationId, {
        content,
        role: 'user',
        metadata: { attachments: attachments?.map(f => f.name) }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatInput
      onSendMessage={handleSendMessage}
      isLoading={isLoading}
      placeholder="Type your message..."
      allowAttachments={true}
      allowFormatting={true}
      maxLength={5000}
    />
  );
}
```

### RelatedNodes

Component displaying nodes related to the current conversation.

**File**: `src/components/Chat/RelatedNodes.tsx`

**Props:**
```typescript
interface RelatedNodesProps {
  conversationId: string;
  onNodeClick?: (node: NodeResponse) => void;
  maxNodes?: number;
  showCreateButton?: boolean;
  sortBy?: 'relevance' | 'createdAt' | 'title';
}
```

**Features:**
- Automatic relevance calculation
- Quick node creation from context
- Node preview on hover
- Filtering and sorting

**Usage:**
```tsx
import { RelatedNodes } from '@/components/Chat';

function ChatSidebar({ conversationId }: { conversationId: string }) {
  const handleNodeClick = (node: NodeResponse) => {
    // Navigate to node or open in modal
    useKnowledgeStore.getState().selectNode(node);
  };

  return (
    <RelatedNodes
      conversationId={conversationId}
      onNodeClick={handleNodeClick}
      maxNodes={10}
      showCreateButton={true}
      sortBy="relevance"
    />
  );
}
```

### AgentSuggestion

Component for displaying and managing agent action suggestions.

**File**: `src/components/Chat/AgentSuggestion.tsx`

**Props:**
```typescript
interface AgentSuggestionProps {
  actionId: string;
  onApprove?: (actionId: string) => void;
  onReject?: (actionId: string) => void;
  onModify?: (actionId: string, modifications: Record<string, any>) => void;
  showDetails?: boolean;
  allowModification?: boolean;
}
```

**Features:**
- Action preview
- Approval/rejection workflow
- Modification capabilities
- Confidence scoring

**Usage:**
```tsx
import { AgentSuggestion } from '@/components/Chat';

function AgentActions({ conversationId }: { conversationId: string }) {
  const { pendingActions } = useConversationStore();

  const handleApprove = async (actionId: string) => {
    await agentService.approveAction(actionId);
  };

  const handleReject = async (actionId: string) => {
    await agentService.rejectAction(actionId);
  };

  return (
    <div className="agent-actions">
      {pendingActions.map(action => (
        <AgentSuggestion
          key={action.id}
          actionId={action.id}
          onApprove={handleApprove}
          onReject={handleReject}
          showDetails={true}
          allowModification={true}
        />
      ))}
    </div>
  );
}
```

## Hook Documentation

### useChatKnowledge

Custom hook integrating chat and knowledge functionality.

**File**: `src/hooks/useChatKnowledge.ts`

**Parameters:**
```typescript
interface UseChatKnowledgeProps {
  conversationId?: string;
  autoProcessMessages?: boolean;
}
```

**Returns:**
```typescript
interface UseChatKnowledgeResult {
  // State
  messages: MessageResponse[];
  relatedNodes: NodeResponse[];
  pendingActions: AgentActionResponse[];
  isLoadingMessages: boolean;
  isLoadingNodes: boolean;
  
  // Actions
  sendMessage: (content: string) => Promise<MessageResponse>;
  createNodeFromMessage: (messageId: string, title: string, content: string) => Promise<NodeResponse>;
  findRelatedNodesForMessage: (messageId: string) => NodeResponse[];
  processMessageWithAgents: (messageId: string) => Promise<void>;
  approveAction: (actionId: string) => Promise<void>;
  rejectAction: (actionId: string) => Promise<void>;
}
```

**Usage:**
```tsx
import { useChatKnowledge } from '@/hooks/useChatKnowledge';

function IntegratedChatView({ conversationId }: { conversationId: string }) {
  const {
    messages,
    relatedNodes,
    sendMessage,
    createNodeFromMessage,
    processMessageWithAgents
  } = useChatKnowledge({ 
    conversationId,
    autoProcessMessages: true 
  });

  const handleSend = async (content: string) => {
    const message = await sendMessage(content);
    await processMessageWithAgents(message.id);
  };

  return (
    <div className="integrated-chat">
      <ChatWindow conversationId={conversationId} />
      <RelatedNodes 
        conversationId={conversationId}
        nodes={relatedNodes}
      />
    </div>
  );
}
```

## Styling and Theming

### CSS Classes Convention

Components follow a BEM-like naming convention:

```css
/* Component base */
.component-name { }

/* Component elements */
.component-name__element { }

/* Component modifiers */
.component-name--modifier { }

/* State classes */
.component-name.is-active { }
.component-name.is-loading { }
.component-name.is-disabled { }
```

### Theme Integration

Components support theming through Chakra UI and CSS custom properties:

```tsx
import { useTheme } from '@chakra-ui/react';

function ThemedComponent() {
  const theme = useTheme();
  
  return (
    <div
      style={{
        backgroundColor: theme.colors.bg.primary,
        color: theme.colors.text.primary,
      }}
    >
      Themed content
    </div>
  );
}
```

### Responsive Design

Components use responsive utilities for different screen sizes:

```tsx
import { Box, useBreakpointValue } from '@chakra-ui/react';

function ResponsiveComponent() {
  const direction = useBreakpointValue({ base: 'column', md: 'row' });
  
  return (
    <Box flexDirection={direction}>
      Content adapts to screen size
    </Box>
  );
}
```

## Performance Considerations

### Virtualization

For large lists, components use virtual scrolling:

```tsx
import { FixedSizeList as List } from 'react-window';

function VirtualizedNodeList({ nodes }: { nodes: NodeResponse[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <NodeItem node={nodes[index]} />
    </div>
  );

  return (
    <List
      height={600}
      itemCount={nodes.length}
      itemSize={60}
    >
      {Row}
    </List>
  );
}
```

### Memoization

Components use React.memo and useMemo for optimization:

```tsx
import { memo, useMemo } from 'react';

const OptimizedNodeList = memo(function NodeList({ 
  nodes, 
  searchQuery 
}: { 
  nodes: NodeResponse[];
  searchQuery: string;
}) {
  const filteredNodes = useMemo(() => 
    nodes.filter(node => 
      node.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [nodes, searchQuery]
  );

  return (
    <div>
      {filteredNodes.map(node => (
        <NodeItem key={node.id} node={node} />
      ))}
    </div>
  );
});
```

### Lazy Loading

Components support lazy loading for better performance:

```tsx
import { lazy, Suspense } from 'react';

const KnowledgeGraph = lazy(() => import('@/components/Knowledge/KnowledgeGraph'));

function LazyGraphView() {
  return (
    <Suspense fallback={<div>Loading graph...</div>}>
      <KnowledgeGraph />
    </Suspense>
  );
}
```

## Testing Components

### Unit Testing

Components should be tested using React Testing Library:

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ChatInput } from '@/components/Chat/ChatInput';

test('sends message when form is submitted', async () => {
  const mockSendMessage = jest.fn();
  
  render(
    <ChatInput onSendMessage={mockSendMessage} />
  );
  
  const input = screen.getByPlaceholderText('Type your message...');
  const sendButton = screen.getByRole('button', { name: /send/i });
  
  fireEvent.change(input, { target: { value: 'Hello world' } });
  fireEvent.click(sendButton);
  
  expect(mockSendMessage).toHaveBeenCalledWith('Hello world');
});
```

### Integration Testing

Test component interactions with stores and services:

```tsx
import { renderWithProviders } from '@/test-utils';
import { KnowledgePanel } from '@/components/Knowledge/KnowledgePanel';

test('displays nodes from knowledge store', async () => {
  const mockNodes = [
    { id: '1', title: 'Test Node', content: 'Content' }
  ];
  
  renderWithProviders(
    <KnowledgePanel />,
    {
      preloadedState: {
        knowledge: { nodes: mockNodes }
      }
    }
  );
  
  expect(await screen.findByText('Test Node')).toBeInTheDocument();
});
```

## Accessibility

### ARIA Labels

Components include appropriate ARIA labels:

```tsx
function AccessibleButton({ onClick, children, isLoading }: {
  onClick: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={isLoading ? 'Loading...' : undefined}
      aria-disabled={isLoading}
      disabled={isLoading}
    >
      {children}
    </button>
  );
}
```

### Keyboard Navigation

Components support keyboard navigation:

```tsx
function KeyboardNavigableList({ items }: { items: any[] }) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex(Math.min(focusedIndex + 1, items.length - 1));
        break;
      case 'ArrowUp':
        setFocusedIndex(Math.max(focusedIndex - 1, 0));
        break;
      case 'Enter':
        // Handle selection
        break;
    }
  };
  
  return (
    <div onKeyDown={handleKeyDown} role="listbox">
      {items.map((item, index) => (
        <div
          key={item.id}
          role="option"
          aria-selected={index === focusedIndex}
          tabIndex={index === focusedIndex ? 0 : -1}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}
```

This comprehensive component documentation provides developers with all the information needed to effectively use and extend the React components in the AI PKM system.