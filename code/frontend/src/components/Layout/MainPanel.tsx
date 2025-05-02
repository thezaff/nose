import React from 'react';
import { useLayoutStore } from '../../store';

interface MainPanelProps {
    children: React.ReactNode;
}

const MainPanel: React.FC<MainPanelProps> = ({ children }) => {
    const { layoutMode } = useLayoutStore();

    return (
        <div className={`main-panel h-full flex flex-col dark:bg-dark-background light:bg-light-background dark:text-dark-text light:text-light-text`}>
            {/* Header */}
            <div className="main-panel-header p-4 border-b dark:border-gray-700 light:border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                        {layoutMode === 'focus' ? 'Focus Mode' : 'Main Panel'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {/* Additional header controls can be added here */}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="main-panel-content flex-1 overflow-auto p-4">
                {children}
            </div>
        </div>
    );
};

export default MainPanel;