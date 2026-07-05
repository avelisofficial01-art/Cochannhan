import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.js';
import RegisterPage from './pages/RegisterPage.js';
import GamePage from './pages/GamePage.js';
import { useAuthStore } from './store/auth.js';

export default function App(): React.ReactElement {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div className="min-h-screen bg-gu-darker text-white">
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/game" replace /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/game" replace /> : <RegisterPage />} />
        <Route path="/game" element={isAuthenticated ? <GamePage /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? '/game' : '/login'} replace />} />
      </Routes>
    </div>
  );
}
