import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage, ChatPage, KnowledgePage, FolderPage, PageView } from './pages';
import { AppLayout } from './components/Layout';
import { useUserStore, useThemeStore } from './store';

function App() {
    const { token, fetchCurrentUser } = useUserStore();
    const { mode: themeMode } = useThemeStore();

    // Fetch current user on app load if token exists
    useEffect(() => {
        if (token) {
            fetchCurrentUser();
        }
    }, [token, fetchCurrentUser]);

    return (
        <div className={`app ${themeMode}`}>
            <AppLayout>
                <Routes>
                    {/* Home */}
                    <Route path="/" element={<HomePage />} />

                    {/* Chat */}
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/chat/:id" element={<ChatPage />} />

                    {/* Knowledge */}
                    <Route path="/knowledge" element={<KnowledgePage />} />

                    {/* Folders and Pages */}
                    <Route path="/folders/:id" element={<FolderPage />} />
                    <Route path="/pages/:id" element={<PageView />} />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AppLayout>
        </div>
    );
}

export default App;