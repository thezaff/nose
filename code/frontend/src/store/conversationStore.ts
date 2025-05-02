import { create } from 'zustand';
import {
    conversationService,
    agentService,
    ConversationResponse,
    MessageRequest,
    MessageResponse,
    AgentActionResponse
} from '../api';

interface ConversationState {
    conversations: ConversationResponse[];
    currentConversation: ConversationResponse | null;
    messages: MessageResponse[];
    agentActions: AgentActionResponse[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchConversations: () => Promise<void>;
    fetchConversation: (id: string) => Promise<void>;
    createConversation: (title?: string) => Promise<ConversationResponse>;
    updateConversation: (id: string, title: string) => Promise<void>;
    deleteConversation: (id: string) => Promise<void>;
    sendMessage: (content: string) => Promise<MessageResponse>;
    fetchMessages: (conversationId: string) => Promise<void>;
    fetchAgentActions: (conversationId: string) => Promise<void>;
    approveAgentAction: (actionId: string) => Promise<void>;
    rejectAgentAction: (actionId: string) => Promise<void>;
    setCurrentConversation: (conversation: ConversationResponse | null) => void;
}

const useConversationStore = create<ConversationState>((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    agentActions: [],
    isLoading: false,
    error: null,

    fetchConversations: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await conversationService.getConversations();
            set({
                conversations: response.conversations,
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch conversations',
                isLoading: false
            });
        }
    },

    fetchConversation: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const conversation = await conversationService.getConversation(id);
            set({
                currentConversation: conversation,
                messages: conversation.messages || [],
                isLoading: false
            });
            // Fetch agent actions for this conversation
            get().fetchAgentActions(id);
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch conversation',
                isLoading: false
            });
        }
    },

    createConversation: async (title) => {
        try {
            set({ isLoading: true, error: null });
            const conversation = await conversationService.createConversation({ title });
            set({
                conversations: [conversation, ...get().conversations],
                currentConversation: conversation,
                messages: [],
                isLoading: false
            });
            return conversation;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create conversation',
                isLoading: false
            });
            throw error;
        }
    },

    updateConversation: async (id, title) => {
        try {
            set({ isLoading: true, error: null });
            const updatedConversation = await conversationService.updateConversation(id, { title });

            // Update in conversations list
            set({
                conversations: get().conversations.map(conv =>
                    conv.id === id ? updatedConversation : conv
                ),
                isLoading: false
            });

            // Update current conversation if it's the one being edited
            if (get().currentConversation?.id === id) {
                set({ currentConversation: updatedConversation });
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update conversation',
                isLoading: false
            });
        }
    },

    deleteConversation: async (id) => {
        try {
            set({ isLoading: true, error: null });
            await conversationService.deleteConversation(id);

            // Remove from conversations list
            set({
                conversations: get().conversations.filter(conv => conv.id !== id),
                isLoading: false
            });

            // Clear current conversation if it's the one being deleted
            if (get().currentConversation?.id === id) {
                set({ currentConversation: null, messages: [] });
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete conversation',
                isLoading: false
            });
        }
    },

    sendMessage: async (content) => {
        const conversationId = get().currentConversation?.id;
        if (!conversationId) {
            throw new Error('No active conversation');
        }

        try {
            set({ isLoading: true, error: null });

            // Create message request
            const messageRequest: MessageRequest = {
                content,
                role: 'user'
            };

            // Send message
            const message = await conversationService.sendMessage(conversationId, messageRequest);

            // Add to messages list
            set({
                messages: [...get().messages, message],
                isLoading: false
            });

            return message;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to send message',
                isLoading: false
            });
            throw error;
        }
    },

    fetchMessages: async (conversationId) => {
        try {
            set({ isLoading: true, error: null });
            const messages = await conversationService.getMessages(conversationId);
            set({ messages, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch messages',
                isLoading: false
            });
        }
    },

    fetchAgentActions: async (conversationId) => {
        try {
            const actions = await agentService.getPendingActions(conversationId);
            set({ agentActions: actions });
        } catch (error: any) {
            console.error('Failed to fetch agent actions:', error);
        }
    },

    approveAgentAction: async (actionId) => {
        try {
            set({ isLoading: true, error: null });
            const updatedAction = await agentService.approveAction(actionId);

            // Update in agent actions list
            set({
                agentActions: get().agentActions.map(action =>
                    action.id === actionId ? updatedAction : action
                ),
                isLoading: false
            });

            // Refresh the conversation to get any changes made by the agent
            const currentConvId = get().currentConversation?.id;
            if (currentConvId) {
                await get().fetchConversation(currentConvId);
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to approve action',
                isLoading: false
            });
        }
    },

    rejectAgentAction: async (actionId) => {
        try {
            set({ isLoading: true, error: null });
            const updatedAction = await agentService.rejectAction(actionId);

            // Update in agent actions list
            set({
                agentActions: get().agentActions.map(action =>
                    action.id === actionId ? updatedAction : action
                ),
                isLoading: false
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to reject action',
                isLoading: false
            });
        }
    },

    setCurrentConversation: (conversation) => {
        set({ currentConversation: conversation });
        if (conversation) {
            set({ messages: conversation.messages || [] });
        } else {
            set({ messages: [] });
        }
    },
}));

export default useConversationStore;