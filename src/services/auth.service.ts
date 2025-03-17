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
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
      const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
      
      const loginData = {
        username: credentials.username,
        password: credentials.password,
        remember_me: credentials.remember_me === true
      };
      
      const response = await axios.post<LoginResponse>(`${baseURL}/api/accounts/login/`, loginData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      
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
    try {
      await api.post('/api/accounts/logout/', {
        withCredentials: true // Permitir envio de cookies e credenciais
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
      const response = await api.get<User>('/api/accounts/me/', {
        withCredentials: true // Permitir envio de cookies e credenciais
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter informações do usuário:', error);
      throw error;
    }
  },
  
  getStoredUser(): User | null {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
};
