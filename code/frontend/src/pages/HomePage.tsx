import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChatBubbleLeftRightIcon,
    DocumentTextIcon,
    FolderIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';
import { useConversationStore, useUserStore, useNavigationStore } from '../store';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useUserStore();
    const { conversations, createConversation } = useConversationStore();
    const { items, recentItems } = useNavigationStore();

    // Handle new conversation creation
    const handleNewConversation = async () => {
        try {
            const newConversation = await createConversation('New Conversation');
            navigate(`/chat/${newConversation.id}`);
        } catch (error) {
            console.error('Failed to create conversation:', error);
        }
    };

    // Handle new page creation
    const handleNewPage = () => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();

        // Create a new page
        const newPageId = useNavigationStore.getState().addItem({
            id,
            type: 'page',
            name: `New Page ${now}`,
            parentId: null,
            content: 'Start writing your content here...',
        });

        // Navigate to the new page
        navigate(`/pages/${newPageId}`);
    };

    // Get recent pages
    const recentPages = recentItems
        .map(id => items[id])
        .filter(item => item && item.type === 'page')
        .slice(0, 5);

    return (
        <div className="home-page p-6">
            {/* Hero Section */}
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-accent-primary">AI-First Personal Knowledge Management</h1>
                <p className="text-xl mb-8 opacity-80">Capture, organize, and retrieve your knowledge through natural conversations</p>

                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleNewConversation}
                        className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                        <span>Start a New Conversation</span>
                    </button>
                    <button
                        onClick={handleNewPage}
                        className="flex items-center gap-2 px-6 py-3 bg-accent-secondary text-white rounded-md hover:bg-opacity-90 transition-colors"
                    >
                        <DocumentTextIcon className="w-5 h-5" />
                        <span>Create a New Page</span>
                    </button>
                </div>
            </div>

            {/* Recent Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Recent Conversations */}
                <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-5 h-5 text-accent-primary" />
                        <span>Recent Conversations</span>
                    </h2>

                    {user && conversations.length > 0 ? (
                        <div className="space-y-3">
                            {conversations.slice(0, 5).map(conversation => (
                                <div
                                    key={conversation.id}
                                    onClick={() => navigate(`/chat/${conversation.id}`)}
                                    className="p-3 bg-dark-background dark:bg-dark-background light:bg-light-background rounded-md hover:shadow-md cursor-pointer transition-all"
                                >
                                    <h3 className="font-medium">{conversation.title || 'Untitled Conversation'}</h3>
                                    <div className="flex justify-between text-sm opacity-70 mt-1">
                                        <span>{new Date(conversation.updatedAt).toLocaleDateString()}</span>
                                        <span>{conversation.messages?.length || 0} messages</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6 opacity-70">
                            <p>No recent conversations</p>
                            <button
                                onClick={handleNewConversation}
                                className="mt-3 text-accent-primary hover:underline"
                            >
                                Start your first conversation
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Pages */}
                <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-6 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5 text-accent-secondary" />
                        <span>Recent Pages</span>
                    </h2>

                    {recentPages.length > 0 ? (
                        <div className="space-y-3">
                            {recentPages.map(page => (
                                <div
                                    key={page.id}
                                    onClick={() => navigate(`/pages/${page.id}`)}
                                    className="p-3 bg-dark-background dark:bg-dark-background light:bg-light-background rounded-md hover:shadow-md cursor-pointer transition-all"
                                >
                                    <h3 className="font-medium">{page.name}</h3>
                                    <div className="text-sm opacity-70 mt-1">
                                        <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-6 opacity-70">
                            <p>No pages created yet</p>
                            <button
                                onClick={handleNewPage}
                                className="mt-3 text-accent-secondary hover:underline"
                            >
                                Create your first page
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 text-center">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 rounded-lg">
                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-accent-primary bg-opacity-10 rounded-full">
                            <ChatBubbleLeftRightIcon className="w-6 h-6 text-accent-primary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Chat-Based Interface</h3>
                        <p className="opacity-80">Interact with your knowledge base through natural conversations</p>
                    </div>
                    <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 rounded-lg">
                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-accent-secondary bg-opacity-10 rounded-full">
                            <SparklesIcon className="w-6 h-6 text-accent-secondary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Intelligent Organization</h3>
                        <p className="opacity-80">AI automatically organizes your information and suggests connections</p>
                    </div>
                    <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 rounded-lg">
                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-accent-tertiary bg-opacity-10 rounded-full">
                            <DocumentTextIcon className="w-6 h-6 text-accent-tertiary" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Structured Knowledge</h3>
                        <p className="opacity-80">Flexible data structure with nodes and supertags for powerful organization</p>
                    </div>
                    <div className="bg-dark-surface dark:bg-dark-surface light:bg-light-surface p-5 rounded-lg">
                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-accent-warning bg-opacity-10 rounded-full">
                            <FolderIcon className="w-6 h-6 text-accent-warning" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Hierarchical Organization</h3>
                        <p className="opacity-80">Organize your knowledge in folders and pages with a flexible structure</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;