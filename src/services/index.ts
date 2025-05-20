import { AuthService } from './auth.service';
import { CastingService } from './casting.service';
import { ServicosService } from './servicos.service';
import { BlogService } from './blog.service';
import { ConfiguracoesService } from './configuracoes.service';
import api from './api';

// Exportar tipos
import type { Categoria as CategoriasCasting } from './casting.service';
import type {
  Categoria as CategoriasBlog,
  Tag,
  PostResumido,
  Post,
  PostFiltros,
} from './blog.service';
import type { Configuracoes } from './configuracoes.service';
import type { Servico, ServicoResumido } from './servicos.service';
import {
  Categoria,
  Foto,
  Video,
  Endereco,
  DadosBancarios,
  Idiomas,
  CastingResumido,
  CastingDetalhado,
  PaginatedResponse,
  NivelIdioma,
} from './casting.service';

export {
  AuthService,
  CastingService,
  ServicosService,
  BlogService,
  ConfiguracoesService,
  api,
};

// Exportar tipos
export type {
  NivelIdioma,
  CategoriasCasting,
  CategoriasBlog,
  Tag,
  PostResumido,
  Post,
  PostFiltros,
  Configuracoes,
  Servico,
  ServicoResumido,
  Categoria,
  Foto,
  Video,
  Endereco,
  DadosBancarios,
  Idiomas,
  CastingResumido,
  CastingDetalhado,
  PaginatedResponse,
};
