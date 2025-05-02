import apiClient from './client';

export interface FieldRequest {
    name: string;
    type: string;
    isRequired?: boolean;
    defaultValue?: string;
}

export interface FieldResponse {
    id: string;
    name: string;
    type: string;
    isRequired: boolean;
    defaultValue: string;
    createdAt: string;
    updatedAt: string;
    superTagId: string;
}

export interface SuperTagRequest {
    name: string;
    description?: string;
    fields?: FieldRequest[];
}

export interface SuperTagResponse {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    fields: FieldResponse[];
}

export interface SuperTagListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface SuperTagListResponse {
    superTags: SuperTagResponse[];
    total: number;
    page: number;
    limit: number;
}

const superTagService = {
    // Get all supertags with pagination and filtering
    getSuperTags: async (params: SuperTagListParams = {}): Promise<SuperTagListResponse> => {
        const response = await apiClient.get<SuperTagListResponse>('/supertags', { params });
        return response.data;
    },

    // Get a single supertag by ID
    getSuperTag: async (id: string): Promise<SuperTagResponse> => {
        const response = await apiClient.get<SuperTagResponse>(`/supertags/${id}`);
        return response.data;
    },

    // Create a new supertag
    createSuperTag: async (data: SuperTagRequest): Promise<SuperTagResponse> => {
        const response = await apiClient.post<SuperTagResponse>('/supertags', data);
        return response.data;
    },

    // Update an existing supertag
    updateSuperTag: async (id: string, data: Partial<SuperTagRequest>): Promise<SuperTagResponse> => {
        const response = await apiClient.patch<SuperTagResponse>(`/supertags/${id}`, data);
        return response.data;
    },

    // Delete a supertag
    deleteSuperTag: async (id: string): Promise<void> => {
        await apiClient.delete(`/supertags/${id}`);
    },

    // Add a field to a supertag
    addField: async (superTagId: string, field: FieldRequest): Promise<FieldResponse> => {
        const response = await apiClient.post<FieldResponse>(`/supertags/${superTagId}/fields`, field);
        return response.data;
    },

    // Update a field
    updateField: async (superTagId: string, fieldId: string, field: Partial<FieldRequest>): Promise<FieldResponse> => {
        const response = await apiClient.patch<FieldResponse>(`/supertags/${superTagId}/fields/${fieldId}`, field);
        return response.data;
    },

    // Delete a field
    deleteField: async (superTagId: string, fieldId: string): Promise<void> => {
        await apiClient.delete(`/supertags/${superTagId}/fields/${fieldId}`);
    },

    // Get nodes with a specific supertag
    getNodesWithSuperTag: async (superTagId: string, params: { page?: number; limit?: number } = {}): Promise<any> => {
        const response = await apiClient.get(`/supertags/${superTagId}/nodes`, { params });
        return response.data;
    },
};

export default superTagService;