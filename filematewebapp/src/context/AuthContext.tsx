import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

const API_URL = process.env.API_URL || 'http://localhost:8030';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password });
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Kayıt başarısız');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, refreshToken, isAdmin } = response.data;
      setIsAuthenticated(true);
      setUser({ email, isAdmin });
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      return { isAdmin };
    } catch (error: any) {
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(error.response?.data?.error || 'Giriş başarısız');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 