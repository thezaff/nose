import apiClient from './client';

export interface MessageRequest {
    content: string;
    role?: string;
}

export interface MessageResponse {
    id: string;
    content: string;
    role: string;
    createdAt: string;
    conversationId: string;
    nodeReferences: string[];
    entities: Record<string, any>;
}

export interface ConversationRequest {
    title?: string;
}

export interface ConversationResponse {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    context: Record<string, any>;
    messages: MessageResponse[];
}

export interface ConversationListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ConversationListResponse {
    conversations: ConversationResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface AgentActionResponse {
    id: string;
    type: string;
    payload: Record<string, any>;
    approved: boolean;
    status: string;
    createdAt: string;
    executedAt: string | null;
}

const conversationService = {
    // Get all conversations with pagination and filtering
    getConversations: async (params: ConversationListParams = {}): Promise<ConversationListResponse> => {
        const response = await apiClient.get<ConversationListResponse>('/conversations', { params });
        return response.data;
    },

    // Get a single conversation by ID
    getConversation: async (id: string): Promise<ConversationResponse> => {
        const response = await apiClient.get<ConversationResponse>(`/conversations/${id}`);
        return response.data;
    },

    // Create a new conversation
    createConversation: async (data: ConversationRequest = {}): Promise<ConversationResponse> => {
        const response = await apiClient.post<ConversationResponse>('/conversations', data);
        return response.data;
    },

    // Update an existing conversation
    updateConversation: async (id: string, data: ConversationRequest): Promise<ConversationResponse> => {
        const response = await apiClient.patch<ConversationResponse>(`/conversations/${id}`, data);
        return response.data;
    },

    // Delete a conversation
    deleteConversation: async (id: string): Promise<void> => {
        await apiClient.delete(`/conversations/${id}`);
    },

    // Send a message in a conversation
    sendMessage: async (conversationId: string, message: MessageRequest): Promise<MessageResponse> => {
        const response = await apiClient.post<MessageResponse>(`/conversations/${conversationId}/messages`, message);
        return response.data;
    },

    // Get messages for a conversation
    getMessages: async (conversationId: string, params: { page?: number; limit?: number } = {}): Promise<MessageResponse[]> => {
        const response = await apiClient.get<MessageResponse[]>(`/conversations/${conversationId}/messages`, { params });
        return response.data;
    },

    // Get agent actions for a conversation
    getAgentActions: async (conversationId: string): Promise<AgentActionResponse[]> => {
        const response = await apiClient.get<AgentActionResponse[]>(`/conversations/${conversationId}/agent-actions`);
        return response.data;
    },

    // Approve an agent action
    approveAgentAction: async (actionId: string): Promise<AgentActionResponse> => {
        const response = await apiClient.post<AgentActionResponse>(`/agent-actions/${actionId}/approve`);
        return response.data;
    },

    // Reject an agent action
    rejectAgentAction: async (actionId: string): Promise<AgentActionResponse> => {
        const response = await apiClient.post<AgentActionResponse>(`/agent-actions/${actionId}/reject`);
        return response.data;
    },
};

export default conversationService;