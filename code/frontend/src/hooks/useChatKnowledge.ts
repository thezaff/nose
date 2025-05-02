import { useState, useCallback, useEffect } from 'react';
import { useConversationStore, useKnowledgeStore } from '../store';
import { MessageResponse } from '../api/conversationService';
import { NodeResponse } from '../api/nodeService';
import { agentService } from '../api';

interface UseChatKnowledgeProps {
    conversationId?: string;
}

interface UseChatKnowledgeResult {
    messages: MessageResponse[];
    relatedNodes: NodeResponse[];
    isLoadingMessages: boolean;
    isLoadingNodes: boolean;
    sendMessage: (content: string) => Promise<MessageResponse>;
    createNodeFromMessage: (messageId: string, title: string, content: string) => Promise<NodeResponse>;
    findRelatedNodesForMessage: (messageId: string) => NodeResponse[];
    processMessageWithAgents: (messageId: string) => Promise<void>;
}

/**
 * A hook that integrates chat and knowledge functionality
 */
export const useChatKnowledge = ({ conversationId }: UseChatKnowledgeProps = {}): UseChatKnowledgeResult => {
    const {
        messages,
        currentConversation,
        isLoading: isLoadingMessages,
        sendMessage,
    } = useConversationStore();

    const {
        nodes,
        isLoading: isLoadingNodes,
        fetchNodes,
        createNode,
    } = useKnowledgeStore();

    const [relatedNodes, setRelatedNodes] = useState<NodeResponse[]>([]);

    // Fetch nodes when the component mounts
    useEffect(() => {
        fetchNodes();
    }, [fetchNodes]);

    // Update related nodes when messages or nodes change
    useEffect(() => {
        if (messages.length > 0 && nodes.length > 0) {
            // Find nodes that are related to the current conversation
            const conversationNodes = nodes.filter(
                node => node.metadata?.conversationId === currentConversation?.id
            );

            setRelatedNodes(conversationNodes);
        } else {
            setRelatedNodes([]);
        }
    }, [messages, nodes, currentConversation]);

    // Create a node from a message
    const createNodeFromMessage = useCallback(
        async (messageId: string, title: string, content: string): Promise<NodeResponse> => {
            const message = messages.find(m => m.id === messageId);

            if (!message) {
                throw new Error('Message not found');
            }

            try {
                const newNode = await createNode({
                    title,
                    content,
                    metadata: {
                        sourceMessageId: messageId,
                        conversationId: currentConversation?.id,
                        createdAt: new Date().toISOString(),
                    },
                });

                return newNode;
            } catch (error) {
                console.error('Failed to create node from message:', error);
                throw error;
            }
        },
        [messages, createNode, currentConversation]
    );

    // Find nodes related to a specific message
    const findRelatedNodesForMessage = useCallback(
        (messageId: string): NodeResponse[] => {
            return nodes.filter(node => node.metadata?.sourceMessageId === messageId);
        },
        [nodes]
    );

    // Process a message with agents
    const processMessageWithAgents = useCallback(
        async (messageId: string): Promise<void> => {
            try {
                await agentService.processMessage(messageId);

                // Refresh agent actions after processing
                if (currentConversation?.id) {
                    await useConversationStore.getState().fetchAgentActions(currentConversation.id);
                }
            } catch (error) {
                console.error('Failed to process message with agents:', error);
            }
        },
        [currentConversation]
    );

    // Automatically process new user messages with agents
    useEffect(() => {
        const processLatestMessage = async () => {
            if (messages.length > 0) {
                const latestMessage = messages[messages.length - 1];

                // Only process user messages
                if (latestMessage.role === 'user') {
                    await processMessageWithAgents(latestMessage.id);
                }
            }
        };

        processLatestMessage();
    }, [messages, processMessageWithAgents]);

    return {
        messages,
        relatedNodes,
        isLoadingMessages,
        isLoadingNodes,
        sendMessage,
        createNodeFromMessage,
        findRelatedNodesForMessage,
        processMessageWithAgents,
    };
};