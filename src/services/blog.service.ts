import api from './api';
import { PaginatedResponse } from './casting.service';

export interface Tag {
  id: number;
  nome: string;
  slug: string;
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
  descricao: string;
}

export interface PostResumido {
  id: number;
  titulo: string;
  resumo: string;
  slug: string;
  imagem_destaque: string;
  data_publicacao: string;
  categoria: number;
  categoria_nome: string;
  publicado: boolean;
}

export interface Post extends PostResumido {
  conteudo: string;
  tags: Tag[];
}

export interface PostFiltros {
  categoria?: number;
  tag?: number;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export interface Autor {
  id: number;
  username: string;
  name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  last_login: string;
}

export const BlogService = {
  // Categorias
  async getCategorias(): Promise<PaginatedResponse<Categoria>> {
    const response = await api.get<PaginatedResponse<Categoria>>('/api/blog/categorias/');
    return response.data;
  },

  async getCategoria(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`/api/blog/categorias/${id}/`);
    return response.data;
  },

  async criarCategoria(data: Partial<Categoria>): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/blog/categorias/', data);
    return response.data;
  },

  async atualizarCategoria(id: number, data: Partial<Categoria>): Promise<Categoria> {
    const response = await api.patch<Categoria>(`/api/blog/categorias/${id}/`, data);
    return response.data;
  },

  async excluirCategoria(id: number): Promise<void> {
    await api.delete(`/api/blog/categorias/${id}/`);
  },

  // Tags
  async getTags(): Promise<PaginatedResponse<Tag>> {
    const response = await api.get<PaginatedResponse<Tag>>('/api/blog/tags/');
    return response.data;
  },

  async getTag(id: number): Promise<Tag> {
    const response = await api.get<Tag>(`/api/blog/tags/${id}/`);
    return response.data;
  },

  async criarTag(data: Partial<Tag>): Promise<Tag> {
    const response = await api.post<Tag>('/api/blog/tags/', data);
    return response.data;
  },

  async atualizarTag(id: number, data: Partial<Tag>): Promise<Tag> {
    const response = await api.patch<Tag>(`/api/blog/tags/${id}/`, data);
    return response.data;
  },

  async excluirTag(id: number): Promise<void> {
    await api.delete(`/api/blog/tags/${id}/`);
  },

  // Posts
  async getPosts(filtros?: PostFiltros): Promise<PaginatedResponse<PostResumido>> {
    const params = new URLSearchParams();

    if (filtros) {
      if (filtros.categoria) params.append('categoria', filtros.categoria.toString());
      if (filtros.tag) params.append('tag', filtros.tag.toString());
      if (filtros.search) params.append('search', filtros.search);
      if (filtros.ordering) params.append('ordering', filtros.ordering);
      if (filtros.page) params.append('page', filtros.page.toString());
      if (filtros.page_size) params.append('page_size', filtros.page_size.toString());
    }

    const response = await api.get<PaginatedResponse<PostResumido>>('/api/blog/posts/', {
      params,
    });
    return response.data;
  },

  async getPost(id: number): Promise<Post> {
    const response = await api.get<Post>(`/api/blog/posts/${id}/`);
    return response.data;
  },

  async criarPost(formData: FormData): Promise<PostResumido> {
    const response = await api.post<PostResumido>('/api/blog/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async atualizarPost(id: number, formData: FormData): Promise<PostResumido> {
    const response = await api.patch<PostResumido>(`/api/blog/posts/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async excluirPost(id: number): Promise<void> {
    await api.delete(`/api/blog/posts/${id}/`);
  },
};
