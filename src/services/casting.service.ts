import api from './api';

export interface Categoria {
  id: number;
  nome: string;
  descricao: string;
}

export interface TalentoResumido {
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

export interface TalentoDetalhado extends TalentoResumido {
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
  async getCategorias(params?: { search?: string; ordering?: string }): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<PaginatedResponse<Categoria>>('/api/casting/categorias/', { params });
    return response.data;
  },
  
  async getCategoria(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/api/casting/categorias/${id}/`);
    return response.data;
  },
  
  async criarCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/casting/categorias/', categoria);
    return response.data;
  },
  
  async atualizarCategoria(id: number, categoria: Partial<Categoria>): Promise<Categoria> {
    const response = await api.patch<Categoria>(`/api/casting/categorias/${id}/`, categoria);
    return response.data;
  },
  
  async excluirCategoria(id: number): Promise<void> {
    await api.delete(`/api/casting/categorias/${id}/`);
  },
  
  // Talentos
  async getTalentos(params?: { 
    categoria?: number; 
    ativo?: boolean; 
    search?: string; 
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<TalentoResumido>> {
    const response = await api.get<PaginatedResponse<TalentoResumido>>('/api/casting/talentos/', { params });
    return response.data;
  },
  
  async getTalento(id: number): Promise<TalentoDetalhado> {
    const response = await api.get<TalentoDetalhado>(`/api/casting/talentos/${id}/`);
    return response.data;
  },
  
  async criarTalento(formData: FormData): Promise<TalentoDetalhado> {
    const response = await api.post<TalentoDetalhado>('/api/casting/talentos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  async atualizarTalento(id: number, formData: FormData): Promise<TalentoDetalhado> {
    const response = await api.patch<TalentoDetalhado>(`/api/casting/talentos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  async excluirTalento(id: number): Promise<void> {
    await api.delete(`/api/casting/talentos/${id}/`);
  },
  
  // Fotos
  async adicionarFoto(talentoId: number, formData: FormData): Promise<Foto> {
    const response = await api.post<Foto>(`/api/casting/talentos/${talentoId}/add_foto/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  
  async excluirFoto(talentoId: number, fotoId: number): Promise<void> {
    await api.delete(`/api/casting/talentos/${talentoId}/fotos/${fotoId}/`);
  },
  
  // Vídeos
  async adicionarVideo(talentoId: number, video: Omit<Video, 'id'>): Promise<Video> {
    const response = await api.post<Video>(`/api/casting/talentos/${talentoId}/videos/`, video);
    return response.data;
  },
  
  async excluirVideo(talentoId: number, videoId: number): Promise<void> {
    await api.delete(`/api/casting/talentos/${talentoId}/videos/${videoId}/`);
  }
};
