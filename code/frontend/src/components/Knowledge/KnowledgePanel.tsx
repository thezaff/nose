import React, { useState, useEffect } from 'react';
import KnowledgeGraph from './KnowledgeGraph';
import NodeDetail from './NodeDetail';
import { NodeResponse } from '../../api/nodeService';
import { SuperTagResponse } from '../../api/superTagService';
import './Knowledge.css';

interface Link {
    id: string;
    source: string;
    target: string;
    type: string;
}

interface KnowledgePanelProps {
    nodes: NodeResponse[];
    links: Link[];
    superTags: SuperTagResponse[];
    onUpdateNode: (nodeId: string, data: { title?: string; content?: string }) => Promise<void>;
    onApplySuperTag: (nodeId: string, superTagId: string) => Promise<void>;
    onRemoveSuperTag: (nodeId: string, superTagId: string) => Promise<void>;
    onCreateNode: () => Promise<void>;
}

const KnowledgePanel: React.FC<KnowledgePanelProps> = ({
    nodes,
    links,
    superTags,
    onUpdateNode,
    onApplySuperTag,
    onRemoveSuperTag,
    onCreateNode,
}) => {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredNodes, setFilteredNodes] = useState<NodeResponse[]>(nodes);
    const [filteredLinks, setFilteredLinks] = useState<Link[]>(links);

    // Update filtered nodes when nodes, links, or search query changes
    useEffect(() => {
        if (!searchQuery) {
            setFilteredNodes(nodes);
            setFilteredLinks(links);
            return;
        }

        const lowerQuery = searchQuery.toLowerCase();
        const matchingNodes = nodes.filter(
            node =>
                node.title.toLowerCase().includes(lowerQuery) ||
                node.content.toLowerCase().includes(lowerQuery)
        );

        // Only include links where both source and target nodes are in the filtered set
        const nodeIds = new Set(matchingNodes.map(node => node.id));
        const relevantLinks = links.filter(
            link => nodeIds.has(link.source) && nodeIds.has(link.target)
        );

        setFilteredNodes(matchingNodes);
        setFilteredLinks(relevantLinks);
    }, [nodes, links, searchQuery]);

    // Get the selected node
    const selectedNode = selectedNodeId
        ? nodes.find(node => node.id === selectedNodeId) || null
        : null;

    // Get related nodes for the selected node
    const getRelatedNodes = (): NodeResponse[] => {
        if (!selectedNodeId) return [];

        // Find all links connected to the selected node
        const connectedLinks = links.filter(
            link => link.source === selectedNodeId || link.target === selectedNodeId
        );

        // Get the IDs of connected nodes
        const connectedNodeIds = connectedLinks.map(link =>
            link.source === selectedNodeId ? link.target : link.source
        );

        // Return the connected nodes with link type information
        return nodes
            .filter(node => connectedNodeIds.includes(node.id))
            .map(node => {
                // Find the link connecting to this node
                const link = connectedLinks.find(
                    l => l.source === node.id || l.target === node.id
                );

                // Add link type to node metadata
                return {
                    ...node,
                    metadata: {
                        ...node.metadata,
                        linkType: link?.type || 'Related'
                    }
                };
            });
    };

    const handleNodeClick = (node: NodeResponse) => {
        setSelectedNodeId(node.id);
    };

    const handleCloseDetail = () => {
        setSelectedNodeId(null);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="knowledge-panel">
            <div className="knowledge-controls">
                <div className="knowledge-view-options">
                    <button className="btn-create-node" onClick={onCreateNode}>
                        Create Node
                    </button>
                </div>

                <div className="knowledge-search">
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            <div className="knowledge-content">
                <div className="knowledge-graph-view">
                    {filteredNodes.length > 0 ? (
                        <KnowledgeGraph
                            nodes={filteredNodes}
                            links={filteredLinks}
                            onNodeClick={handleNodeClick}
                            selectedNodeId={selectedNodeId || undefined}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <div className="empty-state-title">No nodes to display</div>
                            <div className="empty-state-description">
                                {searchQuery
                                    ? "No nodes match your search query. Try a different search term."
                                    : "Start by creating nodes through the chat interface or using the 'Create Node' button."}
                            </div>
                        </div>
                    )}
                </div>

                {selectedNode && (
                    <NodeDetail
                        node={selectedNode}
                        superTags={superTags}
                        relatedNodes={getRelatedNodes()}
                        onClose={handleCloseDetail}
                        onUpdate={onUpdateNode}
                        onApplySuperTag={onApplySuperTag}
                        onRemoveSuperTag={onRemoveSuperTag}
                        onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
                    />
                )}
            </div>
        </div>
    );
};

export default KnowledgePanel;