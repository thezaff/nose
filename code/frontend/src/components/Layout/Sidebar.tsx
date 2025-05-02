import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderIcon,
    DocumentIcon,
    HomeIcon,
    ChatBubbleLeftRightIcon,
    PlusIcon,
    Cog6ToothIcon,
    MoonIcon,
    SunIcon
} from '@heroicons/react/24/outline';
import { useNavigationStore, useThemeStore } from '../../store';
import NavigationTree from './NavigationTree';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { mode: themeMode, toggleTheme } = useThemeStore();
    const {
        addItem,
        setCurrentItem,
        getRootItems
    } = useNavigationStore();

    const [isCreatingItem, setIsCreatingItem] = useState(false);
    const [newItemType, setNewItemType] = useState<'folder' | 'page'>('folder');
    const [newItemName, setNewItemName] = useState('');

    // Handle navigation to main sections
    const navigateTo = (path: string) => {
        navigate(path);
    };

    // Handle creating a new item
    const handleCreateItem = () => {
        setIsCreatingItem(true);
    };

    // Handle saving a new item
    const handleSaveNewItem = () => {
        if (newItemName.trim()) {
            const id = addItem({
                id: crypto.randomUUID(),
                type: newItemType,
                name: newItemName,
                parentId: null,
                children: newItemType === 'folder' ? [] : undefined,
            });

            setCurrentItem(id);

            // Navigate to the new item
            navigate(newItemType === 'folder' ? `/folders/${id}` : `/pages/${id}`);

            // Reset form
            setNewItemName('');
            setIsCreatingItem(false);
        }
    };

    // Handle canceling item creation
    const handleCancelCreate = () => {
        setNewItemName('');
        setIsCreatingItem(false);
    };

    return (
        <div className="sidebar h-full flex flex-col dark:bg-dark-surface light:bg-light-surface dark:text-dark-text light:text-light-text">
            {/* Header */}
            <div className="sidebar-header p-4 border-b dark:border-gray-700 light:border-gray-200">
                <h1 className="text-xl font-semibold text-accent-primary">AI PKM</h1>
            </div>

            {/* Main Navigation */}
            <div className="sidebar-nav p-2">
                <ul className="space-y-1">
                    <li>
                        <button
                            onClick={() => navigateTo('/')}
                            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                        >
                            <HomeIcon className="w-5 h-5" />
                            <span>Home</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => navigateTo('/chat')}
                            className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                        >
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            <span>Chat</span>
                        </button>
                    </li>
                </ul>
            </div>

            {/* Folder/Page Structure */}
            <div className="sidebar-content flex-1 overflow-y-auto p-2">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-medium uppercase opacity-70">Workspace</h2>
                    <button
                        onClick={handleCreateItem}
                        className="p-1 rounded-md hover:bg-opacity-10 hover:bg-accent-primary text-accent-primary"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* New Item Form */}
                {isCreatingItem && (
                    <div className="mb-3 p-2 bg-opacity-10 bg-accent-primary rounded-md">
                        <div className="flex gap-2 mb-2">
                            <button
                                onClick={() => setNewItemType('folder')}
                                className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'folder' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                    }`}
                            >
                                <FolderIcon className="w-4 h-4" />
                                <span className="text-sm">Folder</span>
                            </button>
                            <button
                                onClick={() => setNewItemType('page')}
                                className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'page' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                    }`}
                            >
                                <DocumentIcon className="w-4 h-4" />
                                <span className="text-sm">Page</span>
                            </button>
                        </div>
                        <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder={`New ${newItemType} name...`}
                            className="w-full p-2 mb-2 rounded-md bg-dark-background dark:bg-dark-background light:bg-light-background border dark:border-gray-700 light:border-gray-300 text-sm"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancelCreate}
                                className="px-2 py-1 text-xs rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveNewItem}
                                className="px-2 py-1 text-xs rounded-md bg-accent-primary text-white"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                )}

                {/* Navigation Tree */}
                <NavigationTree items={getRootItems()} />
            </div>

            {/* Footer */}
            <div className="sidebar-footer p-4 border-t dark:border-gray-700 light:border-gray-200">
                <div className="flex justify-between">
                    <button
                        onClick={() => navigateTo('/settings')}
                        className="p-2 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                    >
                        <Cog6ToothIcon className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                    >
                        {themeMode === 'dark' ? (
                            <SunIcon className="w-5 h-5" />
                        ) : (
                            <MoonIcon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;