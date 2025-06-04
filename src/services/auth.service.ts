/* eslint-disable camelcase */
/* eslint-disable no-console */
import api from './api';
import axios from 'axios';

interface LoginCredentials {
  username: string;
  password: string;
  remember_me?: boolean;
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

interface LoginResponse {
  refresh: string;
  access: string;
  user: User;
}

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://api.agenciagalharufa.com.br/';
      const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

      const loginData = {
        username: credentials.username,
        password: credentials.password,
        remember_me: credentials.remember_me === true,
      };

      const response = await axios.post<LoginResponse>(
        `${baseURL}/api/accounts/login/`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        },
      );

      // Salvar tokens e dados do usuário
      localStorage.setItem('accessToken', response.data.access);

      if (credentials.remember_me) {
        localStorage.setItem('refreshToken', response.data.refresh);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      } else {
        sessionStorage.setItem('refreshToken', response.data.refresh);
        sessionStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error: Error | unknown) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.agenciagalharufa.com.br/';
    const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

    try {
      await api.post(`${baseURL}/api/accounts/logout/`, {
        withCredentials: true, // Permitir envio de cookies e credenciais
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar tokens e dados do usuário independentemente da resposta da API
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('userData');
    }
  },

  async getUserInfo(): Promise<User> {
    try {
      const response = await api.get<User>('${baseURL}/api/accounts/me/', {
        withCredentials: true, // Permitir envio de cookies e credenciais
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      throw error;
    }
  },

  getStoredUser(): User | null {
    const userData =
      localStorage.getItem('userData') || sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
  isAccessTokenNearExpiry(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const timeLeft = exp - Date.now();

      return timeLeft < 5 * 60 * 1000; // menos de 5 minutos
    } catch {
      return true;
    }
  },

  isAccessTokenExpired(): boolean {
    const token = localStorage.getItem('accessToken');
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;

      return Date.now() >= exp; // Token expirado se o tempo atual for maior ou igual ao tempo de expiração
    } catch {
      return true; // Em caso de erro na verificação, considerar como expirado por segurança
    }
  },

  async refreshAccessToken(): Promise<string> {
    const refresh =
      localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

    if (!refresh) throw new Error('Refresh token não encontrado');

    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'https://api.agenciagalharufa.com.br/';
    const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

    const response = await axios.post(`${baseURL}/api/token/refresh/`, {
      refresh,
    });

    const newAccess = response.data.access;
    localStorage.setItem('accessToken', newAccess);
    return newAccess;
  },

  scheduleTokenWarning(onWarn?: () => void): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const warningTime = exp - Date.now() - 5 * 60 * 1000;

      if (warningTime > 0) {
        setTimeout(() => {
          if (onWarn) onWarn();
        }, warningTime);
      }
    } catch (err) {
      console.error('Erro ao programar aviso de expiração de token:', err);
    }
  },
};
