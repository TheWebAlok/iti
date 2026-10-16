import { createContext, useCallback, useContext, useEffect, useState } from 'react';

// VITE_API_URL chahe '', '/api', 'http://localhost:5000' ya 'http://localhost:5000/api' ho,
// base hamesha ek hi baar '/api' ke saath banega.
const RAW = import.meta.env.VITE_API_URL || '';
const BASE = RAW.replace(/\/+$/, '').replace(/\/api$/, '') + '/api';

const AuthContext = createContext(null);

export const api = (path, options = {}) =>
  fetch(`${BASE}${path}`, {
    credentials: 'include', // sends the JWT cookie
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page refresh
  useEffect(() => {
    api('/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setUser(d?.user || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password, role) => {
    const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password, role }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    await api('/auth/logout', { method: 'POST' });
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);