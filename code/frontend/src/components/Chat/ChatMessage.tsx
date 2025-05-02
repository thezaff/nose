import React from 'react';
import { MessageResponse } from '../../api';

interface ChatMessageProps {
    message: MessageResponse;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`chat-message ${isUser ? 'user-message' : 'agent-message'}`}>
            <div className="message-header">
                <span className="message-role">{isUser ? 'You' : 'AI'}</span>
                <span className="message-time">
                    {new Date(message.createdAt).toLocaleTimeString()}
                </span>
            </div>
            <div className="message-content">
                {message.content}
            </div>
            {message.nodeReferences && message.nodeReferences.length > 0 && (
                <div className="message-references">
                    <span>References: </span>
                    {message.nodeReferences.map((nodeId, index) => (
                        <span key={nodeId} className="node-reference">
                            {index > 0 && ', '}
                            {nodeId}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ChatMessage;