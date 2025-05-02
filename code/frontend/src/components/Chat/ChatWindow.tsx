import React, { useEffect, useRef } from 'react';
import { MessageResponse } from '../../api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import AgentSuggestion from './AgentSuggestion';
import { AgentActionResponse } from '../../api';

interface ChatWindowProps {
    messages: MessageResponse[];
    agentActions?: AgentActionResponse[];
    isLoading?: boolean;
    onSendMessage: (content: string) => void;
    onApproveAction?: (actionId: string) => void;
    onRejectAction?: (actionId: string) => void;
    onCreateNodeFromMessage?: (messageId: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
    messages,
    agentActions = [],
    isLoading = false,
    onSendMessage,
    onApproveAction,
    onRejectAction,
    onCreateNodeFromMessage,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Filter pending agent actions
    const pendingActions = agentActions.filter(
        (action) => !action.approved && action.status === 'pending'
    );

    return (
        <div className="chat-window">
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <div className="empty-chat">
                        <p>No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className="message-container">
                            <ChatMessage message={message} />
                            {onCreateNodeFromMessage && message.role === 'user' && (
                                <button
                                    className="create-node-btn"
                                    onClick={() => onCreateNodeFromMessage(message.id)}
                                    title="Create knowledge node from this message"
                                >
                                    📝
                                </button>
                            )}
                        </div>
                    ))
                )}

                {/* Display pending agent actions/suggestions */}
                {pendingActions.length > 0 && (
                    <div className="agent-suggestions">
                        <h3>Agent Suggestions</h3>
                        {pendingActions.map((action) => (
                            <AgentSuggestion
                                key={action.id}
                                action={action}
                                onApprove={() => onApproveAction?.(action.id)}
                                onReject={() => onRejectAction?.(action.id)}
                            />
                        ))}
                    </div>
                )}

                {isLoading && (
                    <div className="typing-indicator">
                        <span>AI is thinking</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                        <span className="dot">.</span>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
        </div>
    );
};

export default ChatWindow;