import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLayoutStore, useNavigationStore, useKnowledgeStore } from '../../store';

const ContextPanel: React.FC = () => {
    const { toggleContextPanel } = useLayoutStore();
    const { currentItemId, items } = useNavigationStore();

    // Get the current item if it exists
    const currentItem = currentItemId ? items[currentItemId] : null;

    return (
        <div className="context-panel h-full flex flex-col dark:bg-dark-surface light:bg-light-surface dark:text-dark-text light:text-light-text">
            {/* Header */}
            <div className="context-panel-header p-4 border-b dark:border-gray-700 light:border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Context</h2>
                    <button
                        onClick={toggleContextPanel}
                        className="p-1 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="context-panel-content flex-1 overflow-auto p-4">
                {currentItem ? (
                    <div>
                        <div className="mb-4">
                            <h3 className="text-sm uppercase opacity-70 mb-1">Details</h3>
                            <div className="bg-dark-background dark:bg-dark-background light:bg-light-background p-3 rounded-md">
                                <div className="mb-2">
                                    <span className="text-xs opacity-70">Type:</span>
                                    <span className="ml-2 text-sm capitalize">{currentItem.type}</span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-xs opacity-70">Created:</span>
                                    <span className="ml-2 text-sm">
                                        {new Date(currentItem.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-xs opacity-70">Updated:</span>
                                    <span className="ml-2 text-sm">
                                        {new Date(currentItem.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Related Items Section */}
                        <div className="mb-4">
                            <h3 className="text-sm uppercase opacity-70 mb-1">Related Items</h3>
                            <div className="bg-dark-background dark:bg-dark-background light:bg-light-background p-3 rounded-md">
                                <p className="text-sm italic opacity-70">No related items found.</p>
                                {/* This will be populated with actual related items in future phases */}
                            </div>
                        </div>

                        {/* Agent Suggestions Section */}
                        <div>
                            <h3 className="text-sm uppercase opacity-70 mb-1">Agent Suggestions</h3>
                            <div className="bg-dark-background dark:bg-dark-background light:bg-light-background p-3 rounded-md">
                                <p className="text-sm italic opacity-70">No suggestions available.</p>
                                {/* This will be populated with agent suggestions in future phases */}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-70">
                        <p className="text-sm">Select an item to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContextPanel;