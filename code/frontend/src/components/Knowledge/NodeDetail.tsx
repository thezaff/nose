import React, { useState } from 'react';
import { NodeResponse } from '../../api/nodeService';
import { SuperTagResponse } from '../../api/superTagService';
import './Knowledge.css';

interface NodeDetailProps {
    node: NodeResponse | null;
    superTags: SuperTagResponse[];
    relatedNodes: NodeResponse[];
    onClose: () => void;
    onUpdate: (nodeId: string, data: { title?: string; content?: string }) => void;
    onApplySuperTag: (nodeId: string, superTagId: string) => void;
    onRemoveSuperTag: (nodeId: string, superTagId: string) => void;
    onNodeClick: (nodeId: string) => void;
}

const NodeDetail: React.FC<NodeDetailProps> = ({
    node,
    superTags,
    relatedNodes,
    onClose,
    onUpdate,
    onApplySuperTag,
    onRemoveSuperTag,
    onNodeClick,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showSuperTagSelector, setShowSuperTagSelector] = useState(false);

    // Initialize form when node changes
    React.useEffect(() => {
        if (node) {
            setTitle(node.title);
            setContent(node.content);
        }
    }, [node]);

    if (!node) {
        return null;
    }

    const handleSave = () => {
        if (node) {
            onUpdate(node.id, { title, content });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (node) {
            setTitle(node.title);
            setContent(node.content);
            setIsEditing(false);
        }
    };

    // Get node's supertags from metadata
    const getNodeSuperTags = (): { id: string; name: string }[] => {
        if (node?.metadata?.superTags) {
            return node.metadata.superTags;
        }
        return [];
    };

    // Format date for display
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="knowledge-detail-panel">
            <div className="node-detail-header">
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="node-detail-title-input"
                    />
                ) : (
                    <div className="node-detail-title">{node.title}</div>
                )}
                <div className="node-detail-meta">
                    Created: {formatDate(node.createdAt)}
                    <br />
                    Updated: {formatDate(node.updatedAt)}
                </div>
            </div>

            <div className="node-detail-tags">
                {getNodeSuperTags().map((tag) => (
                    <div key={tag.id} className="node-tag">
                        {tag.name}
                        <button
                            className="node-tag-remove"
                            onClick={() => onRemoveSuperTag(node.id, tag.id)}
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    className="node-tag-add"
                    onClick={() => setShowSuperTagSelector(!showSuperTagSelector)}
                >
                    + Add Tag
                </button>
            </div>

            {showSuperTagSelector && (
                <div className="supertag-selector">
                    <div className="supertag-selector-title">Select a SuperTag</div>
                    <div className="supertag-list">
                        {superTags
                            .filter(
                                (tag) =>
                                    !getNodeSuperTags().some((nodeTag) => nodeTag.id === tag.id)
                            )
                            .map((tag) => (
                                <div
                                    key={tag.id}
                                    className="supertag-item"
                                    onClick={() => {
                                        onApplySuperTag(node.id, tag.id);
                                        setShowSuperTagSelector(false);
                                    }}
                                >
                                    {tag.name}
                                </div>
                            ))}
                    </div>
                </div>
            )}

            <div className="node-detail-content">
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="node-detail-content-input"
                        rows={10}
                    />
                ) : (
                    <div>{node.content}</div>
                )}
            </div>

            <div className="node-detail-actions">
                {isEditing ? (
                    <>
                        <button className="btn-save" onClick={handleSave}>
                            Save
                        </button>
                        <button className="btn-cancel" onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>
                        Edit
                    </button>
                )}
            </div>

            {relatedNodes.length > 0 && (
                <div className="node-detail-links">
                    <h3>Related Nodes</h3>
                    {relatedNodes.map((relatedNode) => (
                        <div
                            key={relatedNode.id}
                            className="node-link-item"
                            onClick={() => onNodeClick(relatedNode.id)}
                        >
                            <div className="node-link-title">{relatedNode.title}</div>
                            <div className="node-link-type">
                                {relatedNode.metadata?.linkType || 'Related'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="btn-close" onClick={onClose}>
                Close
            </button>
        </div>
    );
};

export default NodeDetail;