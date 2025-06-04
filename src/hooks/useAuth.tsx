/* eslint-disable camelcase */
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
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

  // Função para fazer logout automático quando o token expirar
  const handleTokenExpiration = useCallback(() => {
    AuthService.logout();
    setUser(null);
    router.push('/admin/login');
  }, [router]);

  // Verificação periódica do token de acesso
  useEffect(() => {
    // Não verificar se o usuário não estiver logado
    if (!user) return;

    // Verificar expiração imediatamente
    if (AuthService.isAccessTokenExpired()) {
      handleTokenExpiration();
      return;
    }

    // Intervalo de verificação a cada 10 segundos
    const intervalId = setInterval(() => {
      if (AuthService.isAccessTokenExpired()) {
        handleTokenExpiration();
      }
    }, 10000); // 10 segundos

    return () => clearInterval(intervalId);
  }, [user, router, handleTokenExpiration]);

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const checkAuth = async () => {
      try {
        const storedUser = AuthService.getStoredUser();

        // Verificar se o token está expirado antes de definir o usuário
        if (storedUser) {
          if (AuthService.isAccessTokenExpired()) {
            // Se o token estiver expirado, limpar dados
            AuthService.logout();
          } else {
            setUser(storedUser);
          }
        }
      } catch {
        // Tratar erro silenciosamente
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await AuthService.login({
        username: credentials.username,
        password: credentials.password,
        remember_me: credentials.remember_me,
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
