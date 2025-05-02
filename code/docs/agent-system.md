# AI-PKM Agent System Documentation

## Overview

The agent system is a core differentiator for the AI-PKM application. It provides intelligent, autonomous capabilities that help users organize, connect, query, and summarize their knowledge base. The agents work in the background to enhance the user experience and provide valuable insights.

## Agent Architecture

The agent system follows a coordinated architecture with specialized agents:

```
┌─────────────────────────┐
│    Agent Coordinator    │
└───────────┬─────────────┘
            │
┌───────────┼─────────────┐
│           │             │
▼           ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│Organization│ │Connection│ │  Query  │
│  Agent   │ │  Agent   │ │  Agent  │
└─────────┘ └─────────┘ └─────────┘
                           │
                           ▼
                        ┌─────────┐
                        │ Summary │
                        │  Agent  │
                        └─────────┘
```

### Agent Coordinator

The Agent Coordinator is the central orchestrator for all agent activities. It:

- Manages communication between agents
- Processes user messages and routes them to appropriate agents
- Collects agent actions and presents them to the user
- Handles user approval or rejection of agent suggestions
- Executes approved agent actions

**Implementation**: `agentCoordinatorService.ts`

### Organization Agent

The Organization Agent helps categorize and structure information. It:

- Suggests appropriate SuperTags for nodes
- Identifies potential categories for untagged content
- Detects duplicate or redundant information
- Recommends restructuring of existing information

**Implementation**: `organizationAgentService.ts`

### Connection Agent

The Connection Agent identifies relationships between pieces of information. It:

- Suggests links between semantically related nodes
- Identifies potential connections between seemingly unrelated information
- Builds context maps for topics
- Recommends strength of relationships

**Implementation**: `connectionAgentService.ts`

### Query Agent

The Query Agent helps users find and synthesize information. It:

- Interprets natural language questions
- Retrieves relevant information across the knowledge graph
- Synthesizes answers from multiple knowledge nodes
- Provides context-aware responses

**Implementation**: `queryAgentService.ts`

### Summary Agent

The Summary Agent creates overviews and insights. It:

- Generates summaries of knowledge areas
- Identifies key insights across the knowledge base
- Creates reports on knowledge development over time
- Highlights important patterns and trends

**Implementation**: `summaryAgentService.ts`

## Agent Behaviors

Agents exhibit two types of behaviors:

### Reactive Behaviors

Triggered by user actions:

- Answering direct questions
- Processing requests for organization
- Executing specific commands

### Proactive Behaviors

Autonomous actions:

- Suggesting connections between recently added information
- Periodic knowledge base maintenance and organization
- Surfacing relevant information based on user context
- Identifying knowledge gaps or areas for expansion

## Agent Actions

Agents generate actions that are presented to the user for approval. Each action includes:

- **Type**: The kind of action (e.g., tag, link, summarize)
- **Description**: Human-readable explanation of the action
- **Data**: The specific changes or information
- **Confidence**: How confident the agent is in the suggestion
- **Source**: Which agent generated the action

## Agent Integration Flow

1. **Message Processing**:
   - User sends a message
   - Agent Coordinator processes the message
   - Relevant agents analyze the message
   - Agents generate potential actions

2. **Action Presentation**:
   - Actions are presented to the user
   - User can approve, modify, or reject actions

3. **Action Execution**:
   - Approved actions are executed
   - Knowledge base is updated
   - User is notified of changes

## Agent Configuration

Users can configure agent behavior through settings:

- **Proactivity Level**: How proactive agents should be (low, medium, high)
- **Auto-Execute**: Whether certain actions should be executed automatically
- **Notification Settings**: How and when to notify about agent actions
- **Agent-Specific Settings**: Specialized settings for each agent type

## Implementation Details

### Base Agent Service

All agents inherit from a base agent service that provides:

- Common functionality for processing messages
- Action generation and management
- Confidence scoring
- User preference handling

**Implementation**: `baseAgentService.ts`

### Agent Action Entity

Actions are stored in the database with the following structure:

```typescript
class AgentAction {
    id: string;
    agentId: string;
    type: string;
    description: string;
    data: Record<string, any>;
    confidence: number;
    status: ActionStatus; // PENDING, APPROVED, REJECTED, COMPLETED
    approved: boolean;
    createdAt: Date;
    executedAt: Date;
    conversationId: string;
    messageId: string;
}
```

### NLP Integration

Agents leverage NLP capabilities for:

- Entity extraction
- Semantic similarity
- Intent recognition
- Summarization

**Implementation**: `nlpService.ts`

## Agent Development Guide

### Creating a New Agent

To create a new agent:

1. Create a new service file in `src/services/agent/`
2. Extend the `BaseAgentService` class
3. Implement the required methods:
   - `processMessage`: Process a user message
   - `executeAction`: Execute an approved action
4. Register the agent in the `AgentCoordinatorService`

### Agent Method Signatures

```typescript
// Process a message and generate actions
async processMessage(message: Message): Promise<AgentAction[]>

// Execute an approved action
async executeAction(action: AgentAction): Promise<AgentAction>
```

### Best Practices

1. **Confidence Scoring**: Always include a confidence score with actions
2. **Clear Descriptions**: Provide clear, human-readable descriptions
3. **Reversible Actions**: Ensure actions can be reversed if needed
4. **Performance**: Be mindful of performance, especially for proactive behaviors
5. **User Preferences**: Always respect user preferences and settings

## Testing Agents

### Unit Testing

Test individual agent methods:

```typescript
describe('OrganizationAgent', () => {
  it('should suggest appropriate tags for content', async () => {
    // Test implementation
  });
});
```

### Integration Testing

Test agent interaction with the coordinator:

```typescript
describe('AgentCoordinator with OrganizationAgent', () => {
  it('should process messages and generate actions', async () => {
    // Test implementation
  });
});
```

### End-to-End Testing

Test the complete flow from user message to action execution:

```typescript
describe('Agent E2E', () => {
  it('should process a message, generate actions, and execute approved actions', async () => {
    // Test implementation
  });
});
```

## Monitoring and Debugging

### Logging

Agent actions are logged for debugging and analysis:

```typescript
logger.info('Agent action generated', {
  agentType: this.type,
  actionType: action.type,
  confidence: action.confidence,
  messageId: message.id
});
```

### Performance Metrics

Monitor agent performance:

- Action generation time
- Execution time
- Approval rate
- Usage patterns

### Troubleshooting

Common issues and solutions:

1. **Low Confidence Actions**: Adjust confidence thresholds or improve NLP models
2. **Slow Performance**: Optimize database queries or add caching
3. **Irrelevant Suggestions**: Fine-tune agent algorithms or improve context awareness

## Future Enhancements

Planned improvements to the agent system:

1. **Learning from User Feedback**: Improve suggestions based on user approvals/rejections
2. **Specialized Domain Agents**: Agents for specific knowledge domains
3. **Collaborative Agents**: Agents that work together on complex tasks
4. **Advanced NLP Integration**: Deeper integration with state-of-the-art NLP models
5. **Customizable Agent Workflows**: User-defined agent workflows and rules
