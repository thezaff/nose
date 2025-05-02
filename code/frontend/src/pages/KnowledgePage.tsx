import React, { useEffect, useState } from 'react';
import { KnowledgePanel } from '../components/Knowledge';
import { useKnowledgeStore } from '../store';
import { NodeRequest } from '../api/nodeService';
import './KnowledgePage.css';

const KnowledgePage: React.FC = () => {
    const {
        nodes,
        links,
        superTags,
        isLoading,
        error,
        fetchNodes,
        fetchLinks,
        fetchSuperTags,
        updateNode,
        createNode,
        applySuperTag,
        removeSuperTag,
    } = useKnowledgeStore();

    const [isCreatingNode, setIsCreatingNode] = useState(false);
    const [newNodeData, setNewNodeData] = useState<NodeRequest>({
        title: '',
        content: '',
    });

    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
            await fetchNodes();
            await fetchLinks();
            await fetchSuperTags();
        };

        loadData();
    }, [fetchNodes, fetchLinks, fetchSuperTags]);

    // Handle node update
    const handleUpdateNode = async (
        nodeId: string,
        data: { title?: string; content?: string }
    ) => {
        try {
            await updateNode(nodeId, data);
        } catch (error) {
            console.error('Failed to update node:', error);
        }
    };

    // Handle creating a new node
    const handleCreateNode = async () => {
        setIsCreatingNode(true);
    };

    // Handle submitting a new node
    const handleSubmitNewNode = async () => {
        try {
            await createNode(newNodeData);
            setIsCreatingNode(false);
            setNewNodeData({ title: '', content: '' });
        } catch (error) {
            console.error('Failed to create node:', error);
        }
    };

    // Handle canceling node creation
    const handleCancelNewNode = () => {
        setIsCreatingNode(false);
        setNewNodeData({ title: '', content: '' });
    };

    // Handle applying a supertag to a node
    const handleApplySuperTag = async (nodeId: string, superTagId: string) => {
        try {
            await applySuperTag(nodeId, superTagId);
        } catch (error) {
            console.error('Failed to apply supertag:', error);
        }
    };

    // Handle removing a supertag from a node
    const handleRemoveSuperTag = async (nodeId: string, superTagId: string) => {
        try {
            await removeSuperTag(nodeId, superTagId);
        } catch (error) {
            console.error('Failed to remove supertag:', error);
        }
    };

    return (
        <div className="knowledge-page">
            <h1 className="page-title">Knowledge Graph</h1>

            {error && <div className="error-message">{error}</div>}

            {isLoading && <div className="loading-indicator">Loading...</div>}

            {isCreatingNode ? (
                <div className="create-node-form">
                    <h2>Create New Node</h2>
                    <div className="form-group">
                        <label htmlFor="node-title">Title</label>
                        <input
                            id="node-title"
                            type="text"
                            value={newNodeData.title}
                            onChange={(e) =>
                                setNewNodeData({ ...newNodeData, title: e.target.value })
                            }
                            placeholder="Enter node title"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="node-content">Content</label>
                        <textarea
                            id="node-content"
                            value={newNodeData.content}
                            onChange={(e) =>
                                setNewNodeData({ ...newNodeData, content: e.target.value })
                            }
                            placeholder="Enter node content"
                            rows={5}
                        />
                    </div>
                    <div className="form-actions">
                        <button
                            className="btn-submit"
                            onClick={handleSubmitNewNode}
                            disabled={!newNodeData.title.trim()}
                        >
                            Create
                        </button>
                        <button className="btn-cancel" onClick={handleCancelNewNode}>
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <KnowledgePanel
                    nodes={nodes}
                    links={links}
                    superTags={superTags}
                    onUpdateNode={handleUpdateNode}
                    onApplySuperTag={handleApplySuperTag}
                    onRemoveSuperTag={handleRemoveSuperTag}
                    onCreateNode={handleCreateNode}
                />
            )}
        </div>
    );
};

export default KnowledgePage;