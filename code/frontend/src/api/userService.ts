import apiClient from './client';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface UserResponse {
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: UserResponse;
    token: string;
}

const userService = {
    // Login user
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // Register user
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    // Get current user
    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await apiClient.get<UserResponse>('/auth/me');
        return response.data;
    },

    // Update user preferences
    updatePreferences: async (preferences: Record<string, any>): Promise<UserResponse> => {
        const response = await apiClient.patch<UserResponse>('/auth/preferences', { preferences });
        return response.data;
    },
};

export default userService;