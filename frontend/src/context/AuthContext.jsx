import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import client from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('digitak_user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await client.post('/admin/auth/login', { email, password });
      localStorage.setItem('digitak_token', data.token);
      localStorage.setItem('digitak_user', JSON.stringify(data.user));
      setUser(data.user);
      return { ok: true, data };
    } catch (err) {
      return { ok: false, message: err?.response?.data?.message || 'Login gagal' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('digitak_token');
    localStorage.removeItem('digitak_user');
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isAuthenticated: !!user }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
}