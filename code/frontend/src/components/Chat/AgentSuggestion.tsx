import React from 'react';
import { AgentActionResponse } from '../../api/conversationService';

interface AgentSuggestionProps {
    action: AgentActionResponse;
    onApprove: () => void;
    onReject: () => void;
}

const AgentSuggestion: React.FC<AgentSuggestionProps> = ({
    action,
    onApprove,
    onReject,
}) => {
    // Format the suggestion based on action type
    const formatSuggestion = () => {
        const { type, payload } = action;

        switch (type) {
            case 'CREATE_CONNECTION':
                return `Create a connection between "${payload.sourceNodeTitle}" and "${payload.targetNodeTitle}"`;

            case 'APPLY_SUPERTAG':
                return `Apply the "${payload.superTagName}" tag to "${payload.nodeTitle}"`;

            case 'ORGANIZE_NODES':
                return `Organize ${payload.nodeCount} nodes into ${payload.categoryCount} categories`;

            case 'EXTRACT_ENTITY':
                return `Extract "${payload.entityName}" as a ${payload.entityType}`;

            default:
                return JSON.stringify(payload);
        }
    };

    return (
        <div className="agent-suggestion">
            <div className="suggestion-content">
                <div className="suggestion-type">{action.type}</div>
                <div className="suggestion-description">{formatSuggestion()}</div>
            </div>
            <div className="suggestion-actions">
                <button
                    className="approve-button"
                    onClick={onApprove}
                >
                    Approve
                </button>
                <button
                    className="reject-button"
                    onClick={onReject}
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default AgentSuggestion;