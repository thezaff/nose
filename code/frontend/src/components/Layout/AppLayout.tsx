import { useEffect } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useLayoutStore, useThemeStore } from '../../store';
import Sidebar from './Sidebar';
import MainPanel from './MainPanel';
import ContextPanel from './ContextPanel';
import { applyTheme } from '../../theme';

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const { panelVisibility, panelSizes, setPanelSizes } = useLayoutStore();
    const { mode: themeMode } = useThemeStore();

    // Apply theme when it changes
    useEffect(() => {
        applyTheme(themeMode);
    }, [themeMode]);

    // Handle panel resize
    const handlePanelResize = (panelName: 'sidebar' | 'mainPanel' | 'contextPanel', size: number) => {
        setPanelSizes({ [panelName]: size });
    };

    return (
        <div className={`app-layout h-screen w-full overflow-hidden ${themeMode}`}>
            <PanelGroup direction="horizontal" className="h-full">
                {/* Sidebar */}
                {panelVisibility.sidebar && (
                    <>
                        <Panel
                            defaultSize={panelSizes.sidebar}
                            minSize={10}
                            maxSize={30}
                            onResize={(size) => handlePanelResize('sidebar', size)}
                            className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface"
                        >
                            <Sidebar />
                        </Panel>
                        <PanelResizeHandle className="w-1 hover:w-1.5 bg-dark-background dark:bg-dark-background light:bg-light-background hover:bg-accent-primary transition-all" />
                    </>
                )}

                {/* Main Panel */}
                <Panel
                    defaultSize={panelSizes.mainPanel}
                    minSize={40}
                    onResize={(size) => handlePanelResize('mainPanel', size)}
                    className="bg-dark-background dark:bg-dark-background light:bg-light-background"
                >
                    <MainPanel>
                        {children}
                    </MainPanel>
                </Panel>

                {/* Context Panel */}
                {panelVisibility.contextPanel && (
                    <>
                        <PanelResizeHandle className="w-1 hover:w-1.5 bg-dark-background dark:bg-dark-background light:bg-light-background hover:bg-accent-primary transition-all" />
                        <Panel
                            defaultSize={panelSizes.contextPanel}
                            minSize={10}
                            maxSize={40}
                            onResize={(size) => handlePanelResize('contextPanel', size)}
                            className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface"
                        >
                            <ContextPanel />
                        </Panel>
                    </>
                )}
            </PanelGroup>
        </div>
    );
};

export default AppLayout;