import { create } from 'zustand';
import { userService, UserResponse, LoginRequest, RegisterRequest } from '../api';

interface UserState {
    user: UserResponse | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
    fetchCurrentUser: () => Promise<void>;
    updatePreferences: (preferences: Record<string, any>) => Promise<void>;
}

const useUserStore = create<UserState>((set, get) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('token'),

    login: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await userService.login(data);
            localStorage.setItem('token', response.token);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to login',
                isLoading: false
            });
            throw error;
        }
    },

    register: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await userService.register(data);
            localStorage.setItem('token', response.token);
            set({
                user: response.user,
                token: response.token,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to register',
                isLoading: false
            });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        set({
            user: null,
            token: null,
            isAuthenticated: false
        });
    },

    fetchCurrentUser: async () => {
        if (!get().token) return;

        try {
            set({ isLoading: true, error: null });
            const user = await userService.getCurrentUser();
            set({ user, isLoading: false });
        } catch (error: any) {
            if (error.response?.status === 401) {
                get().logout();
            }
            set({
                error: error.response?.data?.message || 'Failed to fetch user',
                isLoading: false
            });
        }
    },

    updatePreferences: async (preferences) => {
        try {
            set({ isLoading: true, error: null });
            const updatedUser = await userService.updatePreferences(preferences);
            set({
                user: updatedUser,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update preferences',
                isLoading: false
            });
            throw error;
        }
    },
}));

export default useUserStore;