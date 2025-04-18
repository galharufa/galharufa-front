// Serviços para gerenciamento de casting
import api from './api';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export interface CastingResumido {
  id: number;
  nome: string;
  categoria: number;
  categoria_nome: string;
  foto_principal: string;
  ativo: boolean;
}

export interface Foto {
  id: number;
  imagem: string;
  legenda: string;
  ordem: number;
}

export interface Video {
  id: number;
  titulo: string;
  url: string;
  ordem: number;
}

export interface CastingDetalhado extends CastingResumido {
  data_nascimento: string;
  altura: string;
  peso: string;
  biografia: string;
  experiencia: string;
  data_cadastro: string;
  data_atualizacao: string;
  fotos: Foto[];
  videos: Video[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const CastingService = {
  // Categorias
  async getCategorias(params?: {
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Categoria>> {
    try {
      const response = await api.get<PaginatedResponse<Categoria>>(
        '/api/casting/categorias/',
        { params },
      );
      return response.data;
    } catch {
      // Tratamento de erro ao obter categorias
      // Retornar uma estrutura padrão vazia para evitar erros
      return { count: 0, next: null, previous: null, results: [] };
    }
  },

  async getCategoria(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/api/casting/categorias/${id}/`);
    return response.data;
  },

  async criarCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/casting/categorias/', categoria);
    return response.data;
  },

  async atualizarCategoria(
    id: number,
    categoria: Partial<Categoria>,
  ): Promise<Categoria> {
    const response = await api.patch<Categoria>(
      `/api/casting/categorias/${id}/`,
      categoria,
    );
    return response.data;
  },

  async excluirCategoria(id: number): Promise<void> {
    await api.delete(`/api/casting/categorias/${id}/`);
  },

  // Castings
  async getCastings(params?: {
    categoria?: number;
    ativo?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<CastingResumido>> {
    try {
      const response = await api.get<PaginatedResponse<CastingResumido>>(
        '/api/casting/castings/',
        { params },
      );
      return response.data;
    } catch {
      // Tratamento de erro ao obter castings
      // Retornar uma estrutura padrão vazia para evitar erros
      return { count: 0, next: null, previous: null, results: [] };
    }
  },

  async getCasting(id: string): Promise<CastingDetalhado> {
    try {
      // Verificar se o ID é válido
      if (!id || id === 'undefined' || id === 'null') {
        throw new Error('ID de casting inválido');
      }

      // Garantir que estamos usando o mesmo formato de URL que funciona em outras chamadas
      const url = '/api/casting/castings/' + id + '/';

      // Tentar fazer a requisição
      const response = await api.get<CastingDetalhado>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async criarCasting(formData: FormData): Promise<CastingDetalhado> {
    const response = await api.post<CastingDetalhado>(
      '/api/casting/castings/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async atualizarCasting(id: number, formData: FormData): Promise<CastingDetalhado> {
    const response = await api.patch<CastingDetalhado>(
      `/api/casting/castings/${id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async excluirCasting(id: number): Promise<void> {
    await api.delete(`/api/casting/castings/${id}/`);
  },

  // Fotos
  async adicionarFoto(castingId: number, formData: FormData): Promise<Foto> {
    const response = await api.post<Foto>(
      `/api/casting/castings/${castingId}/add_foto/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  async excluirFoto(castingId: number, fotoId: number): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/fotos/${fotoId}/`);
  },

  // Vídeos
  async adicionarVideo(castingId: number, video: Omit<Video, 'id'>): Promise<Video> {
    const response = await api.post<Video>(
      `/api/casting/castings/${castingId}/videos/`,
      video,
    );
    return response.data;
  },

  async excluirVideo(castingId: number, videoId: number): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/videos/${videoId}/`);
  },
};
