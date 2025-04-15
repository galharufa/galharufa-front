import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { errorToast } from '@/utils';

// Verificar se estamos em ambiente de build do servidor
const isServer = typeof window === 'undefined';

// Verificando a URL base da API
// const API_URL = isServer ? 'http://localhost:8000' : (process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000');
const API_URL = isServer ? 'https://api.agenciagalharufa.com.br/' : (process.env.NEXT_PUBLIC_API_URL || 'https://api.agenciagalharufa.com.br/');

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
  return PUBLIC_ENDPOINTS.some(endpoint => {
    // Verificar se a URL começa com o endpoint
    return url.startsWith(endpoint);
  });
};

// Verificar se estamos em uma página pública
const isPublicPage = (): boolean => {
  // Verificar se estamos no lado do cliente
  if (typeof window === 'undefined') return false;
  
  const path = window.location.pathname;
  return path === '/cast' || path.startsWith('/cast/') || path === '/' || path.startsWith('/servicos') || path.startsWith('/blog') || path.startsWith('/contato');
};

// Interceptor para adicionar token apenas se não estivermos em ambiente de build
if (!isBuild) {
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const url = config.url || '';
      console.log('Enviando requisição para:', `${config.baseURL}${url}`);
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

      // URL completa para verificação
      const fullUrl = `${config.baseURL}${url}`;
      console.log('URL completa para verificação:', fullUrl);

      // Verificar se o endpoint é público
      const isPublic = isPublicEndpoint(url);
      console.log('Endpoint público:', isPublic);

      // Verificar se estamos em uma página pública
      const isPublicPg = isPublicPage();
      console.log('Página pública:', isPublicPg);

      // Endpoints administrativos específicos que SEMPRE precisam de autenticação
      const isAdminEndpoint = url.includes('/admin/') || 
                             url.includes('/create') || 
                             url.includes('/update') || 
                             url.includes('/delete');

      // Adicionar token para páginas administrativas ou quando disponível para endpoints públicos
      const token = localStorage.getItem('accessToken');
      
      if (token) {
        // Se temos um token, sempre o adicionamos às requisições
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token adicionado ao cabeçalho (Bearer)');
      } else if (isAdminEndpoint) {
        // Se é um endpoint administrativo e não temos token, podemos alertar no console
        console.log('Sem token para endpoint administrativo:', url);
      } else {
        console.log('Sem token de autenticação - Requisição pública');
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
      const url = originalRequest.url;
      
      // Se for um endpoint público ou estamos em uma página pública, não redirecione para login
      if (isPublicEndpoint(url) || isPublicPage()) {
        console.log('Endpoint público ou página pública - Não redirecionando para login');
        return Promise.reject(error);
      }
      
      // Se o erro for 401 em uma página administrativa, verificar sessão
      if (error.response?.status === 401 && window.location.pathname.includes('/admin/')) {
        console.warn('Erro 401 em página administrativa - Verificando sessão');
        // Aqui poderia ter uma lógica adicional para verificar a sessão
      }
      
      // Tentar renovar o token apenas se o erro for 401 (Unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        console.log('Erro 401 detectado - Tentando renovar o token');
        originalRequest._retry = true;
        
        try {
          const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
          console.log('Refresh token encontrado:', !!refreshToken);
          
          if (!refreshToken) {
            console.log('Sem refresh token - Redirecionando para login');
            // Se não tiver refresh token e não for um endpoint público, redirecionar para login
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
