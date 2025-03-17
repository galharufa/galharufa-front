import api from './api';

export interface Configuracoes {
  id: number;
  nome_site: string;
  logo: string;
  favicon: string;
  email_contato: string;
  telefone: string;
  endereco: string;
  horario_funcionamento: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  twitter: string;
  descricao_meta: string;
  palavras_chave: string;
}

export const ConfiguracoesService = {
  async getConfiguracoes(): Promise<Configuracoes> {
    const response = await api.get<Configuracoes>('/api/configuracoes/');
    return response.data;
  },
  
  async atualizarConfiguracoes(formData: FormData): Promise<Configuracoes> {
    const response = await api.patch<Configuracoes>('/api/configuracoes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
