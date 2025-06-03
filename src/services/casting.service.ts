// Serviços para gerenciamento de casting
import api from './api';

export interface Funcao {
  id: string;
  nome: string;
  descricao?: string;
}

export interface Categoria {
  id: string;
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

export interface Endereco {
  id: string;
  cep: string;
  estado: string;
  cidade: string;
  bairro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  pais: string;
}

export interface DadosBancarios {
  id: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo_conta: string;
  pix_chave: string;
}
export type NivelIdioma = 'basico' | 'intermediário' | 'avancado' | 'fluente' | 'nativo';

export interface Idiomas {
  ingles: boolean;
  nivel_ingles?: string;
  portugues: boolean;
  nivel_portugues?: string;
  espanhol: boolean;
  nivel_espanhol?: string;
  frances: boolean;
  nivel_frances?: string;
  italiano: boolean;
  nivel_italiano?: string;
  alemao: boolean;
  nivel_alemao?: string;
  mandarim: boolean;
  nivel_mandarim?: string;
  japones: boolean;
  nivel_japones?: string;
  russo: boolean;
  nivel_russo?: string;
  arabe: boolean;
  nivel_arabe?: string;
  hungaro: boolean;
  nivel_hungaro?: string;
  outros_idiomas?: string;
}

export interface CastingResumido extends CastingDetalhado {
  nome_artistico: string;
  categoria_nome: string;
  slug: string;
}

export interface CastingDetalhado {
  id: string;
  nome: string;
  nome_artistico: string;
  slug?: string;
  genero?: string;
  categoria: string;
  categoria_nome?: string;
  etnia?: string | null;
  data_nascimento?: string;
  data_cadastro: string;
  data_atualizacao: string;
  habilidades?: string[];
  idiomas?: Idiomas;
  foto_principal: string;
  fotos?: Foto[];
  videos?: Video[];
  ativo: boolean;
  destaque: boolean;
  autoriza_imagem_site?: boolean;

  //outras tabelas
  endereco?: Endereco;
  dados_bancarios?: DadosBancarios;

  // Dados de naturalidade
  natural_de?: string;
  nacionalidade: string | null;

  // Características físicas
  altura: string;
  peso: string;
  olhos?: string | null;
  cor_cabelo?: string | null;
  manequim?: string;
  sapato?: string;
  terno?: string;
  camisa?: string;
  tipo_cabelo?: string;
  tem_tatuagens?: boolean;
  locais_tatuagens?: string;

  // Documentos
  DRT?: string;
  RG?: string;
  CPF?: string;
  CNPJ?: string;
  CNH?: string;
  PIS?: string;
  tem_passaporte?: boolean;
  passaporte?: string;
  validade_passaporte?: string;
  razao_social?: string;
  inscricao_estadual?: string;
  possui_nota_propria?: boolean;
  possui_exclusividade?: boolean;

  exclusividade_outro_agente?: boolean;
  info_exclusividade?: string;
  aceita_figuracao?: boolean;
  outras_plataformas_busca_elenco?: boolean;
  info_outras_plataformas_descricao?: string;

  //biografia e experiencia
  biografia: string;
  experiencia?: string;

  // Contato
  email?: string;
  celular_whatsapp?: string;
  link_instagram?: string;
  link_imdb?: string;
  website?: string;
  contato_emergencia_nome?: string;
  contato_emergencia_telefone?: string;

  // Habilitação e veículos
  habilitacao_categorias?: string[];
  habilitacao_validade?: string;
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

  async getCategoria(id: string): Promise<Categoria> {
    const response = await api.get<Categoria>(`/api/casting/categorias/${id}/`);
    return response.data;
  },

  async criarCategoria(categoria: Omit<Categoria, 'id'>): Promise<Categoria> {
    const response = await api.post<Categoria>('/api/casting/categorias/', categoria);
    return response.data;
  },

  async getCountPorCategoria(): Promise<
    { categoria: string; nome_categoria: string; count: number }[]
  > {
    const res = await api.get('/api/casting/castings/count-by-categoria/');
    return res.data;
  },

  async atualizarCategoria(
    id: string,
    categoria: Partial<Categoria>,
  ): Promise<Categoria> {
    const response = await api.patch<Categoria>(
      `/api/casting/categorias/${id}/`,
      categoria,
    );
    return response.data;
  },

  async excluirCategoria(id: string): Promise<void> {
    await api.delete(`/api/casting/categorias/${id}/`);
  },

  // Castings
  async getCastings(params?: {
    categoria?: string;
    ativo?: boolean;
    destaque?: boolean;
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

  async getCasting(slugOrId: string): Promise<CastingDetalhado> {
    try {
      // Verificar se o ID é válido
      if (!slugOrId || slugOrId === 'undefined' || slugOrId === 'null') {
        throw new Error('Slug ou ID inválido');
      }

      // Garantir que estamos usando o mesmo formato de URL que funciona em outras chamadas
      const url = '/api/casting/castings/' + slugOrId + '/';

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

  async atualizarCasting(
    slugOrId: string,
    formData: FormData,
  ): Promise<CastingDetalhado> {
    const response = await api.patch<CastingDetalhado>(
      `/api/casting/castings/${slugOrId}/`,
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

  // PATCH - Endereço
  async atualizarEndereco(castingId: string, data: Partial<Endereco>): Promise<Endereco> {
    const response = await api.patch<Endereco>(
      `/api/casting/enderecos/${castingId}/`,
      { casting: castingId, ...data },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return response.data;
  },

  // PATCH - Dados Bancários
  async atualizarDadosBancarios(
    castingId: string,
    data: Partial<DadosBancarios>,
  ): Promise<DadosBancarios> {
    const response = await api.patch<DadosBancarios>(
      `/api/casting/dados-bancarios/${castingId}/`,
      { casting: castingId, ...data },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return response.data;
  },

  // PATCH - Idiomas
  async atualizarIdiomas(castingId: string, data: Partial<Idiomas>): Promise<Idiomas> {
    const response = await api.patch<Idiomas>(
      `/api/casting/idiomas/${castingId}/`,
      { casting: castingId, ...data },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      },
    );
    return response.data;
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

  async excluirFoto(castingId: string, fotoId: string): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/remove-foto/${fotoId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },

  // Vídeos
  async adicionarVideo(castingId: string, video: Omit<Video, 'id'>): Promise<Video> {
    // Obter o token de autenticação
    const token = localStorage.getItem('accessToken');

    // Log para debug
    // eslint-disable-next-line no-console
    console.log(`Enviando vídeo para casting ${castingId}`, video);

    const response = await api.post<Video>(
      `/api/casting/castings/${castingId}/add_video/`,
      video,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  },

  async excluirVideo(castingId: string, videoId: string): Promise<void> {
    await api.delete(`/api/casting/castings/${castingId}/remove-video/${videoId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  },
};
