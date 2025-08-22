// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react'
import api from '../api/apiService';

// Interface para definir a estrutura dos dados de autenticação
interface AuthData {
  _id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'tecnico' | 'funcionario';
  token: string;
}

// Interface para o que será exposto pelo Context
interface AuthContextType {
  auth: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  // Efeito para carregar dados do localStorage quando o app inicia
  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      const authData: AuthData = JSON.parse(storedAuth);
      setAuth(authData);
      // Configura o token no cabeçalho do Axios para todas as futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${authData.token}`;
    }
  }, []);

  const login = (data: AuthData) => {
    setAuth(data);
    localStorage.setItem('auth', JSON.stringify(data));
    // Configura o token no cabeçalho do Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    // Remove o token do cabeçalho do Axios
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
