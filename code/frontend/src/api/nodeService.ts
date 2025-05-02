import apiClient from './client';

export interface NodeRequest {
    title: string;
    content: string;
    metadata?: Record<string, any>;
}

export interface NodeResponse {
    id: string;
    title: string;
    content: string;
    isArchived: boolean;
    metadata: Record<string, any>;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

export interface NodeListParams {
    page?: number;
    limit?: number;
    search?: string;
    superTagId?: string;
    isArchived?: boolean;
}

export interface NodeListResponse {
    nodes: NodeResponse[];
    total: number;
    page: number;
    limit: number;
}

const nodeService = {
    // Get all nodes with pagination and filtering
    getNodes: async (params: NodeListParams = {}): Promise<NodeListResponse> => {
        const response = await apiClient.get<NodeListResponse>('/nodes', { params });
        return response.data;
    },

    // Get a single node by ID
    getNode: async (id: string): Promise<NodeResponse> => {
        const response = await apiClient.get<NodeResponse>(`/nodes/${id}`);
        return response.data;
    },

    // Create a new node
    createNode: async (data: NodeRequest): Promise<NodeResponse> => {
        const response = await apiClient.post<NodeResponse>('/nodes', data);
        return response.data;
    },

    // Update an existing node
    updateNode: async (id: string, data: Partial<NodeRequest>): Promise<NodeResponse> => {
        const response = await apiClient.patch<NodeResponse>(`/nodes/${id}`, data);
        return response.data;
    },

    // Archive a node
    archiveNode: async (id: string): Promise<NodeResponse> => {
        const response = await apiClient.patch<NodeResponse>(`/nodes/${id}/archive`, { isArchived: true });
        return response.data;
    },

    // Restore an archived node
    restoreNode: async (id: string): Promise<NodeResponse> => {
        const response = await apiClient.patch<NodeResponse>(`/nodes/${id}/archive`, { isArchived: false });
        return response.data;
    },

    // Delete a node
    deleteNode: async (id: string): Promise<void> => {
        await apiClient.delete(`/nodes/${id}`);
    },

    // Apply a supertag to a node
    applySupertag: async (nodeId: string, superTagId: string): Promise<NodeResponse> => {
        const response = await apiClient.post<NodeResponse>(`/nodes/${nodeId}/supertags`, { superTagId });
        return response.data;
    },

    // Remove a supertag from a node
    removeSupertag: async (nodeId: string, superTagId: string): Promise<NodeResponse> => {
        const response = await apiClient.delete<NodeResponse>(`/nodes/${nodeId}/supertags/${superTagId}`);
        return response.data;
    },

    // Create a link between two nodes
    createLink: async (sourceNodeId: string, targetNodeId: string, type: string, metadata?: Record<string, any>): Promise<any> => {
        const response = await apiClient.post('/links', { sourceNodeId, targetNodeId, type, metadata });
        return response.data;
    },

    // Delete a link between two nodes
    deleteLink: async (linkId: string): Promise<void> => {
        await apiClient.delete(`/links/${linkId}`);
    },
};

export default nodeService;