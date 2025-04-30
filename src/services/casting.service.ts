// Serviços para gerenciamento de casting
import api from './api';

export interface Funcao {
  id: string;
  nome: string;
  descricao?: string;
}

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
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

type NivelIdioma = 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente';

export interface Idioma {
  ingles: boolean;
  nivel_ingles?: NivelIdioma;
  portugues: boolean;
  nivel_portugues?: NivelIdioma;
  espanhol: boolean;
  nivel_espanhol?: NivelIdioma;
  frances: boolean;
  nivel_frances?: NivelIdioma;
  italiano: boolean;
  nivel_italiano?: NivelIdioma;
  alemao: boolean;
  nivel_alemao?: NivelIdioma;
  mandarin: boolean;
  nivel_mandarin?: NivelIdioma;
  japones: boolean;
  nivel_japones?: NivelIdioma;
  russo: boolean;
  nivel_russo?: NivelIdioma;
  arabe: boolean;
  nivel_arabe?: NivelIdioma;
  hungaro: boolean;
  nivel_hungaro?: NivelIdioma;
}

export interface CastingResumido {
  id: string;
  nome: string;
  nome_artistico: string;
  categoria?: string[];
  categoria_nome: string;
  foto_principal: string;
  ativo: boolean;
}

export interface CastingDetalhado extends CastingResumido {
  nome_artistico: string;
  tipo: string;
  genero: string;
  nacionalidade: string | null;
  etnia: string | null;
  altura: string;
  peso: string;
  olhos: string | null;
  cor_cabelo: string | null;
  canta_profissionalmente: boolean;
  danca_profissionalmente: boolean;
  autoriza_imagem_site: boolean;
  data_nascimento: string;
  biografia?: string;
  experiencia?: string;
  data_cadastro: string;
  data_atualizacao: string;
  fotos: Foto[];
  videos: Video[];
  habilidades: Funcao[];
  idiomas: Idioma[];
  instagram: string;
  imdb: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const CastingService = {
  // Habilidades
  async getHabilidades(params?: {
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Funcao>> {
    try {
      const response = await api.get<PaginatedResponse<Funcao>>('/api/casting/funcoes/', {
        params,
      });
      return response.data;
    } catch {
      // Tratamento de erro ao obter funções
      // Retornar uma estrutura padrão vazia para evitar erros
      return { count: 0, next: null, previous: null, results: [] };
    }
  },

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

  async atualizarCasting(id: string, formData: FormData): Promise<CastingDetalhado> {
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

  async excluirCasting(id: string): Promise<void> {
    await api.delete(`/api/casting/castings/${id}/`);
  },

  // Fotos
  async adicionarFoto(castingId: string, formData: FormData): Promise<Foto> {
    // Obter o token de autenticação
    const token = localStorage.getItem('accessToken');

    // Log para debug
    // eslint-disable-next-line no-console
    console.log(`Enviando foto adicional para casting ${castingId}`);
    for (const pair of formData.entries()) {
      // eslint-disable-next-line no-console
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const response = await api.post<Foto>(
      `/api/casting/castings/${castingId}/add_foto/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  async excluirFoto(castingId: string, fotoId: number): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/fotos/${fotoId}/`);
  },

  // Vídeos
  async adicionarVideo(castingId: string, video: Omit<Video, 'id'>): Promise<Video> {
    // Obter o token de autenticação
    const token = localStorage.getItem('accessToken');

    // Log para debug
    // eslint-disable-next-line no-console
    console.log(`Enviando vídeo para casting ${castingId}`, video);

    const response = await api.post<Video>(
      `/api/casting/castings/${castingId}/videos/`,
      video,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  async excluirVideo(castingId: string, videoId: number): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/videos/${videoId}/`);
  },
};
