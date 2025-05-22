/* eslint-disable @typescript-eslint/no-unused-vars */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { errorToast } from '@/utils';
import router from 'next/router'; // ou useNavigation se estiver no App Router

// Verificar se estamos em ambiente de build do servidor
const isServer = typeof window === 'undefined';

// Verificando a URL base da API
// const API_URL = isServer ? 'http://localhost:8000' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000');
const API_URL = isServer
  ? 'https://api.agenciagalharufa.com.br/'
  : process.env.NEXT_PUBLIC_API_URL || 'https://api.agenciagalharufa.com.br/';

// Verificar se a URL termina com barra e remover se necessário
const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;

// Verificar se estamos no servidor durante o build
const isBuild = process.env.NODE_ENV === 'production' && isServer;

// Criando uma instância do Axios apenas se não estivermos em ambiente de build do servidor
// ou com uma configuração especial para ambiente de build
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: !isBuild,
});

//interceptor que verifica se a sessão expirou e avisa no toast
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      errorToast('Sua sessão expirou. Faça login novamente.');
      router.push('/admin/login');
    }
    return Promise.reject(error);
  },
);

// Definir endpoints públicos que não requerem autenticação
const PUBLIC_ENDPOINTS = [
  '/api/casting/castings', // Inclui '/api/casting/castings/' e '/api/casting/castings/1/'
  '/api/casting/categorias', // Inclui '/api/casting/categorias/' e '/api/casting/categorias/1/'
  '/api/servicos',
  '/api/blog',
  '/api/contato',
];

// Função para verificar se uma URL é de um endpoint público
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;

  // Verificando endpoints públicos
  for (const endpoint of PUBLIC_ENDPOINTS) {
    // Verificar se a URL começa com o endpoint
    // Precisamos verificar o endpoint exato ou com / no final
    if (
      url === endpoint ||
      url.startsWith(endpoint + '/') ||
      url.startsWith(endpoint + '?')
    ) {
      return true;
    }
  }

  return false;
};

// Verificar se estamos em uma página pública
const isPublicPage = (): boolean => {
  // Verificar se estamos no lado do cliente
  if (typeof window === 'undefined') return false;

  const path = window.location.pathname;
  return (
    path === '/cast' ||
    path.startsWith('/cast/') ||
    path === '/' ||
    path.startsWith('/servicos') ||
    path.startsWith('/blog') ||
    path.startsWith('/contato')
  );
};

// Interceptor para adicionar token apenas se não estivermos em ambiente de build
if (!isBuild) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const url = config.url || '';

      // URL completa para verificação
      const fullUrl = `${config.baseURL}${url}`;

      // Verificar se o endpoint é público
      const isPublic = isPublicEndpoint(url);

      // Verificar se estamos em uma página pública
      const isPublicPg = isPublicPage();

      // Endpoints administrativos específicos que SEMPRE precisam de autenticação
      const isAdminEndpoint =
        url.includes('/admin/') ||
        url.includes('/create') ||
        url.includes('/update') ||
        url.includes('/delete');

      // URL e endpoint público verificados

      // Determinar se é uma requisição administrativa ou pública
      const isAdminPage =
        typeof window !== 'undefined' && window.location.pathname.includes('/admin/');
      // Verificação de página administrativa

      // 1. Se é um endpoint público E NÃO estamos em página administrativa
      if (isPublic && !isAdminPage) {
        // Requisições públicas não devem ter token

        // Certifique-se de remover qualquer token existente
        if (config.headers) {
          delete config.headers.Authorization;
        }
      }
      // 2. Se estamos em página administrativa OU é um endpoint administrativo
      else if (isAdminPage || isAdminEndpoint) {
        // Adicionar token para autenticação
        const token = localStorage.getItem('accessToken');

        if (token) {
          // Requisição administrativa: adicionando token
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Requisição administrativa sem token disponível
        }
      }
      // 3. Para outros casos (híbridos)
      else {
        // Verificar se temos token disponível
        const token = localStorage.getItem('accessToken');

        if (token) {
          // Requisição híbrida: adicionando token disponível
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          // Requisição híbrida sem token
        }
      }

      // Não logar o valor real do cabeçalho de autorização
      const { Authorization, ...safeHeaders } = config.headers || {};

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );
}

// Interceptor para tratar respostas apenas se não estivermos em ambiente de build
if (!isBuild) {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };
      const url = originalRequest.url;

      // Se for um endpoint público ou estamos em uma página pública, não redirecione para login
      if (isPublicEndpoint(url) || isPublicPage()) {
        return Promise.reject(error);
      }

      // Se o erro for 401 em uma página administrativa, verificar sessão
      if (
        error.response?.status === 401 &&
        window.location.pathname.includes('/admin/')
      ) {
        // Aqui poderia ter uma lógica adicional para verificar a sessão
      }

      // Tentar renovar o token apenas se o erro for 401 (Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken =
            localStorage.getItem('refreshToken') ||
            sessionStorage.getItem('refreshToken');

          if (!refreshToken) {
            // Se não tiver refresh token e não for um endpoint público, redirecionar para login
            window.location.href = '/admin/login';
            return Promise.reject(error);
          }
          const response = await axios.post(
            `${baseURL}/api/token/refresh/`,
            {
              refresh: refreshToken,
            },
            {
              withCredentials: true, // Permitir envio de cookies e credenciais
            },
          );

          localStorage.setItem('accessToken', response.data.access);

          // Refazer a requisição original com o novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          }
          return axios(originalRequest);
        } catch (refreshError: Error | unknown) {
          // Limpar tokens e redirecionar para login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userData');
          sessionStorage.removeItem('refreshToken');
          sessionStorage.removeItem('userData');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      }

      // Exibir mensagem de erro para o usuário
      interface ErrorResponse {
        detail?: string;
        message?: string;
        [key: string]: unknown;
      }

      const errorData = error.response?.data as ErrorResponse | undefined;

      if (errorData) {
        // Verificar se há mensagens de erro específicas
        if (typeof errorData === 'object') {
          // Verificar se há erros de validação de campos
          const fieldErrors = Object.entries(errorData)
            .filter(([key]) => key !== 'detail' && key !== 'message')
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              } else if (typeof errors === 'string') {
                return `${field}: ${errors}`;
              }
              return null;
            })
            .filter(Boolean);

          if (fieldErrors.length > 0) {
            errorToast(fieldErrors.join('\n'));
          } else if (errorData.detail) {
            errorToast(errorData.detail);
          } else if (errorData.message) {
            errorToast(errorData.message);
          }
        }
      } else if (error.message) {
        errorToast(error.message);
      } else {
        errorToast('Ocorreu um erro na requisição');
      }

      return Promise.reject(error);
    },
  );
}

export default api;
