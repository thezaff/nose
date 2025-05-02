import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChatWindow, RelatedNodes } from '../components/Chat';
import { useConversationStore, useKnowledgeStore } from '../store';
import { useChatKnowledge } from '../hooks';
import '../components/Chat/Chat.css';
import './ChatPage.css';

const ChatPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [showNodeCreator, setShowNodeCreator] = useState(false);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [nodeTitle, setNodeTitle] = useState('');
    const [nodeContent, setNodeContent] = useState('');
    const [showAgentSettings, setShowAgentSettings] = useState(false);

    const {
        currentConversation,
        agentActions,
        isLoading,
        fetchConversation,
        createConversation,
        updateConversation,
        approveAgentAction,
        rejectAgentAction,
    } = useConversationStore();

    const { createNode } = useKnowledgeStore();

    // Use the chat knowledge hook
    const {
        messages,
        relatedNodes,
        sendMessage,
        createNodeFromMessage,
        findRelatedNodesForMessage,
        processMessageWithAgents,
    } = useChatKnowledge({ conversationId: id });

    // Load conversation if ID is provided
    useEffect(() => {
        if (id) {
            fetchConversation(id);
        } else {
            // Create a new conversation if no ID is provided
            const createNewConversation = async () => {
                try {
                    const newConversation = await createConversation('New Conversation');
                    navigate(`/chat/${newConversation.id}`);
                } catch (error) {
                    console.error('Failed to create conversation:', error);
                }
            };

            createNewConversation();
        }
    }, [id, fetchConversation, createConversation, navigate]);

    // Update title state when conversation changes
    useEffect(() => {
        if (currentConversation) {
            setTitle(currentConversation.title);
        }
    }, [currentConversation]);

    // Handle title change
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // Handle title save
    const handleTitleSave = () => {
        if (currentConversation && title !== currentConversation.title) {
            updateConversation(currentConversation.id, title);
        }
    };

    // Handle send message
    const handleSendMessage = async (content: string) => {
        if (currentConversation) {
            try {
                await sendMessage(content);
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    // Handle approve action
    const handleApproveAction = async (actionId: string) => {
        try {
            await approveAgentAction(actionId);
        } catch (error) {
            console.error('Failed to approve action:', error);
        }
    };

    // Handle reject action
    const handleRejectAction = async (actionId: string) => {
        try {
            await rejectAgentAction(actionId);
        } catch (error) {
            console.error('Failed to reject action:', error);
        }
    };

    // Handle creating a node from a message
    const handleCreateNodeFromMessage = (messageId: string) => {
        const message = messages.find(m => m.id === messageId);
        if (message) {
            setSelectedMessageId(messageId);
            setNodeTitle(message.content.substring(0, 50) + (message.content.length > 50 ? '...' : ''));
            setNodeContent(message.content);
            setShowNodeCreator(true);
        }
    };

    // Handle saving a new node
    const handleSaveNode = async () => {
        try {
            if (!selectedMessageId) return;

            const newNode = await createNodeFromMessage(
                selectedMessageId,
                nodeTitle,
                nodeContent
            );

            // Reset the form
            setShowNodeCreator(false);
            setSelectedMessageId(null);
            setNodeTitle('');
            setNodeContent('');

            // Show success message or notification
            alert(`Node "${newNode.title}" created successfully!`);
        } catch (error) {
            console.error('Failed to create node:', error);
        }
    };

    // Handle navigating to a node in the knowledge graph
    const handleNodeClick = (nodeId: string) => {
        navigate(`/knowledge?nodeId=${nodeId}`);
    };

    return (
        <div className="chat-page">
            <div className="chat-header">
                <input
                    type="text"
                    className="conversation-title"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={handleTitleSave}
                    placeholder="Conversation Title"
                />
                <div className="chat-actions">
                    <button
                        className="btn-create-node"
                        onClick={() => {
                            if (messages.length > 0) {
                                handleCreateNodeFromMessage(messages[messages.length - 1].id);
                            }
                        }}
                        disabled={messages.length === 0}
                    >
                        Create Node from Last Message
                    </button>
                    <button
                        className="btn-agent-settings"
                        onClick={() => setShowAgentSettings(!showAgentSettings)}
                    >
                        Agent Settings
                    </button>
                    {messages.length > 0 && (
                        <button
                            className="btn-process-agents"
                            onClick={() => {
                                const lastMessage = messages[messages.length - 1];
                                processMessageWithAgents(lastMessage.id);
                            }}
                        >
                            Process with Agents
                        </button>
                    )}
                </div>
            </div>

            {showNodeCreator && (
                <div className="node-creator-overlay">
                    <div className="node-creator-modal">
                        <h2>Create Knowledge Node</h2>
                        <div className="form-group">
                            <label htmlFor="node-title">Title</label>
                            <input
                                id="node-title"
                                type="text"
                                value={nodeTitle}
                                onChange={(e) => setNodeTitle(e.target.value)}
                                placeholder="Enter node title"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="node-content">Content</label>
                            <textarea
                                id="node-content"
                                value={nodeContent}
                                onChange={(e) => setNodeContent(e.target.value)}
                                placeholder="Enter node content"
                                rows={8}
                            />
                        </div>
                        <div className="form-actions">
                            <button
                                className="btn-save"
                                onClick={handleSaveNode}
                                disabled={!nodeTitle.trim()}
                            >
                                Save Node
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => {
                                    setShowNodeCreator(false);
                                    setSelectedMessageId(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showAgentSettings && (
                <div className="agent-settings-overlay">
                    <div className="agent-settings-modal">
                        <h2>Agent Settings</h2>
                        <p>Configure how AI agents interact with your knowledge base:</p>

                        <div className="agent-settings-list">
                            <div className="agent-setting">
                                <h3>Organization Agent</h3>
                                <p>Categorizes and tags information, suggests restructuring</p>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable
                                </label>
                            </div>

                            <div className="agent-setting">
                                <h3>Connection Agent</h3>
                                <p>Identifies relationships between information, suggests links</p>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable
                                </label>
                            </div>

                            <div className="agent-setting">
                                <h3>Query Agent</h3>
                                <p>Interprets natural language questions, retrieves and synthesizes information</p>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable
                                </label>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Auto-execute
                                </label>
                            </div>

                            <div className="agent-setting">
                                <h3>Summary Agent</h3>
                                <p>Creates summaries of knowledge areas, identifies insights</p>
                                <label>
                                    <input type="checkbox" defaultChecked />
                                    Enable
                                </label>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                className="btn-save"
                                onClick={() => setShowAgentSettings(false)}
                            >
                                Save Settings
                            </button>
                            <button
                                className="btn-cancel"
                                onClick={() => setShowAgentSettings(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="chat-container">
                <div className="chat-main-content">
                    <ChatWindow
                        messages={messages}
                        agentActions={agentActions}
                        isLoading={isLoading}
                        onSendMessage={handleSendMessage}
                        onApproveAction={handleApproveAction}
                        onRejectAction={handleRejectAction}
                        onCreateNodeFromMessage={handleCreateNodeFromMessage}
                    />
                </div>

                {relatedNodes.length > 0 && (
                    <div className="chat-sidebar">
                        <RelatedNodes
                            nodes={relatedNodes}
                            title="Knowledge from this Conversation"
                            onNodeClick={handleNodeClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;