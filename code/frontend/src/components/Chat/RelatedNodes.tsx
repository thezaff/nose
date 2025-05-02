import React from 'react';
import { NodeResponse } from '../../api/nodeService';
import { Link } from 'react-router-dom';

interface RelatedNodesProps {
    nodes: NodeResponse[];
    title?: string;
    onNodeClick?: (nodeId: string) => void;
}

const RelatedNodes: React.FC<RelatedNodesProps> = ({
    nodes,
    title = 'Related Knowledge',
    onNodeClick,
}) => {
    if (nodes.length === 0) {
        return null;
    }

    const handleNodeClick = (nodeId: string) => {
        if (onNodeClick) {
            onNodeClick(nodeId);
        }
    };

    return (
        <div className="related-nodes">
            <h3 className="related-nodes-title">{title}</h3>
            <div className="related-nodes-list">
                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className="related-node-item"
                        onClick={() => handleNodeClick(node.id)}
                    >
                        <div className="related-node-title">{node.title}</div>
                        <div className="related-node-preview">
                            {node.content.length > 100
                                ? `${node.content.substring(0, 100)}...`
                                : node.content}
                        </div>
                        {node.metadata?.superTags && (
                            <div className="related-node-tags">
                                {node.metadata.superTags.map((tag: any) => (
                                    <span key={tag.id} className="related-node-tag">
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="related-nodes-footer">
                <Link to="/knowledge" className="view-all-link">
                    View all in Knowledge Graph
                </Link>
            </div>
        </div>
    );
};

export default RelatedNodes;