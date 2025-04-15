import api from './api';
import { PaginatedResponse } from './casting.service';

export interface Servico {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  preco: string;
  ativo: boolean;
  data_cadastro: string;
  data_atualizacao: string;
}

export interface ServicoResumido {
  id: number;
  nome: string;
  descricao: string;
  imagem: string;
  ativo: boolean;
}

export const ServicosService = {
  async getServicos(params?: {
    ativo?: boolean;
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<ServicoResumido>> {
    const response = await api.get<PaginatedResponse<ServicoResumido>>('/api/servicos/', {
      params,
    });
    return response.data;
  },

  async getServico(id: number): Promise<Servico> {
    const response = await api.get<Servico>(`/api/servicos/${id}/`);
    return response.data;
  },

  async criarServico(formData: FormData): Promise<Servico> {
    const response = await api.post<Servico>('/api/servicos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async atualizarServico(id: number, formData: FormData): Promise<Servico> {
    const response = await api.patch<Servico>(`/api/servicos/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async excluirServico(id: number): Promise<void> {
    await api.delete(`/api/servicos/${id}/`);
  },
};
