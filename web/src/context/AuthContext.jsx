import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchCurrentUser } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('tm_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem('tm_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const signIn = (nextUser, nextToken) => {
    localStorage.setItem('tm_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };

  const signOut = () => {
    localStorage.removeItem('tm_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de um AuthProvider.');
  return ctx;
}
