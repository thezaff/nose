import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PanelVisibility = {
    sidebar: boolean;
    mainPanel: boolean;
    contextPanel: boolean;
};

export type PanelSizes = {
    sidebar: number;
    mainPanel: number;
    contextPanel: number;
};

export type LayoutMode = 'default' | 'focus' | 'split' | 'minimal';

export interface LayoutState {
    // Panel visibility
    panelVisibility: PanelVisibility;
    toggleSidebar: () => void;
    toggleContextPanel: () => void;
    setPanelVisibility: (visibility: Partial<PanelVisibility>) => void;

    // Panel sizes (in percentage)
    panelSizes: PanelSizes;
    setPanelSizes: (sizes: Partial<PanelSizes>) => void;

    // Layout mode
    layoutMode: LayoutMode;
    setLayoutMode: (mode: LayoutMode) => void;

    // Reset to default layout
    resetLayout: () => void;
}

// Default layout configuration
const DEFAULT_PANEL_VISIBILITY: PanelVisibility = {
    sidebar: true,
    mainPanel: true,
    contextPanel: true,
};

const DEFAULT_PANEL_SIZES: PanelSizes = {
    sidebar: 20, // 20% of the screen width
    mainPanel: 60, // 60% of the screen width
    contextPanel: 20, // 20% of the screen width
};

const DEFAULT_LAYOUT_MODE: LayoutMode = 'default';

// Create the layout store
export const useLayoutStore = create<LayoutState>()(
    persist(
        (set) => ({
            // Panel visibility
            panelVisibility: DEFAULT_PANEL_VISIBILITY,
            toggleSidebar: () =>
                set((state) => ({
                    panelVisibility: {
                        ...state.panelVisibility,
                        sidebar: !state.panelVisibility.sidebar,
                    },
                })),
            toggleContextPanel: () =>
                set((state) => ({
                    panelVisibility: {
                        ...state.panelVisibility,
                        contextPanel: !state.panelVisibility.contextPanel,
                    },
                })),
            setPanelVisibility: (visibility) =>
                set((state) => ({
                    panelVisibility: {
                        ...state.panelVisibility,
                        ...visibility,
                    },
                })),

            // Panel sizes
            panelSizes: DEFAULT_PANEL_SIZES,
            setPanelSizes: (sizes) =>
                set((state) => ({
                    panelSizes: {
                        ...state.panelSizes,
                        ...sizes,
                    },
                })),

            // Layout mode
            layoutMode: DEFAULT_LAYOUT_MODE,
            setLayoutMode: (mode) => {
                set({ layoutMode: mode });

                // Apply predefined layouts based on mode
                switch (mode) {
                    case 'focus':
                        set({
                            panelVisibility: {
                                sidebar: false,
                                mainPanel: true,
                                contextPanel: false,
                            },
                        });
                        break;
                    case 'split':
                        set({
                            panelVisibility: {
                                sidebar: true,
                                mainPanel: true,
                                contextPanel: true,
                            },
                        });
                        break;
                    case 'minimal':
                        set({
                            panelVisibility: {
                                sidebar: true,
                                mainPanel: true,
                                contextPanel: false,
                            },
                        });
                        break;
                    default:
                        set({
                            panelVisibility: DEFAULT_PANEL_VISIBILITY,
                        });
                }
            },

            // Reset to default layout
            resetLayout: () => {
                set({
                    panelVisibility: DEFAULT_PANEL_VISIBILITY,
                    panelSizes: DEFAULT_PANEL_SIZES,
                    layoutMode: DEFAULT_LAYOUT_MODE,
                });
            },
        }),
        {
            name: 'ai-pkm-layout',
        }
    )
);