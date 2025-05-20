import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<{ isAdmin: boolean }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  const login = async (email: string, password: string) => {
    // Burada gerçek bir API çağrısı yapılacak
    if (email === 'admin@gmail.com' && password === 'password') {
      setIsAuthenticated(true);
      setUser({ email, role: 'admin' });
      return { isAdmin: true };
    } else if (email === 'user@gmail.com' && password === 'password') {
      setIsAuthenticated(true);
      setUser({ email, role: 'user' });
      return { isAdmin: false };
    } else {
      throw new Error('Geçersiz email veya şifre');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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