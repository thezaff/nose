import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    FolderIcon,
    DocumentIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useNavigationStore } from '../store';

const FolderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        items,
        getItemChildren,
        setCurrentItem,
        addItem
    } = useNavigationStore();

    // Set current item when the page loads
    useEffect(() => {
        if (id) {
            setCurrentItem(id);
        }
    }, [id, setCurrentItem]);

    // Get the current folder
    const folder = id ? items[id] : null;

    // Get children of the current folder
    const children = id ? getItemChildren(id) : [];

    // Handle creating a new item
    const handleCreateItem = (type: 'folder' | 'page') => {
        // Create a default name
        const defaultName = type === 'folder'
            ? `New Folder ${new Date().toLocaleTimeString()}`
            : `New Page ${new Date().toLocaleTimeString()}`;

        // Add the item
        const newId = addItem({
            id: crypto.randomUUID(),
            type,
            name: defaultName,
            parentId: id || null,
            children: type === 'folder' ? [] : undefined,
        });

        // Navigate to the new item
        navigate(type === 'folder' ? `/folders/${newId}` : `/pages/${newId}`);
    };

    // Handle clicking on an item
    const handleItemClick = (itemId: string, type: 'folder' | 'page') => {
        setCurrentItem(itemId);
        navigate(type === 'folder' ? `/folders/${itemId}` : `/pages/${itemId}`);
    };

    if (!folder && id) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Folder Not Found</h2>
                <p className="mb-4">The folder you're looking for doesn't exist or has been deleted.</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-accent-primary text-white rounded-md"
                >
                    Go to Home
                </button>
            </div>
        );
    }

    return (
        <div className="folder-page">
            {/* Folder Header */}
            <div className="mb-6">
                <div className="flex items-center mb-2">
                    <FolderIcon className="w-6 h-6 mr-2 text-accent-tertiary" />
                    <h1 className="text-2xl font-semibold">
                        {folder ? folder.name : 'Root'}
                    </h1>
                </div>
                <p className="text-sm opacity-70">
                    {children.length} item{children.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Actions */}
            <div className="mb-6 flex gap-2">
                <button
                    onClick={() => handleCreateItem('folder')}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-primary bg-opacity-10 hover:bg-opacity-20 text-accent-primary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <FolderIcon className="w-5 h-5" />
                    <span>New Folder</span>
                </button>
                <button
                    onClick={() => handleCreateItem('page')}
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-secondary bg-opacity-10 hover:bg-opacity-20 text-accent-secondary"
                >
                    <PlusIcon className="w-5 h-5" />
                    <DocumentIcon className="w-5 h-5" />
                    <span>New Page</span>
                </button>
            </div>

            {/* Content */}
            {children.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {children.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleItemClick(item.id, item.type)}
                            className="p-4 rounded-md bg-dark-surface dark:bg-dark-surface light:bg-light-surface hover:shadow-md cursor-pointer transition-all"
                        >
                            <div className="flex items-center mb-2">
                                {item.type === 'folder' ? (
                                    <FolderIcon className="w-5 h-5 mr-2 text-accent-tertiary" />
                                ) : (
                                    <DocumentIcon className="w-5 h-5 mr-2 text-accent-secondary" />
                                )}
                                <h3 className="font-medium truncate">{item.name}</h3>
                            </div>
                            <p className="text-xs opacity-70">
                                Updated {new Date(item.updatedAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-md">
                    <p className="mb-4 opacity-70">This folder is empty</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => handleCreateItem('folder')}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-primary bg-opacity-10 hover:bg-opacity-20 text-accent-primary"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <FolderIcon className="w-5 h-5" />
                            <span>New Folder</span>
                        </button>
                        <button
                            onClick={() => handleCreateItem('page')}
                            className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent-secondary bg-opacity-10 hover:bg-opacity-20 text-accent-secondary"
                        >
                            <PlusIcon className="w-5 h-5" />
                            <DocumentIcon className="w-5 h-5" />
                            <span>New Page</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderPage;