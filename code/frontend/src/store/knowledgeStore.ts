import { create } from 'zustand';
import nodeService, {
    NodeResponse,
    NodeRequest,
    NodeListParams,
} from '../api/nodeService';
import superTagService, {
    SuperTagResponse,
    SuperTagRequest,
} from '../api/superTagService';

interface Link {
    id: string;
    source: string;
    target: string;
    type: string;
}

interface KnowledgeState {
    nodes: NodeResponse[];
    links: Link[];
    superTags: SuperTagResponse[];
    selectedNodeId: string | null;
    isLoading: boolean;
    error: string | null;

    // Node actions
    fetchNodes: (params?: NodeListParams) => Promise<void>;
    fetchNode: (id: string) => Promise<NodeResponse>;
    createNode: (data: NodeRequest) => Promise<NodeResponse>;
    updateNode: (id: string, data: Partial<NodeRequest>) => Promise<void>;
    deleteNode: (id: string) => Promise<void>;

    // Link actions
    fetchLinks: () => Promise<void>;
    createLink: (sourceNodeId: string, targetNodeId: string, type: string) => Promise<void>;
    deleteLink: (linkId: string) => Promise<void>;

    // SuperTag actions
    fetchSuperTags: () => Promise<void>;
    createSuperTag: (data: SuperTagRequest) => Promise<SuperTagResponse>;
    applySuperTag: (nodeId: string, superTagId: string) => Promise<void>;
    removeSuperTag: (nodeId: string, superTagId: string) => Promise<void>;

    // UI actions
    setSelectedNode: (nodeId: string | null) => void;
}

const useKnowledgeStore = create<KnowledgeState>((set, get) => ({
    nodes: [],
    links: [],
    superTags: [],
    selectedNodeId: null,
    isLoading: false,
    error: null,

    // Node actions
    fetchNodes: async (params = {}) => {
        try {
            set({ isLoading: true, error: null });
            const response = await nodeService.getNodes(params);
            set({
                nodes: response.nodes,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch nodes',
                isLoading: false,
            });
        }
    },

    fetchNode: async (id) => {
        try {
            set({ isLoading: true, error: null });
            const node = await nodeService.getNode(id);

            // Update the node in the nodes array
            set({
                nodes: get().nodes.map(n => n.id === id ? node : n),
                isLoading: false,
            });

            return node;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch node',
                isLoading: false,
            });
            throw error;
        }
    },

    createNode: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const node = await nodeService.createNode(data);

            // Add the new node to the nodes array
            set({
                nodes: [...get().nodes, node],
                isLoading: false,
            });

            return node;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create node',
                isLoading: false,
            });
            throw error;
        }
    },

    updateNode: async (id, data) => {
        try {
            set({ isLoading: true, error: null });
            const updatedNode = await nodeService.updateNode(id, data);

            // Update the node in the nodes array
            set({
                nodes: get().nodes.map(node => node.id === id ? updatedNode : node),
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to update node',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteNode: async (id) => {
        try {
            set({ isLoading: true, error: null });
            await nodeService.deleteNode(id);

            // Remove the node from the nodes array
            set({
                nodes: get().nodes.filter(node => node.id !== id),
                // Also remove any links connected to this node
                links: get().links.filter(link => link.source !== id && link.target !== id),
                isLoading: false,
            });

            // If the deleted node was selected, clear the selection
            if (get().selectedNodeId === id) {
                set({ selectedNodeId: null });
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete node',
                isLoading: false,
            });
            throw error;
        }
    },

    // Link actions
    fetchLinks: async () => {
        try {
            set({ isLoading: true, error: null });

            // This is a placeholder - the actual implementation would depend on your API
            // For now, we'll assume links are included in node metadata or fetched separately

            // Mock implementation - in a real app, replace with actual API call
            const links: Link[] = [];
            const nodes = get().nodes;

            // Example: Extract links from node metadata
            nodes.forEach(node => {
                if (node.metadata?.links) {
                    (node.metadata.links as any[]).forEach(link => {
                        links.push({
                            id: link.id,
                            source: link.sourceId,
                            target: link.targetId,
                            type: link.type,
                        });
                    });
                }
            });

            set({ links, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch links',
                isLoading: false,
            });
        }
    },

    createLink: async (sourceNodeId, targetNodeId, type) => {
        try {
            set({ isLoading: true, error: null });
            const response = await nodeService.createLink(sourceNodeId, targetNodeId, type);

            // Add the new link to the links array
            const newLink: Link = {
                id: response.id,
                source: sourceNodeId,
                target: targetNodeId,
                type,
            };

            set({
                links: [...get().links, newLink],
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create link',
                isLoading: false,
            });
            throw error;
        }
    },

    deleteLink: async (linkId) => {
        try {
            set({ isLoading: true, error: null });
            await nodeService.deleteLink(linkId);

            // Remove the link from the links array
            set({
                links: get().links.filter(link => link.id !== linkId),
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to delete link',
                isLoading: false,
            });
            throw error;
        }
    },

    // SuperTag actions
    fetchSuperTags: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await superTagService.getSuperTags();
            set({
                superTags: response.superTags,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch supertags',
                isLoading: false,
            });
        }
    },

    createSuperTag: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const superTag = await superTagService.createSuperTag(data);

            // Add the new supertag to the supertags array
            set({
                superTags: [...get().superTags, superTag],
                isLoading: false,
            });

            return superTag;
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to create supertag',
                isLoading: false,
            });
            throw error;
        }
    },

    applySuperTag: async (nodeId, superTagId) => {
        try {
            set({ isLoading: true, error: null });
            const updatedNode = await nodeService.applySupertag(nodeId, superTagId);

            // Update the node in the nodes array
            set({
                nodes: get().nodes.map(node => node.id === nodeId ? updatedNode : node),
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to apply supertag',
                isLoading: false,
            });
            throw error;
        }
    },

    removeSuperTag: async (nodeId, superTagId) => {
        try {
            set({ isLoading: true, error: null });
            const updatedNode = await nodeService.removeSupertag(nodeId, superTagId);

            // Update the node in the nodes array
            set({
                nodes: get().nodes.map(node => node.id === nodeId ? updatedNode : node),
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to remove supertag',
                isLoading: false,
            });
            throw error;
        }
    },

    // UI actions
    setSelectedNode: (nodeId) => {
        set({ selectedNodeId: nodeId });
    },
}));

export default useKnowledgeStore;