import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FolderIcon,
    DocumentIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useNavigationStore } from '../../store';
import { NavigationItem } from '../../store/navigationStore';

interface NavigationTreeProps {
    items: NavigationItem[];
    level?: number;
    parentId?: string | null;
}

const NavigationTree: React.FC<NavigationTreeProps> = ({
    items,
    level = 0,
    parentId = null
}) => {
    const navigate = useNavigate();
    const {
        currentItemId,
        setCurrentItem,
        getItemChildren,
        addItem,
        updateItem,
        removeItem
    } = useNavigationStore();

    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [isCreatingItem, setIsCreatingItem] = useState<string | null>(null);
    const [newItemType, setNewItemType] = useState<'folder' | 'page'>('page');
    const [newItemName, setNewItemName] = useState('');

    // Toggle folder expansion
    const toggleFolder = (folderId: string) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folderId]: !prev[folderId]
        }));
    };

    // Handle item click
    const handleItemClick = (item: NavigationItem) => {
        setCurrentItem(item.id);
        navigate(item.type === 'folder' ? `/folders/${item.id}` : `/pages/${item.id}`);
    };

    // Start editing an item
    const handleEditStart = (item: NavigationItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingItemId(item.id);
        setEditingName(item.name);
    };

    // Save edited item
    const handleEditSave = (itemId: string) => {
        if (editingName.trim()) {
            updateItem(itemId, { name: editingName });
        }
        setEditingItemId(null);
        setEditingName('');
    };

    // Cancel editing
    const handleEditCancel = () => {
        setEditingItemId(null);
        setEditingName('');
    };

    // Delete an item
    const handleDelete = (itemId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        removeItem(itemId);
    };

    // Start creating a new item
    const handleCreateStart = (parentId: string | null, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsCreatingItem(parentId);
        setNewItemName('');
    };

    // Save new item
    const handleCreateSave = (parentId: string | null) => {
        if (newItemName.trim()) {
            const id = addItem({
                id: crypto.randomUUID(),
                type: newItemType,
                name: newItemName,
                parentId,
                children: newItemType === 'folder' ? [] : undefined,
            });

            // Expand parent folder if it's a folder
            if (parentId) {
                setExpandedFolders(prev => ({
                    ...prev,
                    [parentId]: true
                }));
            }

            setCurrentItem(id);
            navigate(newItemType === 'folder' ? `/folders/${id}` : `/pages/${id}`);
        }

        setIsCreatingItem(null);
        setNewItemName('');
    };

    // Cancel creating new item
    const handleCreateCancel = () => {
        setIsCreatingItem(null);
        setNewItemName('');
    };

    return (
        <ul className={`space-y-1 ${level > 0 ? 'ml-4' : ''}`}>
            {items.map((item) => (
                <li key={item.id}>
                    {/* Item Row */}
                    <div
                        className={`flex items-center p-1 rounded-md cursor-pointer ${currentItemId === item.id
                                ? 'bg-accent-primary bg-opacity-20'
                                : 'hover:bg-opacity-10 hover:bg-accent-primary'
                            }`}
                        onClick={() => handleItemClick(item)}
                    >
                        {/* Folder Expand/Collapse Icon */}
                        {item.type === 'folder' && (
                            <button
                                className="p-0.5 mr-1"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFolder(item.id);
                                }}
                            >
                                {expandedFolders[item.id] ? (
                                    <ChevronDownIcon className="w-3.5 h-3.5" />
                                ) : (
                                    <ChevronRightIcon className="w-3.5 h-3.5" />
                                )}
                            </button>
                        )}

                        {/* Item Icon */}
                        <div className="mr-1.5">
                            {item.type === 'folder' ? (
                                <FolderIcon className="w-4 h-4 text-accent-tertiary" />
                            ) : (
                                <DocumentIcon className="w-4 h-4 text-accent-secondary" />
                            )}
                        </div>

                        {/* Item Name (or Edit Input) */}
                        {editingItemId === item.id ? (
                            <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    className="w-full p-1 text-sm rounded bg-dark-background dark:bg-dark-background light:bg-light-background"
                                    autoFocus
                                    onBlur={() => handleEditSave(item.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleEditSave(item.id);
                                        if (e.key === 'Escape') handleEditCancel();
                                    }}
                                />
                            </div>
                        ) : (
                            <span className="flex-1 text-sm truncate">{item.name}</span>
                        )}

                        {/* Item Actions */}
                        {editingItemId !== item.id && (
                            <div
                                className="flex opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="p-1 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                                    onClick={(e) => handleEditStart(item, e)}
                                >
                                    <PencilIcon className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    className="p-1 rounded-md hover:bg-opacity-10 hover:bg-accent-primary text-accent-error"
                                    onClick={(e) => handleDelete(item.id, e)}
                                >
                                    <TrashIcon className="w-3.5 h-3.5" />
                                </button>
                                {item.type === 'folder' && (
                                    <button
                                        className="p-1 rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                                        onClick={(e) => handleCreateStart(item.id, e)}
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* New Item Form */}
                    {isCreatingItem === item.id && (
                        <div className="ml-6 mt-1 p-2 bg-opacity-10 bg-accent-primary rounded-md">
                            <div className="flex gap-2 mb-2">
                                <button
                                    onClick={() => setNewItemType('folder')}
                                    className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'folder' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                        }`}
                                >
                                    <FolderIcon className="w-3.5 h-3.5" />
                                    <span className="text-xs">Folder</span>
                                </button>
                                <button
                                    onClick={() => setNewItemType('page')}
                                    className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'page' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                        }`}
                                >
                                    <DocumentIcon className="w-3.5 h-3.5" />
                                    <span className="text-xs">Page</span>
                                </button>
                            </div>
                            <input
                                type="text"
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder={`New ${newItemType} name...`}
                                className="w-full p-1 mb-2 rounded-md bg-dark-background dark:bg-dark-background light:bg-light-background border dark:border-gray-700 light:border-gray-300 text-xs"
                                autoFocus
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateSave(item.id);
                                    if (e.key === 'Escape') handleCreateCancel();
                                }}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={handleCreateCancel}
                                    className="px-2 py-0.5 text-xs rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleCreateSave(item.id)}
                                    className="px-2 py-0.5 text-xs rounded-md bg-accent-primary text-white"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Children (if folder and expanded) */}
                    {item.type === 'folder' && expandedFolders[item.id] && (
                        <NavigationTree
                            items={getItemChildren(item.id)}
                            level={level + 1}
                            parentId={item.id}
                        />
                    )}
                </li>
            ))}

            {/* New Item at Current Level */}
            {isCreatingItem === parentId && (
                <li className="mt-1 p-2 bg-opacity-10 bg-accent-primary rounded-md">
                    <div className="flex gap-2 mb-2">
                        <button
                            onClick={() => setNewItemType('folder')}
                            className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'folder' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                }`}
                        >
                            <FolderIcon className="w-3.5 h-3.5" />
                            <span className="text-xs">Folder</span>
                        </button>
                        <button
                            onClick={() => setNewItemType('page')}
                            className={`flex items-center gap-1 p-1 rounded-md ${newItemType === 'page' ? 'bg-accent-primary text-white' : 'hover:bg-opacity-10 hover:bg-accent-primary'
                                }`}
                        >
                            <DocumentIcon className="w-3.5 h-3.5" />
                            <span className="text-xs">Page</span>
                        </button>
                    </div>
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder={`New ${newItemType} name...`}
                        className="w-full p-1 mb-2 rounded-md bg-dark-background dark:bg-dark-background light:bg-light-background border dark:border-gray-700 light:border-gray-300 text-xs"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateSave(parentId);
                            if (e.key === 'Escape') handleCreateCancel();
                        }}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCreateCancel}
                            className="px-2 py-0.5 text-xs rounded-md hover:bg-opacity-10 hover:bg-accent-primary"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleCreateSave(parentId)}
                            className="px-2 py-0.5 text-xs rounded-md bg-accent-primary text-white"
                        >
                            Create
                        </button>
                    </div>
                </li>
            )}
        </ul>
    );
};

export default NavigationTree;