'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();
        
        if (storedUser) {
          setUser(storedUser);
        }
      } catch {
        // Tratar erro silenciosamente
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        username: credentials.username,
        password: credentials.password,
        remember_me: credentials.remember_me
      });
      
      setUser(response.user);
      router.push('/admin/dashboard');
    } catch (error: Error | unknown) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/admin/login');
    } catch {
      // Tratar erro silenciosamente
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
