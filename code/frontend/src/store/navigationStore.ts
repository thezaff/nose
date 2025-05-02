import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for navigation
export type NavigationItemType = 'folder' | 'page';

export interface NavigationItem {
    id: string;
    type: NavigationItemType;
    name: string;
    parentId: string | null;
    children?: string[]; // IDs of child items (for folders)
    content?: string;    // Content for pages
    createdAt: string;
    updatedAt: string;
}

export interface NavigationState {
    // Items
    items: Record<string, NavigationItem>;
    addItem: (item: Omit<NavigationItem, 'createdAt' | 'updatedAt'>) => string;
    updateItem: (id: string, updates: Partial<Omit<NavigationItem, 'id' | 'createdAt' | 'updatedAt'>>) => void;
    removeItem: (id: string) => void;

    // Current location
    currentItemId: string | null;
    setCurrentItem: (id: string | null) => void;

    // Navigation history
    history: string[];
    addToHistory: (id: string) => void;
    goBack: () => string | null;
    goForward: () => string | null;
    historyIndex: number;

    // Recent items
    recentItems: string[];
    addToRecentItems: (id: string) => void;

    // Utility functions
    getItemPath: (id: string) => NavigationItem[];
    getItemChildren: (id: string | null) => NavigationItem[];
    getRootItems: () => NavigationItem[];
}

// Create the navigation store
export const useNavigationStore = create<NavigationState>()(
    persist(
        (set, get) => ({
            // Items
            items: {},
            addItem: (item) => {
                const id = item.id || crypto.randomUUID();
                const now = new Date().toISOString();

                set((state) => {
                    // Create new item
                    const newItem: NavigationItem = {
                        ...item,
                        id,
                        createdAt: now,
                        updatedAt: now,
                    };

                    // Update parent's children if parent exists
                    const updatedItems = { ...state.items, [id]: newItem };

                    if (item.parentId && updatedItems[item.parentId]) {
                        const parent = updatedItems[item.parentId];
                        updatedItems[item.parentId] = {
                            ...parent,
                            children: [...(parent.children || []), id],
                            updatedAt: now,
                        };
                    }

                    return { items: updatedItems };
                });

                return id;
            },
            updateItem: (id, updates) => {
                set((state) => {
                    if (!state.items[id]) return state;

                    const now = new Date().toISOString();

                    // Handle parent change
                    const oldParentId = state.items[id].parentId;
                    const newParentId = updates.parentId !== undefined ? updates.parentId : oldParentId;

                    const updatedItems = { ...state.items };

                    // Update the item
                    updatedItems[id] = {
                        ...updatedItems[id],
                        ...updates,
                        updatedAt: now,
                    };

                    // Handle parent changes if needed
                    if (newParentId !== oldParentId) {
                        // Remove from old parent's children
                        if (oldParentId && updatedItems[oldParentId]) {
                            updatedItems[oldParentId] = {
                                ...updatedItems[oldParentId],
                                children: (updatedItems[oldParentId].children || []).filter(
                                    (childId) => childId !== id
                                ),
                                updatedAt: now,
                            };
                        }

                        // Add to new parent's children
                        if (newParentId && updatedItems[newParentId]) {
                            updatedItems[newParentId] = {
                                ...updatedItems[newParentId],
                                children: [...(updatedItems[newParentId].children || []), id],
                                updatedAt: now,
                            };
                        }
                    }

                    return { items: updatedItems };
                });
            },
            removeItem: (id) => {
                set((state) => {
                    if (!state.items[id]) return state;

                    const now = new Date().toISOString();
                    const updatedItems = { ...state.items };

                    // Get the item to be removed
                    const itemToRemove = updatedItems[id];

                    // Remove from parent's children
                    if (itemToRemove.parentId && updatedItems[itemToRemove.parentId]) {
                        updatedItems[itemToRemove.parentId] = {
                            ...updatedItems[itemToRemove.parentId],
                            children: (updatedItems[itemToRemove.parentId].children || []).filter(
                                (childId) => childId !== id
                            ),
                            updatedAt: now,
                        };
                    }

                    // Remove the item and its children recursively
                    const removeItemAndChildren = (itemId: string) => {
                        const item = updatedItems[itemId];
                        if (!item) return;

                        // Recursively remove children
                        if (item.children && item.children.length > 0) {
                            item.children.forEach(removeItemAndChildren);
                        }

                        // Remove the item
                        delete updatedItems[itemId];
                    };

                    removeItemAndChildren(id);

                    // Update current item if it was removed
                    let currentItemId = state.currentItemId;
                    if (currentItemId === id || !updatedItems[currentItemId!]) {
                        currentItemId = null;
                    }

                    // Update history and recent items
                    const history = state.history.filter((historyId) => updatedItems[historyId]);
                    const recentItems = state.recentItems.filter((recentId) => updatedItems[recentId]);

                    return {
                        items: updatedItems,
                        currentItemId,
                        history,
                        recentItems,
                    };
                });
            },

            // Current location
            currentItemId: null,
            setCurrentItem: (id) => {
                set({ currentItemId: id });
                if (id) {
                    get().addToHistory(id);
                    get().addToRecentItems(id);
                }
            },

            // Navigation history
            history: [],
            historyIndex: -1,
            addToHistory: (id) => {
                set((state) => {
                    // Don't add if it's the same as current
                    if (state.historyIndex >= 0 && state.history[state.historyIndex] === id) {
                        return state;
                    }

                    // Remove future history if we're not at the end
                    const newHistory = state.history.slice(0, state.historyIndex + 1);
                    newHistory.push(id);

                    return {
                        history: newHistory,
                        historyIndex: newHistory.length - 1,
                    };
                });
            },
            goBack: () => {
                let newItemId = null;

                set((state) => {
                    if (state.historyIndex <= 0) return state;

                    const newIndex = state.historyIndex - 1;
                    newItemId = state.history[newIndex];

                    return {
                        historyIndex: newIndex,
                        currentItemId: newItemId,
                    };
                });

                return newItemId;
            },
            goForward: () => {
                let newItemId = null;

                set((state) => {
                    if (state.historyIndex >= state.history.length - 1) return state;

                    const newIndex = state.historyIndex + 1;
                    newItemId = state.history[newIndex];

                    return {
                        historyIndex: newIndex,
                        currentItemId: newItemId,
                    };
                });

                return newItemId;
            },

            // Recent items
            recentItems: [],
            addToRecentItems: (id) => {
                set((state) => {
                    // Remove if already exists
                    const filteredRecent = state.recentItems.filter((itemId) => itemId !== id);

                    // Add to the beginning
                    return {
                        recentItems: [id, ...filteredRecent].slice(0, 10), // Keep only 10 most recent
                    };
                });
            },

            // Utility functions
            getItemPath: (id) => {
                const state = get();
                const path: NavigationItem[] = [];

                let currentId: string | null = id;
                while (currentId && state.items[currentId]) {
                    path.unshift(state.items[currentId]);
                    currentId = state.items[currentId].parentId;
                }

                return path;
            },
            getItemChildren: (id) => {
                const state = get();
                const parent = id ? state.items[id] : null;

                if (parent && parent.children) {
                    return parent.children
                        .map((childId) => state.items[childId])
                        .filter(Boolean)
                        .sort((a, b) => {
                            // Sort folders before pages
                            if (a.type !== b.type) {
                                return a.type === 'folder' ? -1 : 1;
                            }
                            // Then sort by name
                            return a.name.localeCompare(b.name);
                        });
                }

                // If no parent or no children, return root items
                if (!id) {
                    return state.getRootItems();
                }

                return [];
            },
            getRootItems: () => {
                const state = get();
                return Object.values(state.items)
                    .filter((item) => !item.parentId)
                    .sort((a, b) => {
                        // Sort folders before pages
                        if (a.type !== b.type) {
                            return a.type === 'folder' ? -1 : 1;
                        }
                        // Then sort by name
                        return a.name.localeCompare(b.name);
                    });
            },
        }),
        {
            name: 'ai-pkm-navigation',
        }
    )
);