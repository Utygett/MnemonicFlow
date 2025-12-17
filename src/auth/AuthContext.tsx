import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  token: string | null;
  currentUser: User | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://localhost:8000';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('access_token')
  );
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchMe = async (jwtToken: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    if (!res.ok) throw new Error('Не удалось получить пользователя');
    const user: User = await res.json();
    setCurrentUser(user);
  };

  const login = async (newToken: string) => {
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
    await fetchMe(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
