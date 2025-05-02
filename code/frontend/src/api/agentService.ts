import apiClient from './client';

export interface AgentResponse {
    id: string;
    type: string;
    name: string;
    description: string;
    isActive: boolean;
    configuration: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface AgentActionResponse {
    id: string;
    type: string;
    payload: Record<string, any>;
    status: string;
    approved: boolean;
    result: string | null;
    createdAt: string;
    executedAt: string | null;
    agentId: string;
    conversationId: string | null;
    nodeId: string | null;
    agent?: AgentResponse;
}

export interface AgentConfigurationRequest {
    isActive?: boolean;
    proactivityLevel?: 'low' | 'medium' | 'high';
    autoExecute?: boolean;
    notifyUser?: boolean;
    [key: string]: any;
}

const agentService = {
    // Get all agents for the current user
    getUserAgents: async (): Promise<AgentResponse[]> => {
        const response = await apiClient.get<AgentResponse[]>('/agents');
        return response.data;
    },

    // Update agent configuration
    updateAgentConfiguration: async (agentId: string, configuration: AgentConfigurationRequest): Promise<AgentResponse> => {
        const response = await apiClient.patch<AgentResponse>(`/agents/${agentId}/configuration`, configuration);
        return response.data;
    },

    // Get pending agent actions for a conversation
    getPendingActions: async (conversationId: string): Promise<AgentActionResponse[]> => {
        const response = await apiClient.get<AgentActionResponse[]>(`/agents/actions/conversation/${conversationId}`);
        return response.data;
    },

    // Approve an agent action
    approveAction: async (actionId: string): Promise<AgentActionResponse> => {
        const response = await apiClient.post<AgentActionResponse>(`/agents/actions/${actionId}/approve`);
        return response.data;
    },

    // Reject an agent action
    rejectAction: async (actionId: string): Promise<AgentActionResponse> => {
        const response = await apiClient.post<AgentActionResponse>(`/agents/actions/${actionId}/reject`);
        return response.data;
    },

    // Process a message with agents
    processMessage: async (messageId: string): Promise<AgentActionResponse[]> => {
        const response = await apiClient.post<AgentActionResponse[]>(`/agents/process-message/${messageId}`);
        return response.data;
    },

    // Initialize agents for a new user
    initializeAgentsForUser: async (): Promise<void> => {
        await apiClient.post('/agents/initialize');
    }
};

export default agentService;