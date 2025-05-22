import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8030';

interface User {
  id: number;
  email: string;
  role: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expireDate: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const register = async (name: string, email: string, password: string) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Kayıt başarısız');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
    } catch (error: any) {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      throw new Error(error.response?.data?.message || 'Giriş başarısız');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
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