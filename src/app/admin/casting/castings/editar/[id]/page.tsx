/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Container,
  Title,
  Button,
  Group,
  TextInput,
  Textarea,
  Switch,
  Select,
  Card,
  Text,
  ActionIcon,
  useMantineColorScheme,
  FileInput,
  Tabs,
  Loader,
  NumberInput,
  MultiSelect,
  Divider,
  SimpleGrid,
  Box,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { DateInput } from '@mantine/dates';
import { useDisclosure, useUncontrolled } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../../../../components/AdminNavbar';
import {
  CastingService,
  api,
  type CategoriasCasting,
  type CastingDetalhado,
  type Foto,
  type Video,
  type Funcao,
} from '@/services';
import VideoPreview from '@/components/shared/VideoPreview';
import { notifications } from '@mantine/notifications';
import { corCabelo, errorToast, genderData, habilidades, successToast } from '@/utils';
import { compressImage } from '@/utils/imageCompression';
import {
  etny,
  instrumentos,
  esportes,
  nationality,
  modalidadesCircenses,
  estados,
} from '@/utils/index';

import {
  IconUpload,
  IconPlus,
  IconTrash,
  IconInfoCircle,
  IconBrandInstagram,
  IconBrandYoutube,
  IconMovie,
  IconMail,
  IconPhone,
  IconId,
  IconCreditCard,
  IconAward,
  IconEdit,
  IconUser,
  IconBrandTiktok,
} from '@tabler/icons-react';

import Image from 'next/image';

const habilidadesData = [
  ...(habilidades || []),
  ...(modalidadesCircenses || []),
  ...(esportes || []),
  ...(instrumentos || []),
];

export default function EditarCasting() {
  const params = useParams();
  const id = params?.id as string;

  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [casting, setCasting] = useState<CastingDetalhado | null>(null);

  // Fotos
  const [fotosExistentes, setFotosExistentes] = useState<Foto[]>([]);
  const [fotosParaExcluir, setFotosParaExcluir] = useState<number[]>([]);
  const [fotosAdicionais, setFotosAdicionais] = useState<(File | null)[]>([]);
  const [legendasFotos, setLegendasFotos] = useState<string[]>([]);

  // Vídeos
  const [videosExistentes, setVideosExistentes] = useState<Video[]>([]);
  const [videosParaExcluir, setVideosParaExcluir] = useState<number[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [descricaoVideos, setDescricaoVideos] = useState<string[]>([]);
  const [videosNovos, setVideosNovos] = useState<{ titulo: string; url: string }[]>([]);

  // Estado para os links de trabalho dinâmicos
  const [linksTrabalho, setLinksTrabalho] = useState<string[]>([]);

  // Funções para gerenciar links de trabalho
  const adicionarLinkTrabalho = () => {
    setLinksTrabalho([...linksTrabalho, '']);
  };

  const atualizarLinkTrabalho = (valor: string, index: number) => {
    const novosLinks = [...linksTrabalho];
    novosLinks[index] = valor;
    setLinksTrabalho(novosLinks);
  };

  const removerLinkTrabalho = (index: number) => {
    const novosLinks = [...linksTrabalho];
    novosLinks.splice(index, 1);
    setLinksTrabalho(novosLinks);
  };

  const form = useForm({
    initialValues: {
      // Informações Básicas
      nome: '',
      nome_artistico: '',
      genero: 'masculino',
      categoria: '',
      habilidades: [] as string[],
      natural_de: '',
      nacionalidade: 'Brasileira',
      etnia: '',
      foto_principal: null as File | null,
      ativo: true,
      autoriza_imagem_site: true,

      // Características Físicas
      data_nascimento: null as Date | null,
      ano: new Date().getFullYear() - 20,
      altura: 0,
      peso: 0,
      manequim: 0,
      sapato: 0,
      terno: 0,
      camisa: 0,
      olhos: '',
      tipo_cabelo: '',
      cor_cabelo: '',
      tem_tatuagens: false,
      locais_tatuagens: '',

      // Documentos e Registros
      DRT: '',
      RG: '',
      CPF: '',
      tem_passaporte: false,
      passaporte: '',
      validade_passaporte: '',
      CNH: '',
      CNPJ: '',
      razao_social: '',
      inscricao_estadual: '',
      possui_nota_propria: false,

      // Biografia e Experiência
      biografia: '',
      experiencia: '',
      curriculum_artistico: '',

      // Mídia
      link_trabalho_1: '',
      link_trabalho_2: '',

      // Contato
      email: '',
      telefone_1: '',
      telefone_2: '',
      celular: '',
      whatsapp: '',
      instagram: '',
      imdb: '',
      tiktok: '',
      youtube: '',
      website: '',
      facebook: '',
      twitter: '',
      contato_emergencia_nome: '',
      contato_emergencia_telefone: '',
      emergencia_nome: '',
      emergencia_telefone: '',

      // Endereço e Informações Financeiras
      cep: '',
      rua: '',
      endereco: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil',
      banco: '',
      agencia: '',
      conta: '',
      tipo_conta: '',
      pix: '',

      // Idiomas e Veículos
      idiomas: [] as string[],
      habilitacao_categorias: [] as string[],
      habilitacao_validade: null as Date | null,
    },
    validate: {
      nome: (value) => (value.trim().length === 0 ? 'O nome é obrigatório' : null),
      categoria: (value) => (!value ? 'A categoria é obrigatória' : null),
      altura: (value) => (!value ? 'A altura é obrigatória' : null),
      peso: (value) => (!value ? 'O peso é obrigatório' : null),
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Link, TextAlign, Highlight, Underline],
    onUpdate: ({ editor }) =>
      form.getInputProps('experiencia').onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[150px]', // ou qualquer classe Tailwind para altura inicial
      },
    },
  });

  const dadosCarregados = useRef(false);

  // Carregar dados iniciais (categorias, funções, etc.)
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const categoriasData = await CastingService.getCategorias({ ordering: 'nome' });
        setCategorias(categoriasData.results || []);
      } catch (error) {
        console.error('Falha ao carregar dados iniciais:', error);
        notifications.show({
          title: 'Erro',
          message: 'Falha ao carregar dados iniciais. Tente novamente mais tarde.',
          color: 'red',
        });
      }
    };

    carregarCategorias();
  }, []);

  useEffect(() => {
    const carregarDados = async () => {
      if (!isAuthenticated || !id || dadosCarregados.current) return;

      try {
        setIsLoading(true);
        dadosCarregados.current = true;

        const castingResponse = await CastingService.getCasting(id);
        setCasting(castingResponse);
        setFotosExistentes(castingResponse.fotos || []);
        setVideosExistentes(castingResponse.videos || []);

        // Links de trabalho
        const linksDeTrabalho = [];
        if (castingResponse.link_trabalho_1)
          linksDeTrabalho.push(castingResponse.link_trabalho_1);
        if (castingResponse.link_trabalho_2)
          linksDeTrabalho.push(castingResponse.link_trabalho_2);
        if (castingResponse.link_trabalho_3)
          linksDeTrabalho.push(castingResponse.link_trabalho_3);
        if (castingResponse.link_trabalho_4)
          linksDeTrabalho.push(castingResponse.link_trabalho_4);
        if (castingResponse.link_trabalho_5)
          linksDeTrabalho.push(castingResponse.link_trabalho_5);
        if (castingResponse.link_trabalho_6)
          linksDeTrabalho.push(castingResponse.link_trabalho_6);
        if (castingResponse.link_trabalho_7)
          linksDeTrabalho.push(castingResponse.link_trabalho_7);

        while (linksDeTrabalho.length < 2) linksDeTrabalho.push('');
        setLinksTrabalho(linksDeTrabalho);

        const dataNascimento = castingResponse.data_nascimento
          ? new Date(castingResponse.data_nascimento)
          : null;

        const habilitacaoValidade = castingResponse.habilitacao_validade
          ? new Date(castingResponse.habilitacao_validade)
          : null;

        form.setValues({
          nome: castingResponse.nome || '',
          nome_artistico: castingResponse.nome_artistico || '',
          genero: castingResponse.genero || 'masculino',
          categoria:
            Array.isArray(castingResponse.categoria) &&
            castingResponse.categoria.length > 0
              ? String(castingResponse.categoria[0])
              : castingResponse.categoria
                ? String(castingResponse.categoria)
                : '',

          // 🔧 Corrigido: habilidades agora faz parse corretamente
          habilidades: (() => {
            try {
              if (
                Array.isArray(castingResponse.habilidades) &&
                castingResponse.habilidades.length > 0
              ) {
                return JSON.parse(castingResponse.habilidades[0]);
              }
            } catch (e) {
              console.warn('Erro ao fazer parse de habilidades:', e);
            }
            return [];
          })(),

          natural_de: castingResponse.natural_de || '',
          nacionalidade: castingResponse.nacionalidade || 'Brasileira',
          etnia: castingResponse.etnia || '',
          foto_principal: null,
          ativo: castingResponse.ativo ?? true,
          autoriza_imagem_site: castingResponse.autoriza_imagem_site ?? true,

          data_nascimento: dataNascimento,
          ano: castingResponse.ano
            ? Number(castingResponse.ano)
            : new Date().getFullYear() - 20,
          altura: castingResponse.altura ? Number(castingResponse.altura) || 0 : 0,
          peso: castingResponse.peso ? Number(castingResponse.peso) || 0 : 0,
          manequim: castingResponse.manequim ? Number(castingResponse.manequim) || 0 : 0,
          sapato: castingResponse.sapato ? Number(castingResponse.sapato) || 0 : 0,
          terno: castingResponse.terno ? Number(castingResponse.terno) || 0 : 0,
          camisa: castingResponse.camisa ? Number(castingResponse.camisa) || 0 : 0,
          olhos: castingResponse.olhos || '',
          tipo_cabelo: castingResponse.tipo_cabelo || '',
          cor_cabelo: castingResponse.cor_cabelo || '',
          tem_tatuagens: castingResponse.tem_tatuagens || false,
          locais_tatuagens: castingResponse.locais_tatuagens || '',

          DRT: castingResponse.DRT || '',
          RG: castingResponse.RG || '',
          CPF: castingResponse.CPF || '',
          tem_passaporte: castingResponse.tem_passaporte || false,
          passaporte: castingResponse.passaporte || '',
          validade_passaporte: castingResponse.validade_passaporte || '',

          biografia: castingResponse.biografia || '',
          experiencia: castingResponse.experiencia || '',

          link_trabalho_1: castingResponse.link_trabalho_1 || '',
          link_trabalho_2: castingResponse.link_trabalho_2 || '',

          email: castingResponse.email || '',
          telefone_1: castingResponse.telefone_1 || '',
          telefone_2: castingResponse.telefone_2 || '',
          instagram: castingResponse.link_instagram || '',
          imdb: castingResponse.link_imdb || '',
          contato_emergencia_nome: castingResponse.contato_emergencia_nome || '',
          contato_emergencia_telefone: castingResponse.contato_emergencia_telefone || '',

          cep: castingResponse.cep || '',
          endereco: castingResponse.endereco || '',
          numero: castingResponse.numero || '',
          complemento: castingResponse.complemento || '',
          bairro: castingResponse.bairro || '',
          cidade: castingResponse.cidade || '',
          estado: castingResponse.estado || '',
          banco: castingResponse.banco || '',
          agencia: castingResponse.agencia || '',
          conta: castingResponse.conta || '',
          tipo_conta: castingResponse.tipo_conta || '',
          pix: castingResponse.pix || '',

          idiomas: (castingResponse.idiomas as []) || [],
          habilitacao_categorias: castingResponse.habilitacao_categorias || [],
          habilitacao_validade: habilitacaoValidade,
        });
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        errorToast('Erro ao carregar dados do casting');
        router.push('/admin/casting');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      carregarDados();
    }
  }, [isAuthenticated, id, form, router, editor]);

  useEffect(() => {
    if (editor && casting?.experiencia && !editor.isDestroyed) {
      editor.commands.setContent(casting.experiencia);
    }
  }, [editor, casting?.experiencia]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Funções para gerenciar fotos existentes
  const marcarFotoParaExcluir = (id: number) => {
    setFotosParaExcluir([...fotosParaExcluir, id]);
    setFotosExistentes(fotosExistentes.filter((foto) => foto.id !== id));
  };

  // Funções para gerenciar fotos adicionais
  const adicionarFoto = () => {
    setFotosAdicionais([...fotosAdicionais, null as unknown as File]);
    setLegendasFotos([...legendasFotos, '']);
  };

  const removerFoto = (index: number) => {
    const novasFotos = [...fotosAdicionais];
    const novasLegendas = [...legendasFotos];

    novasFotos.splice(index, 1);
    novasLegendas.splice(index, 1);

    setFotosAdicionais(novasFotos);
    setLegendasFotos(novasLegendas);
  };

  const atualizarFoto = (file: File | null, index: number) => {
    if (!file) return;

    const novasFotos = [...fotosAdicionais];
    novasFotos[index] = file;
    setFotosAdicionais(novasFotos);
  };

  const atualizarLegenda = (legenda: string, index: number) => {
    const novasLegendas = [...legendasFotos];
    novasLegendas[index] = legenda;
    setLegendasFotos(novasLegendas);
  };

  // Funções para gerenciar vídeos existentes
  const marcarVideoParaExcluir = (id: number) => {
    setVideosParaExcluir([...videosParaExcluir, id]);
    setVideosExistentes(videosExistentes.filter((video) => video.id !== id));
  };

  // Funções para gerenciar vídeos novos
  const adicionarVideo = () => {
    setVideosNovos([...videosNovos, { titulo: '', url: '' }]);
  };

  const removerVideo = (index: number) => {
    const novosVideos = [...videosNovos];
    novosVideos.splice(index, 1);
    setVideosNovos(novosVideos);
  };

  const atualizarVideo = (campo: 'titulo' | 'url', valor: string, index: number) => {
    const novosVideos = [...videosNovos];
    novosVideos[index] = { ...novosVideos[index], [campo]: valor };
    setVideosNovos(novosVideos);
  };

  // Funções para gerenciar vídeos novos
  const adicionarVideoNovo = () => {
    setVideos([...videos, '']);
    setDescricaoVideos([...descricaoVideos, '']);
  };

  const removerVideoNovo = (index: number) => {
    const novosVideos = [...videos];
    novosVideos.splice(index, 1);
    setVideos(novosVideos);

    const novasDescricoes = [...descricaoVideos];
    novasDescricoes.splice(index, 1);
    setDescricaoVideos(novasDescricoes);
  };

  const atualizarVideoNovo = (valor: string, index: number) => {
    const novosVideos = [...videos];
    novosVideos[index] = valor;
    setVideos(novosVideos);
  };

  const atualizarDescricaoVideoNovo = (valor: string, index: number) => {
    const novasDescricoes = [...descricaoVideos];
    novasDescricoes[index] = valor;
    setDescricaoVideos(novasDescricoes);
  };

  // Função para salvar as alterações
  const handleSubmit = async (values: typeof form.values) => {
    if (!casting) return;

    try {
      setIsSubmitting(true);
      console.log('Iniciando atualização de casting com valores:', values);

      // Comprimir a foto principal se existir
      if (values.foto_principal) {
        try {
          const compressedImage = await compressImage(values.foto_principal, {
            maxSizeMB: 0.8, // 1200KB
            maxWidthOrHeight: 1280,
          });
          values.foto_principal = compressedImage;
        } catch (compressionError) {
          console.warn('Erro ao comprimir a foto principal:', compressionError);
          // Continua com a foto original se houver erro na compressão
        }
      }

      // Comprimir fotos adicionais se existirem
      const compressedFotos: (File | null)[] = [...fotosAdicionais];
      for (let i = 0; i < compressedFotos.length; i++) {
        if (compressedFotos[i]) {
          try {
            compressedFotos[i] = await compressImage(compressedFotos[i] as File, {
              maxSizeMB: 0.8, // 1000kb
              maxWidthOrHeight: 1280,
            });
          } catch (compressionError) {
            console.warn(`Erro ao comprimir a foto adicional ${i}:`, compressionError);
            // Continua com a foto original se houver erro na compressão
          }
        }
      }

      // Criar FormData para envio de arquivos
      const formData = new FormData();

      // Adicionar campos básicos
      formData.append('nome', values.nome);
      if (values.nome_artistico) formData.append('nome_artistico', values.nome_artistico);
      formData.append('genero', values.genero || 'masculino');
      formData.append('categoria', values.categoria);

      // Naturalidade e informações de origem
      if (values.natural_de) formData.append('natural_de', values.natural_de);
      if (values.nacionalidade) formData.append('nacionalidade', values.nacionalidade);
      if (values.etnia) formData.append('etnia', values.etnia);

      // Data de nascimento e ano
      if (values.data_nascimento) {
        formData.append(
          'data_nascimento',
          values.data_nascimento instanceof Date
            ? values.data_nascimento.toISOString().split('T')[0]
            : values.data_nascimento,
        );
      }
      if (values.ano) formData.append('ano', String(values.ano));

      // Características físicas
      if (values.altura) formData.append('altura', String(values.altura));
      if (values.peso) formData.append('peso', String(values.peso));
      if (values.manequim !== undefined)
        formData.append('manequim', String(values.manequim));
      if (values.sapato !== undefined) formData.append('sapato', String(values.sapato));
      if (values.olhos) formData.append('olhos', values.olhos);
      if (values.tipo_cabelo) formData.append('tipo_cabelo', values.tipo_cabelo);
      if (values.cor_cabelo) formData.append('cor_cabelo', values.cor_cabelo);
      if (values.terno !== undefined) formData.append('terno', String(values.terno));
      if (values.camisa !== undefined) formData.append('camisa', String(values.camisa));

      // Tatuagens
      formData.append('tem_tatuagens', values.tem_tatuagens ? 'true' : 'false');
      if (values.locais_tatuagens)
        formData.append('locais_tatuagens', values.locais_tatuagens);

      // Documentos
      if (values.DRT) formData.append('DRT', values.DRT);
      if (values.RG) formData.append('RG', values.RG);
      if (values.CPF) formData.append('CPF', values.CPF);
      formData.append('tem_passaporte', values.tem_passaporte ? 'true' : 'false');
      if (values.CNPJ) formData.append('CNPJ', values.CNPJ);
      if (values.razao_social) formData.append('razao_social', values.razao_social);
      if (values.inscricao_estadual)
        formData.append('inscricao_estadual', values.inscricao_estadual);
      formData.append(
        'possui_nota_propria',
        values.possui_nota_propria ? 'true' : 'false',
      );
      if (values.CNH) formData.append('CNH', values.CNH);

      // Currículo e habilidades
      if (values.habilidades)
        formData.append('habilidades', JSON.stringify(values.habilidades));

      // Links de mídia
      if (values.link_trabalho_1)
        formData.append('link_trabalho_1', values.link_trabalho_1);
      if (values.link_trabalho_2)
        formData.append('link_trabalho_2', values.link_trabalho_2);

      // Links de trabalho adicionais
      linksTrabalho.forEach((link, index) => {
        if (index >= 2 && link) {
          // A partir do link 3 (índice 2)
          formData.append(`link_trabalho_${index + 1}`, link);
        }
      });

      // Contato
      if (values.telefone_1) formData.append('telefone_1', values.telefone_1);
      if (values.celular) formData.append('celular', values.celular);
      if (values.whatsapp) formData.append('whatsapp', values.whatsapp);
      if (values.email) formData.append('email', values.email);
      if (values.instagram) formData.append('instagram', values.instagram);
      if (values.tiktok) formData.append('tiktok', values.tiktok);
      if (values.youtube) formData.append('youtube', values.youtube);
      if (values.website) formData.append('website', values.website);
      if (values.facebook) formData.append('facebook', values.facebook);
      if (values.twitter) formData.append('twitter', values.twitter);
      if (values.emergencia_nome)
        formData.append('emergencia_nome', values.emergencia_nome);
      if (values.emergencia_telefone)
        formData.append('emergencia_telefone', values.emergencia_telefone);

      // Endereço
      if (values.cep) formData.append('cep', values.cep);
      if (values.rua) formData.append('rua', values.rua);
      if (values.numero) formData.append('numero', values.numero);
      if (values.complemento) formData.append('complemento', values.complemento);
      if (values.bairro) formData.append('bairro', values.bairro);
      if (values.cidade) formData.append('cidade', values.cidade);
      if (values.estado) formData.append('estado', values.estado);
      if (values.pais) formData.append('pais', values.pais);

      // Informações bancárias
      if (values.banco) formData.append('banco', values.banco);
      if (values.agencia) formData.append('agencia', values.agencia);
      if (values.conta) formData.append('conta', values.conta);
      if (values.tipo_conta) formData.append('tipo_conta', values.tipo_conta);
      if (values.pix) formData.append('pix', values.pix);

      // Idiomas e veículos
      if (values.idiomas) formData.append('idiomas', JSON.stringify(values.idiomas));
      if (values.habilitacao_categorias)
        formData.append(
          'habilitacao_categorias',
          JSON.stringify(values.habilitacao_categorias),
        );
      if (values.habilitacao_validade) {
        formData.append(
          'habilitacao_validade',
          values.habilitacao_validade instanceof Date
            ? values.habilitacao_validade.toISOString().split('T')[0]
            : values.habilitacao_validade,
        );
      }

      // Adicionar biografia - campos obrigatórios
      formData.append('biografia', values.biografia || '');
      formData.append('experiencia', editor ? editor.getHTML() : '');

      // Adicionar campos booleanos
      formData.append('ativo', values.ativo ? 'true' : 'false');
      formData.append(
        'autoriza_imagem_site',
        values.autoriza_imagem_site ? 'true' : 'false',
      );

      // Adicionar foto principal se existir
      if (values.foto_principal) {
        formData.append('foto_principal', values.foto_principal);
      }

      // Atualizar o casting
      await CastingService.atualizarCasting(String(casting.id), formData);

      // Excluir fotos marcadas para exclusão
      const excluirFotosPromises = fotosParaExcluir.map((id) =>
        CastingService.excluirFoto(String(casting.id), id),
      );

      await Promise.all(excluirFotosPromises);

      // Adicionar novas fotos
      const uploadFotosPromises = fotosAdicionais.map(async (foto, index) => {
        if (!foto) return null;

        const fotoFormData = new FormData();
        fotoFormData.append('imagem', foto);
        fotoFormData.append('legenda', legendasFotos[index] || '');
        fotoFormData.append('ordem', (fotosExistentes.length + index).toString());

        return CastingService.adicionarFoto(String(casting.id), fotoFormData);
      });

      await Promise.all(uploadFotosPromises.filter(Boolean));

      // Excluir vídeos marcados para exclusão
      const excluirVideosPromises = videosParaExcluir.map((id) =>
        CastingService.excluirVideo(String(casting.id), id),
      );

      await Promise.all(excluirVideosPromises);

      // Adicionar novos vídeos
      const uploadVideosPromises = videosNovos.map(async (video, index) => {
        if (!video.titulo || !video.url) return null;

        return CastingService.adicionarVideo(casting.id, {
          titulo: video.titulo,
          url: video.url,
          ordem: videosExistentes.length + index,
        });
      });

      await Promise.all(uploadVideosPromises.filter(Boolean));

      successToast('Casting atualizado com sucesso');
      router.push('/admin/casting');
    } catch (error) {
      console.error('Erro ao atualizar casting:', error);
      errorToast('Erro ao atualizar casting');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Loader size="xl" />
      </div>
    );
  }

  if (!isAuthenticated || !casting) {
    return null;
  }

  return (
    <>
      <AdminNavbar />
      <Container size="lg" py="xl">
        <Group position="apart" mb="xl">
          <Title order={2}>Editar Casting</Title>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Tabs defaultValue="informacoes-basicas" mb="xl">
            <Tabs.List mb="md">
              <Tabs.Tab value="informacoes-basicas" icon={<IconUser size={14} />}>
                Informações Básicas
              </Tabs.Tab>
              <Tabs.Tab value="caracteristicas" icon={<IconInfoCircle size={14} />}>
                Características
              </Tabs.Tab>
              <Tabs.Tab value="documentos" icon={<IconId size={14} />}>
                Documentos
              </Tabs.Tab>
              <Tabs.Tab value="habilidades" icon={<IconAward size={14} />}>
                Habilidades
              </Tabs.Tab>
              <Tabs.Tab value="midia" icon={<IconMovie size={14} />}>
                Mídia
              </Tabs.Tab>
              <Tabs.Tab value="contato" icon={<IconMail size={14} />}>
                Contato
              </Tabs.Tab>
              <Tabs.Tab value="endereco" icon={<IconCreditCard size={14} />}>
                Endereço e Finanças
              </Tabs.Tab>
              <Tabs.Tab value="idiomas-veiculos" icon={<IconEdit size={14} />}>
                Idiomas e Veículos
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="informacoes-basicas">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Informações Básicas
                </Title>

                <SimpleGrid cols={3}>
                  <TextInput
                    label="Nome"
                    placeholder="Nome completo"
                    required
                    {...form.getInputProps('nome')}
                  />

                  <TextInput
                    label="Nome Artístico"
                    placeholder="Nome artístico"
                    {...form.getInputProps('nome_artistico')}
                  />

                  <Select
                    label="Categoria"
                    placeholder="Selecione uma categoria"
                    data={categorias.map((cat) => ({
                      value: cat.id.toString(),
                      label: cat.nome,
                    }))}
                    required
                    {...form.getInputProps('categoria')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3}>
                  <Select
                    label="Gênero"
                    placeholder="Selecione o gênero"
                    data={genderData}
                    {...form.getInputProps('genero')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <MultiSelect
                  label="Habilidades"
                  searchable
                  clearable
                  placeholder="Selecione uma ou mais habilidades"
                  data={habilidadesData}
                  {...form.getInputProps('habilidades')}
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <SimpleGrid cols={3}>
                  <TextInput
                    label="Naturalidade"
                    placeholder="Natural de (município/estado)"
                    {...form.getInputProps('natural_de')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <Select
                    label="Nacionalidade"
                    searchable
                    placeholder="Nacionalidade"
                    nothingFound="Não encontrado"
                    clearable
                    data={nationality}
                    {...form.getInputProps('nacionalidade')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <Select
                    label="Etnia"
                    placeholder="Selecione a etnia"
                    data={etny}
                    {...form.getInputProps('etnia')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <Group align="flex-start" mb="md">
                  <div style={{ flex: 1 }}>
                    <FileInput
                      label="Foto Principal"
                      description="Selecione uma nova imagem para substituir a atual"
                      accept="image/png,image/jpeg,image/webp"
                      icon={<IconUpload size={14} />}
                      {...form.getInputProps('foto_principal')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                  </div>

                  {casting.foto_principal && (
                    <div>
                      <Text size="sm" weight={500} mb={5}>
                        Foto Atual
                      </Text>
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '4px',
                        }}
                      >
                        <Image
                          src={casting.foto_principal}
                          alt={casting.nome}
                          style={{ objectFit: 'cover' }}
                          fill
                          sizes="100px"
                        />
                      </div>
                    </div>
                  )}
                </Group>

                <Switch
                  label="Ativo"
                  {...form.getInputProps('ativo', { type: 'checkbox' })}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <Switch
                  label="Autoriza imagem no site"
                  {...form.getInputProps('autoriza_imagem_site', { type: 'checkbox' })}
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="caracteristicas">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Características Físicas
                </Title>

                <SimpleGrid cols={3} mb="md">
                  <DateInput
                    label="Data de Nascimento"
                    placeholder="Selecione a data"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps('data_nascimento')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    popoverProps={{
                      zIndex: 9999,
                      withinPortal: true,
                    }}
                  />

                  <NumberInput
                    label="Altura (em metros)"
                    placeholder="Ex: 1.75"
                    precision={2}
                    min={0.5}
                    max={2.5}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    step={0.01}
                    {...form.getInputProps('altura')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <NumberInput
                    label="Peso (em kg)"
                    placeholder="Ex: 70"
                    precision={1}
                    min={20}
                    max={200}
                    {...form.getInputProps('peso')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <NumberInput
                    label="Manequim"
                    placeholder="Tamanho do manequim"
                    {...form.getInputProps('manequim')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <NumberInput
                    label="Sapato"
                    placeholder="Número do sapato"
                    {...form.getInputProps('sapato')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <NumberInput
                    label="Terno"
                    placeholder="Tamanho do terno"
                    {...form.getInputProps('terno')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <NumberInput
                    label="Camisa"
                    placeholder="Tamanho da camisa"
                    {...form.getInputProps('camisa')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <Select
                    label="Cor dos Olhos"
                    placeholder="Selecione a cor dos olhos"
                    data={[
                      { value: 'castanho', label: 'Castanho' },
                      { value: 'azul', label: 'Azul' },
                      { value: 'verde', label: 'Verde' },
                      { value: 'preto', label: 'Preto' },
                      { value: 'mel', label: 'Mel' },
                      { value: 'cinza', label: 'Cinza' },
                      { value: 'castanho_esverdeado', label: 'Castanho Esverdeado' },
                    ]}
                    {...form.getInputProps('olhos')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <Select
                    label="Tipo de Cabelo"
                    placeholder="Selecione o tipo de cabelo"
                    data={[
                      { value: 'liso', label: 'Liso' },
                      { value: 'ondulado', label: 'Ondulado' },
                      { value: 'cacheado', label: 'Cacheado' },
                      { value: 'crespo', label: 'Crespo' },
                      { value: 'careca', label: 'Careca' },
                      { value: 'outro', label: 'Outro' },
                    ]}
                    {...form.getInputProps('tipo_cabelo')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <Select
                    label="Cor do Cabelo"
                    placeholder="Selecione a cor do cabelo"
                    data={corCabelo}
                    {...form.getInputProps('cor_cabelo')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <Switch
                  label="Possui Tatuagens"
                  {...form.getInputProps('tem_tatuagens', { type: 'checkbox' })}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                {form.values.tem_tatuagens && (
                  <Textarea
                    label="Locais das Tatuagens"
                    placeholder="Descreva onde estão localizadas as tatuagens"
                    {...form.getInputProps('locais_tatuagens')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                )}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="documentos">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Documentos e Registros Profissionais
                </Title>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="DRT"
                    placeholder="Número do DRT e Estado de emissão"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('DRT')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="RG"
                    placeholder="Número do RG"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('RG')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="CPF"
                    placeholder="Número do CPF"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('CPF')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <Group align="center">
                    <Switch
                      label="Possui Passaporte"
                      {...form.getInputProps('tem_passaporte', { type: 'checkbox' })}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                  </Group>
                  <TextInput
                    label="Número do Passaporte"
                    placeholder="Número do passaporte"
                    {...form.getInputProps('passaporte')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <DateInput
                    label="Validade do Passaporte"
                    placeholder="Selecione a data"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps('validade_passaporte')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    popoverProps={{
                      zIndex: 9999,
                      withinPortal: true,
                    }}
                  />
                </SimpleGrid>

                <Divider
                  my="md"
                  label="Informações para Nota Fiscal"
                  labelPosition="center"
                />

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="CNPJ"
                    placeholder="Número do CNPJ"
                    icon={<IconCreditCard size={14} />}
                    {...form.getInputProps('CNPJ')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Email"
                    placeholder="Email de contato"
                    {...form.getInputProps('email')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <TextInput
                  label="Telefone"
                  placeholder="(00) 0000-0000"
                  {...form.getInputProps('telefone_1')}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="habilidades">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Sobre e Experiências
                </Title>

                <Textarea
                  label="Sobre"
                  placeholder="Sobre o casting"
                  minRows={4}
                  {...form.getInputProps('biografia')}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <Text size="sm" fw={500} mb="xs">
                  Experiências
                </Text>
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold ref={undefined} />
                      <RichTextEditor.Italic ref={undefined} />
                      <RichTextEditor.Underline ref={undefined} />
                      <RichTextEditor.Strikethrough ref={undefined} />
                      <RichTextEditor.ClearFormatting ref={undefined} />
                      <RichTextEditor.Highlight ref={undefined} />
                      <RichTextEditor.Code ref={undefined} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 ref={undefined} />
                      <RichTextEditor.H2 ref={undefined} />
                      <RichTextEditor.H3 ref={undefined} />
                      <RichTextEditor.H4 ref={undefined} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Hr ref={undefined} />
                      <RichTextEditor.BulletList ref={undefined} />
                      <RichTextEditor.OrderedList ref={undefined} />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link ref={undefined} />
                      <RichTextEditor.Unlink ref={undefined} />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content />
                </RichTextEditor>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="midia">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Group position="apart" mb="lg">
                  <Title order={3}>Fotos</Title>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    variant="outline"
                    onClick={adicionarFoto}
                    styles={{
                      root: {
                        borderColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                        color: isDark ? '#9333ea !important' : '#7e22ce !important',
                      },
                    }}
                  >
                    Adicionar Foto
                  </Button>
                </Group>

                {/* Fotos existentes */}
                {fotosExistentes.length > 0 && (
                  <>
                    <Title order={4} mb="md">
                      Fotos Existentes
                    </Title>
                    <Group mb="xl">
                      {fotosExistentes.map((foto) => (
                        <Card
                          key={foto.id}
                          withBorder
                          p="md"
                          radius="md"
                          style={{ width: 200 }}
                        >
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                width: '100%',
                                height: 150,
                                position: 'relative',
                                overflow: 'hidden',
                                borderRadius: '4px',
                                marginBottom: 10,
                              }}
                            >
                              <Image
                                src={foto.imagem}
                                alt={foto.legenda || 'Foto do casting'}
                                style={{ objectFit: 'cover' }}
                                fill
                                sizes="200px"
                              />
                            </div>
                            <ActionIcon
                              color="red"
                              style={{
                                position: 'absolute',
                                top: 5,
                                right: 5,
                                backgroundColor: 'rgba(255,255,255,0.8)',
                              }}
                              onClick={() => marcarFotoParaExcluir(foto.id)}
                            >
                              <IconTrash size={16} />
                            </ActionIcon>
                          </div>
                          <Text size="sm" align="center">
                            {foto.legenda || 'Sem legenda'}
                          </Text>
                        </Card>
                      ))}
                    </Group>
                  </>
                )}

                {/* Novas fotos */}
                {fotosAdicionais.length > 0 && (
                  <>
                    <Title order={4} mb="md">
                      Novas Fotos
                    </Title>
                    {fotosAdicionais.map((foto, index) => (
                      <Card key={index} withBorder p="md" radius="md" mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={500}>Foto Nova {index + 1}</Text>
                          <ActionIcon color="red" onClick={() => removerFoto(index)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>

                        <FileInput
                          label="Imagem"
                          description="Selecione uma imagem"
                          accept="image/png,image/jpeg,image/webp"
                          icon={<IconUpload size={14} />}
                          value={foto}
                          onChange={(file) => atualizarFoto(file, index)}
                          mb="md"
                        />

                        <TextInput
                          label="Legenda"
                          placeholder="Legenda da foto"
                          value={legendasFotos[index] || ''}
                          onChange={(e) => atualizarLegenda(e.target.value, index)}
                        />
                      </Card>
                    ))}
                  </>
                )}

                {fotosExistentes.length === 0 && fotosAdicionais.length === 0 && (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhuma foto adicionada. Clique em &quot;Adicionar Foto&quot; para
                    incluir fotos.
                  </Text>
                )}
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Group position="apart" mb="lg">
                  <Title order={3}>Vídeos</Title>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    variant="outline"
                    onClick={adicionarVideo}
                    styles={{
                      root: {
                        borderColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                        color: isDark ? '#9333ea !important' : '#7e22ce !important',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      },
                    }}
                  >
                    Adicionar Vídeo
                  </Button>
                </Group>

                {/* Vídeos existentes */}
                {videosExistentes.length > 0 && (
                  <>
                    <Title order={4} mb="md">
                      Vídeos Existentes
                    </Title>
                    {videosExistentes.map((video) => (
                      <Card key={video.id} withBorder p="md" radius="md" mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={500}>{video.titulo}</Text>
                          <ActionIcon
                            color="red"
                            onClick={() => marcarVideoParaExcluir(video.id)}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                        <Text
                          component="a"
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          color="blue"
                        >
                          {video.url}
                        </Text>
                      </Card>
                    ))}
                  </>
                )}

                {/* Novos vídeos */}
                {videosNovos.length > 0 && (
                  <>
                    <Title order={4} mb="md">
                      Novos Vídeos
                    </Title>
                    {videosNovos.map((video, index) => (
                      <Card key={index} withBorder p="md" radius="md" mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={500}>Vídeo Novo {index + 1}</Text>
                          <ActionIcon color="red" onClick={() => removerVideo(index)}>
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>

                        <TextInput
                          label="Título"
                          placeholder="Título do vídeo"
                          value={video.titulo}
                          onChange={(e) =>
                            atualizarVideo('titulo', e.target.value, index)
                          }
                          mb="md"
                        />

                        <TextInput
                          label="URL"
                          placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                          value={video.url}
                          onChange={(e) => atualizarVideo('url', e.target.value, index)}
                        />
                      </Card>
                    ))}
                  </>
                )}

                {videosExistentes.length === 0 && videosNovos.length === 0 && (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhum vídeo adicionado. Clique em &quot;Adicionar Vídeo&quot; para
                    incluir vídeos.
                  </Text>
                )}
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Group position="apart" mb="lg">
                  <Title order={3}>Links de Trabalho</Title>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    variant="outline"
                    onClick={adicionarLinkTrabalho}
                    styles={{
                      root: {
                        borderColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                        color: isDark ? '#9333ea !important' : '#7e22ce !important',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        },
                      },
                    }}
                  >
                    Adicionar Link
                  </Button>
                </Group>

                <TextInput
                  label="Link de Trabalho 1"
                  placeholder="https://exemplo.com"
                  {...form.getInputProps('link_trabalho_1')}
                  mb="md"
                />

                <TextInput
                  label="Link de Trabalho 2"
                  placeholder="https://exemplo.com"
                  {...form.getInputProps('link_trabalho_2')}
                  mb="md"
                />

                {linksTrabalho.map((link, index) => (
                  <div key={index} style={{ position: 'relative', marginBottom: '15px' }}>
                    <TextInput
                      label={`Link de Trabalho ${index + 3}`}
                      placeholder="https://exemplo.com"
                      value={link}
                      onChange={(e) => atualizarLinkTrabalho(e.target.value, index)}
                      rightSection={
                        <ActionIcon
                          color="red"
                          onClick={() => removerLinkTrabalho(index)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      }
                    />
                  </div>
                ))}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="contato">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Informações de Contato
                </Title>

                <TextInput
                  icon={<IconMail size={16} />}
                  label="E-mail"
                  placeholder="E-mail de contato"
                  type="email"
                  {...form.getInputProps('email')}
                  mb="md"
                />

                <TextInput
                  icon={<IconPhone size={16} />}
                  label="Telefone"
                  placeholder="(00) 0000-0000"
                  {...form.getInputProps('telefone_1')}
                  mb="md"
                />

                <TextInput
                  label="Telefone 2"
                  placeholder="(00) 00000-0000"
                  icon={<IconPhone size={16} />}
                  {...form.getInputProps('telefone_2')}
                  mb="md"
                />
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Redes Sociais
                </Title>

                <TextInput
                  label="Instagram"
                  placeholder="@usuario"
                  icon={<IconBrandInstagram size={16} />}
                  {...form.getInputProps('instagram')}
                  mb="md"
                />

                <TextInput
                  label="TikTok"
                  placeholder="@usuario"
                  icon={<IconBrandTiktok size={16} />}
                  {...form.getInputProps('tiktok')}
                  mb="md"
                />

                <TextInput
                  label="YouTube"
                  placeholder="URL do canal ou usuário"
                  icon={<IconBrandYoutube size={16} />}
                  {...form.getInputProps('youtube')}
                  mb="md"
                />

                <TextInput
                  label="Facebook"
                  placeholder="@usuario"
                  icon={<IconBrandInstagram size={16} />}
                  {...form.getInputProps('facebook')}
                  mb="md"
                />

                <TextInput
                  label="Twitter"
                  placeholder="@usuario"
                  icon={<IconBrandInstagram size={16} />}
                  {...form.getInputProps('twitter')}
                  mb="md"
                />
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Contato de Emergência
                </Title>

                <TextInput
                  label="Nome"
                  placeholder="Nome da pessoa para contato"
                  icon={<IconUser size={16} />}
                  {...form.getInputProps('contato_emergencia_nome')}
                  mb="md"
                />

                <TextInput
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  icon={<IconPhone size={16} />}
                  {...form.getInputProps('contato_emergencia_telefone')}
                  mb="md"
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="endereco">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Endereço
                </Title>

                <TextInput
                  label="CEP"
                  placeholder="00000-000"
                  {...form.getInputProps('cep')}
                  mb="md"
                />

                <SimpleGrid cols={2} spacing="md" mb="md">
                  <TextInput
                    label="Endereço"
                    placeholder="Rua, Avenida, etc."
                    {...form.getInputProps('endereco')}
                  />

                  <TextInput
                    label="Número"
                    placeholder="123"
                    {...form.getInputProps('numero')}
                  />
                </SimpleGrid>

                <TextInput
                  label="Complemento"
                  placeholder="Apto, Bloco, etc."
                  {...form.getInputProps('complemento')}
                  mb="md"
                />

                <SimpleGrid cols={2} spacing="md" mb="md">
                  <TextInput
                    label="Bairro"
                    placeholder="Bairro"
                    {...form.getInputProps('bairro')}
                  />

                  <TextInput
                    label="Cidade"
                    placeholder="Cidade"
                    {...form.getInputProps('cidade')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} spacing="md">
                  <Select
                    label="Estado"
                    placeholder="Selecione o estado"
                    data={estados}
                    searchable
                    {...form.getInputProps('estado')}
                  />

                  <TextInput label="País" placeholder="País" value="Brasil" disabled />
                </SimpleGrid>
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Informações Bancárias
                </Title>

                <TextInput
                  label="Banco"
                  placeholder="Nome do banco"
                  {...form.getInputProps('banco')}
                  mb="md"
                />

                <SimpleGrid cols={2} spacing="md" mb="md">
                  <TextInput
                    label="Agência"
                    placeholder="Número da agência"
                    {...form.getInputProps('agencia')}
                  />

                  <TextInput
                    label="Conta"
                    placeholder="Número da conta"
                    {...form.getInputProps('conta')}
                  />
                </SimpleGrid>

                <Select
                  label="Tipo de Conta"
                  placeholder="Selecione o tipo de conta"
                  data={[
                    { value: 'corrente', label: 'Corrente' },
                    { value: 'poupanca', label: 'Poupança' },
                  ]}
                  {...form.getInputProps('tipo_conta')}
                  mb="md"
                />

                <TextInput
                  label="Chave PIX"
                  placeholder="CPF, telefone, email ou chave aleatória"
                  {...form.getInputProps('pix')}
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="idiomas-veiculos">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Idiomas
                </Title>

                <MultiSelect
                  label="Idiomas"
                  placeholder="Selecione os idiomas"
                  data={[
                    { value: 'portugues', label: 'Português' },
                    { value: 'ingles', label: 'Inglês' },
                    { value: 'espanhol', label: 'Espanhol' },
                    { value: 'frances', label: 'Francês' },
                    { value: 'italiano', label: 'Italiano' },
                    { value: 'alemao', label: 'Alemão' },
                    { value: 'japones', label: 'Japonês' },
                    { value: 'mandarim', label: 'Mandarim' },
                    { value: 'russo', label: 'Russo' },
                    { value: 'arabe', label: 'Árabe' },
                  ]}
                  searchable
                  clearable
                  {...form.getInputProps('idiomas')}
                  mb="xl"
                />
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Carteira de Habilitação
                </Title>

                <MultiSelect
                  label="Categorias"
                  placeholder="Selecione as categorias"
                  data={[
                    { value: 'A', label: 'A - Motocicletas' },
                    { value: 'B', label: 'B - Carros de passeio' },
                    { value: 'C', label: 'C - Veículos de carga acima de 3,5 ton' },
                    { value: 'D', label: 'D - Veículos com mais de 8 passageiros' },
                    { value: 'E', label: 'E - Veículos com reboque' },
                  ]}
                  searchable
                  clearable
                  {...form.getInputProps('habilitacao_categorias')}
                  mb="md"
                />

                <DateInput
                  label="Validade da CNH"
                  placeholder="Selecione a data"
                  valueFormat="DD/MM/YYYY"
                  {...form.getInputProps('habilitacao_validade')}
                  mb="lg"
                />
              </Card>

              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Veículos
                </Title>

                <Switch
                  label="Possui veículo próprio"
                  {...form.getInputProps('possui_veiculo', { type: 'checkbox' })}
                />
              </Card>
            </Tabs.Panel>
          </Tabs>

          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => router.push('/admin/casting')}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              styles={{
                root: {
                  backgroundColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                  color: '#FFFFFF !important',
                  '&:hover': {
                    backgroundColor: isDark ? '#a855f7 !important' : '#6b21a8 !important',
                  },
                },
              }}
            >
              Atualizar Casting
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
