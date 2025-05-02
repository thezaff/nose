import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    DocumentIcon,
    PencilIcon,
    CheckIcon,
    ArrowUturnLeftIcon
} from '@heroicons/react/24/outline';
import { useNavigationStore } from '../store';

const PageView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const {
        items,
        setCurrentItem,
        updateItem
    } = useNavigationStore();

    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState('');

    // Set current item when the page loads
    useEffect(() => {
        if (id) {
            setCurrentItem(id);
        }
    }, [id, setCurrentItem]);

    // Get the current page
    const page = id ? items[id] : null;

    // Initialize content from page metadata (in a real app, this would come from the backend)
    useEffect(() => {
        if (page) {
            // In Phase 1, we're just using placeholder content
            // In Phase 2, this will be replaced with actual block editor content
            setContent(page.content || 'This page is empty. Click "Edit" to add content.');
        }
    }, [page]);

    // Handle saving the page
    const handleSave = () => {
        if (id) {
            updateItem(id, {
                content: content,
            });
            setIsEditing(false);
        }
    };

    // Handle canceling edits
    const handleCancel = () => {
        if (page) {
            setContent(page.content || 'This page is empty. Click "Edit" to add content.');
        }
        setIsEditing(false);
    };

    if (!page && id) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
                <p className="mb-4">The page you're looking for doesn't exist or has been deleted.</p>
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
        <div className="page-view">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <DocumentIcon className="w-6 h-6 mr-2 text-accent-secondary" />
                        <h1 className="text-2xl font-semibold">
                            {page ? page.name : 'Untitled Page'}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-accent-secondary text-white"
                                >
                                    <CheckIcon className="w-4 h-4" />
                                    <span>Save</span>
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-dark-surface dark:bg-dark-surface light:bg-light-surface"
                                >
                                    <ArrowUturnLeftIcon className="w-4 h-4" />
                                    <span>Cancel</span>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-accent-primary bg-opacity-10 hover:bg-opacity-20 text-accent-primary"
                            >
                                <PencilIcon className="w-4 h-4" />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                </div>
                <p className="text-sm opacity-70">
                    Last updated {page ? new Date(page.updatedAt).toLocaleString() : 'never'}
                </p>
            </div>

            {/* Page Content */}
            <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-md p-6">
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-64 p-4 bg-dark-background dark:bg-dark-background light:bg-light-background rounded-md border dark:border-gray-700 light:border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter page content here..."
                    />
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        {content.split('\n').map((paragraph, index) => (
                            <p key={index}>{paragraph || <br />}</p>
                        ))}
                    </div>
                )}
            </div>

            {/* Metadata */}
            <div className="mt-6 p-4 bg-dark-surface dark:bg-dark-surface light:bg-light-surface rounded-md">
                <h3 className="text-sm font-medium mb-2">Page Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="opacity-70">Created</div>
                    <div>{page ? new Date(page.createdAt).toLocaleString() : 'Unknown'}</div>
                    <div className="opacity-70">Last Modified</div>
                    <div>{page ? new Date(page.updatedAt).toLocaleString() : 'Unknown'}</div>
                    <div className="opacity-70">ID</div>
                    <div className="font-mono text-xs">{id}</div>
                </div>
            </div>
        </div>
    );
};

export default PageView;