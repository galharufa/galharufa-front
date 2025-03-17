import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { errorToast } from '@/utils';

// Verificar se estamos em ambiente de build do servidor
const isServer = typeof window === 'undefined';

// Verificando a URL base da API
const API_URL = isServer ? 'http://localhost:8000' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000');

console.log('API_URL configurada:', API_URL);

// Verificar se a URL termina com barra e remover se necessário
const baseURL = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
console.log('URL base ajustada:', baseURL);

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

// Interceptor para adicionar token apenas se não estivermos em ambiente de build
if (!isBuild) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('accessToken');
      
      console.log('Enviando requisição para:', `${config.baseURL}${config.url}`);
      console.log('Método:', config.method?.toUpperCase());
      
      // Não logar dados sensíveis como senhas
      if (config.data && typeof config.data === 'object' && 'password' in config.data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...safeData } = config.data;
        console.log('Dados enviados (sem senha):', safeData);
      } else {
        console.log('Dados enviados:', config.data);
      }
      
      console.log('Parâmetros:', config.params);
      
      // Adicione o token à requisição apenas se ele existir
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token adicionado ao cabeçalho (Bearer)');
      } else {
        console.log('Sem token de autenticação');
      }
      
      // Não logar o valor real do cabeçalho de autorização
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { Authorization, ...safeHeaders } = config.headers || {};
      console.log('Cabeçalhos da requisição (sem Authorization):', safeHeaders);
      
      return config;
    },
    (error) => {
      console.error('Erro no interceptor de requisição:', error);
      return Promise.reject(error);
    }
  );
}

// Interceptor para tratar respostas apenas se não estivermos em ambiente de build
if (!isBuild) {
  api.interceptors.response.use(
    (response) => {
      console.log('Resposta recebida de:', response.config.url);
      console.log('Status da resposta:', response.status);
      console.log('Cabeçalhos da resposta:', response.headers);
      return response;
    },
    async (error: AxiosError) => {
      console.error('Erro na resposta:', error.message);
      console.error('Status do erro:', error.response?.status);
      console.error('Dados do erro:', error.response?.data);
      
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      
      // Tentar renovar o token apenas se o erro for 401 (Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('Erro 401 detectado - Tentando renovar o token');
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
          console.log('Refresh token encontrado:', !!refreshToken);
          
          if (!refreshToken) {
            console.log('Sem refresh token - Redirecionando para login');
            // Se não tiver refresh token, redirecionar para login
            window.location.href = '/admin/login';
            return Promise.reject(error);
          }
          
          console.log('Tentando renovar o token com refresh token');
          const response = await axios.post(`${baseURL}/api/token/refresh/`, {
            refresh: refreshToken
          }, {
            withCredentials: true // Permitir envio de cookies e credenciais
          });
          
          console.log('Token renovado com sucesso');
          localStorage.setItem('accessToken', response.data.access);
          
          // Refazer a requisição original com o novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            console.log('Novo token adicionado à requisição original');
          }
          console.log('Refazendo a requisição original');
          return axios(originalRequest);
        } catch (refreshError: Error | unknown) {
          console.error('Erro ao renovar o token:', refreshError instanceof Error ? refreshError.message : 'Erro desconhecido');
          
          // Verificar se o erro é do tipo AxiosError para acessar propriedades específicas
          if (axios.isAxiosError(refreshError)) {
            console.error('Status do erro de renovação:', refreshError.response?.status);
            console.error('Dados do erro de renovação:', refreshError.response?.data);
          } else {
            console.error('Status do erro de renovação: Desconhecido');
            console.error('Dados do erro de renovação: Desconhecidos');
          }
          
          // Limpar tokens e redirecionar para login
          console.log('Limpando tokens e redirecionando para login');
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
        console.log('Dados completos do erro:', errorData);
        
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
            console.error('Erros de validação de campos:', fieldErrors);
            errorToast(fieldErrors.join('\n'));
          } else if (errorData.detail) {
            console.error('Mensagem de erro detalhada:', errorData.detail);
            errorToast(errorData.detail);
          } else if (errorData.message) {
            console.error('Mensagem de erro:', errorData.message);
            errorToast(errorData.message);
          }
        }
      } else if (error.message) {
        console.error('Mensagem de erro genérica:', error.message);
        errorToast(error.message);
      } else {
        console.error('Erro desconhecido na requisição');
        errorToast('Ocorreu um erro na requisição');
      }
      
      return Promise.reject(error);
    }
  );
}

export default api;
