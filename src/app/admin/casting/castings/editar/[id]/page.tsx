/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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
  MultiSelect,
  Divider,
  SimpleGrid,
  Box,
  Flex,
  Stack,
  Checkbox,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../../../../components/AdminNavbar';
import {
  CastingService,
  api,
  type CastingDetalhado,
  type Foto,
  type Video,
} from '@/services';
import 'react-toastify/dist/ReactToastify.css';
import { warningToast, successToast, infoToast, errorToast } from '@/utils';
import VideoPreview from '@/components/shared/VideoPreview';
import ImagePreview from '@/components/shared/ImagePreview';
import { compressImage } from '@/utils/imageCompression';
import { SearchZipCode } from '@/components/shared/SearchZipCode';
import Image from 'next/image';
import {
  corCabelo,
  estados,
  genderData,
  habilidadesData,
  etny,
  nationality,
  banksList,
  languages,
  languagesLevel,
  corOlhos,
  tipoCabelo,
} from '@/utils';

import {
  IconUpload,
  IconPlus,
  IconTrash,
  IconInfoCircle,
  IconBrandInstagram,
  IconMovie,
  IconMail,
  IconPhone,
  IconId,
  IconCreditCard,
  IconAward,
  IconUser,
  IconLink,
  IconBrandWhatsapp,
  IconMap,
} from '@tabler/icons-react';

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
  const [loadingCep, setLoadingCep] = useState(false);
  const [previewFotoPrincipal, setPreviewFotoPrincipal] = useState<string | null>(null);

  // Fotos
  const [fotosExistentes, setFotosExistentes] = useState<Foto[]>([]);
  const [fotosParaExcluir, setFotosParaExcluir] = useState<number[]>([]);
  const [fotosAdicionais, setFotosAdicionais] = useState<(File | null)[]>([]);
  const [legendasFotos, setLegendasFotos] = useState<string[]>([]);
  const [fotoInputKey, setFotoInputKey] = useState(Date.now());

  // Vídeos
  const [videosExistentes, setVideosExistentes] = useState<Video[]>([]);
  const [videosParaExcluir, setVideosParaExcluir] = useState<number[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [descricaoVideos, setDescricaoVideos] = useState<string[]>([]);
  const [videosNovos, setVideosNovos] = useState<{ titulo: string; url: string }[]>([]);

  const [idiomasSelecionados, setIdiomasSelecionados] = useState<Record<string, boolean>>(
    {},
  );
  const [idiomasNiveis, setIdiomasNiveis] = useState<Record<string, string>>({});
  const [idiomasOutros, setIdiomasOutros] = useState('');

  const toggleIdioma = (idioma: string, checked: boolean) => {
    setIdiomasSelecionados((prev) => ({ ...prev, [idioma]: checked }));
    if (!checked) {
      setIdiomasNiveis((prev) => {
        const newState = { ...prev };
        delete newState[`nivel_${idioma}`];
        return newState;
      });
      if (idioma === 'outros') setIdiomasOutros('');
    }
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
      PIS: '',
      tem_passaporte: false,
      passaporte: '',
      validade_passaporte: null as Date | null,
      CNH: '',
      habilitacao_categorias: [] as string[],
      habilitacao_validade: null as Date | null,
      possui_nota_propria: false,
      CNPJ: '',
      razao_social: '',
      inscricao_estadual: '',

      // Campos de exclusividade do casting
      exclusividade_outro_agente: false,
      info_exclusividade: '',
      aceita_figuracao: false,
      outras_plataformas_busca_elenco: false,
      info_outras_plataformas_descricao: '',

      // Biografia e Experiência
      biografia: '',
      experiencia: '',

      // Contato
      email: '',
      celular_whatsapp: '',
      link_instagram: '',
      link_imdb: '',
      website: '',
      contato_emergencia_nome: '',
      contato_emergencia_telefone: '',

      // Endereço (flattened)
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      pais: 'Brasil',

      // Dados bancários (flattened)
      banco: '',
      agencia: '',
      conta: '',
      tipo_conta: '',
      pix_chave: '',

      idiomas: {
        ingles: false,
        nivel_ingles: '',
        portugues: false,
        nivel_portugues: '',
        espanhol: false,
        nivel_espanhol: '',
        frances: false,
        nivel_frances: '',
        italiano: false,
        nivel_italiano: '',
        alemao: false,
        nivel_alemao: '',
        mandarim: false,
        nivel_mandarim: '',
        japones: false,
        nivel_japones: '',
        russo: false,
        nivel_russo: '',
        arabe: false,
        nivel_arabe: '',
        hungaro: false,
        nivel_hungaro: '',
        outros_idiomas: '',
      },
    },
    validate: {
      // nome: (value) => (value.trim().length === 0 ? 'O nome é obrigatório' : null),
      // categoria: (value) => (!value ? 'A categoria é obrigatória' : null),
      // altura: (value) => (!value ? 'A altura é obrigatória' : null),
      // peso: (value) => (!value ? 'O peso é obrigatório' : null),
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Link, TextAlign, Highlight, Underline],
    onUpdate: ({ editor }) =>
      form.getInputProps('experiencia').onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[150px]',
      },
    },
    immediatelyRender: false,
  });

  //Limpa / adiciona mascara ao campo de CEP para api conseguir calcular
  const handleCepBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');

    if (valor.length === 8) {
      form.setFieldValue('cep', valor.replace(/(\d{5})(\d{3})/, '$1-$2'));
    } else {
      infoToast('CEP inválido. Use o formato 00000000, sem espaços ou traços');
    }
  };

  const searchParams = useSearchParams();
  const pagina = searchParams.get('pagina') || '1';

  function parseJsonArray(field: any): string[] {
    if (Array.isArray(field)) return field;
    try {
      return field ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  }

  const dadosCarregados = useRef(false);

  // Carregar dados iniciais (categorias, funções, etc.)
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const categoriasData = await CastingService.getCategorias({ ordering: 'nome' });
        setCategorias(categoriasData.results || []);
      } catch (error) {
        console.error('Falha ao carregar dados iniciais:', error);
        errorToast(
          'Falha ao carregar dados iniciais. Tente novamente mais tarde.',
          'Erro',
        );
      }
    };

    carregarCategorias();
  }, []);

  useEffect(() => {
    //carregamento de dados ocorre aqui
    const carregarDados = async () => {
      if (!isAuthenticated || !id || dadosCarregados.current) return;

      try {
        setIsLoading(true);
        dadosCarregados.current = true;

        const castingResponse = await CastingService.getCasting(id);
        setCasting(castingResponse);
        setFotosExistentes(castingResponse.fotos || []);
        setVideosExistentes(castingResponse.videos || []);

        const dataNascimento = castingResponse.data_nascimento
          ? new Date(castingResponse.data_nascimento)
          : null;

        const habilitacaoValidade = castingResponse.habilitacao_validade
          ? new Date(castingResponse.habilitacao_validade)
          : null;

        const passaporteValidade = castingResponse.validade_passaporte
          ? new Date(castingResponse.validade_passaporte)
          : null;

        // Sincronizar checkboxes de idiomas
        const idiomasData = castingResponse.idiomas;
        if (idiomasData) {
          const selecionados: Record<string, boolean> = {};
          const niveis: Record<string, string> = {};

          Object.entries(idiomasData).forEach(([key, value]) => {
            if (
              [
                'ingles',
                'portugues',
                'espanhol',
                'frances',
                'italiano',
                'alemao',
                'mandarim',
                'japones',
                'russo',
                'arabe',
                'hungaro',
                'outros',
              ].includes(key) &&
              value === true
            ) {
              selecionados[key] = true;
            }

            if (key.startsWith('nivel_') && value) {
              niveis[key] = value;
            }
          });

          setIdiomasSelecionados(selecionados);
          setIdiomasNiveis(niveis);
          setIdiomasOutros(idiomasData.outros_idiomas || '');
        }

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

          habilidades: parseJsonArray(castingResponse.habilidades),
          natural_de: castingResponse.natural_de || '',
          nacionalidade: castingResponse.nacionalidade || 'Brasileira',
          etnia: castingResponse.etnia || '',
          foto_principal: null,
          ativo: castingResponse.ativo ?? true,
          autoriza_imagem_site: castingResponse.autoriza_imagem_site ?? true,

          data_nascimento: dataNascimento,
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
          CNPJ: castingResponse.CNPJ || '',
          CNH: castingResponse.CNH || '',
          PIS: castingResponse.PIS || '',
          website: castingResponse.website || '',
          celular_whatsapp: castingResponse.celular_whatsapp,
          habilitacao_validade: habilitacaoValidade,
          habilitacao_categorias: parseJsonArray(castingResponse.habilitacao_categorias),

          tem_passaporte: castingResponse.tem_passaporte || false,
          passaporte: castingResponse.passaporte || '',
          validade_passaporte: passaporteValidade,
          razao_social: castingResponse.razao_social || '',
          inscricao_estadual: castingResponse.inscricao_estadual || '',
          possui_nota_propria: castingResponse.possui_nota_propria || false,
          exclusividade_outro_agente: castingResponse.exclusividade_outro_agente || false,
          info_exclusividade: castingResponse.info_exclusividade || '',
          aceita_figuracao: castingResponse.aceita_figuracao || false,
          outras_plataformas_busca_elenco:
            castingResponse.outras_plataformas_busca_elenco || false,
          info_outras_plataformas_descricao:
            castingResponse.info_outras_plataformas_descricao || '',

          biografia: castingResponse.biografia || '',
          experiencia: castingResponse.experiencia || '',

          email: castingResponse.email || '',
          link_instagram: castingResponse.link_instagram || '',
          link_imdb: castingResponse.link_imdb || '',
          contato_emergencia_nome: castingResponse.contato_emergencia_nome || '',
          contato_emergencia_telefone: castingResponse.contato_emergencia_telefone || '',

          //endereço
          cep: castingResponse.endereco?.cep || '',
          logradouro: castingResponse.endereco?.logradouro || '',
          numero: castingResponse.endereco?.numero || '',
          complemento: castingResponse.endereco?.complemento || '',
          bairro: castingResponse.endereco?.bairro || '',
          cidade: castingResponse.endereco?.cidade || '',
          estado: castingResponse.endereco?.estado || '',

          //dados bancarios
          banco: castingResponse.dados_bancarios?.banco || '',
          agencia: castingResponse.dados_bancarios?.agencia || '',
          conta: castingResponse.dados_bancarios?.conta || '',
          tipo_conta: castingResponse.dados_bancarios?.tipo_conta || '',
          pix_chave: castingResponse.dados_bancarios?.pix_chave || '',

          idiomas: {
            ingles: castingResponse.idiomas?.ingles ?? false,
            nivel_ingles: castingResponse.idiomas?.nivel_ingles ?? '',
            portugues: castingResponse.idiomas?.portugues ?? false,
            nivel_portugues: castingResponse.idiomas?.nivel_portugues ?? '',
            espanhol: castingResponse.idiomas?.espanhol ?? false,
            nivel_espanhol: castingResponse.idiomas?.nivel_espanhol ?? '',
            frances: castingResponse.idiomas?.frances ?? false,
            nivel_frances: castingResponse.idiomas?.nivel_frances ?? '',
            italiano: castingResponse.idiomas?.italiano ?? false,
            nivel_italiano: castingResponse.idiomas?.nivel_italiano ?? '',
            alemao: castingResponse.idiomas?.alemao ?? false,
            nivel_alemao: castingResponse.idiomas?.nivel_alemao ?? '',
            mandarim: castingResponse.idiomas?.mandarim ?? false,
            nivel_mandarim: castingResponse.idiomas?.nivel_mandarim ?? '',
            japones: castingResponse.idiomas?.japones ?? false,
            nivel_japones: castingResponse.idiomas?.nivel_japones ?? '',
            russo: castingResponse.idiomas?.russo ?? false,
            nivel_russo: castingResponse.idiomas?.nivel_russo ?? '',
            arabe: castingResponse.idiomas?.arabe ?? false,
            nivel_arabe: castingResponse.idiomas?.nivel_arabe ?? '',
            hungaro: castingResponse.idiomas?.hungaro ?? false,
            nivel_hungaro: castingResponse.idiomas?.nivel_hungaro ?? '',
            outros_idiomas: castingResponse.idiomas?.outros_idiomas ?? '',
          },
        });
        console.log('Casting Response retornado:', castingResponse);
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
    const LIMITE_MAXIMO = 6;
    const totalFotos = fotosExistentes.length + fotosAdicionais.length;
    if (totalFotos >= LIMITE_MAXIMO) {
      warningToast('Você já adicionou o número máximo de 6 fotos.', 'Limite atingido');
      return;
    }

    // Verifica se a última foto adicionada está preenchida
    const ultimaFotoIndex = fotosAdicionais.length - 1;
    if (ultimaFotoIndex >= 0 && !fotosAdicionais[ultimaFotoIndex]) {
      warningToast(
        'Selecione uma imagem para a foto atual antes de adicionar outra.',
        'Foto vazia',
      );

      return;
    }
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
    const LIMITE_MAXIMO = 6;

    const totalVideos = videosExistentes.length + videosNovos.length;

    if (totalVideos >= LIMITE_MAXIMO) {
      warningToast('Você só pode adicionar até 6 vídeos', 'Limite atingido');
      return;
    }

    if (videosNovos.length > 0) {
      const ultimo = videosNovos[videosNovos.length - 1];
      if (!ultimo.titulo.trim() || !ultimo.url.trim()) {
        warningToast(
          'Preencha o título e o link do último vídeo antes de adicionar outro.',
          'Campos obrigatórios',
        );

        return;
      }
    }

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
  const handleSubmitUpdate = async (values: typeof form.values) => {
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
      if (values.habilidades)
        formData.append('habilidades', JSON.stringify(values.habilidades));

      // Data de nascimento
      if (values.data_nascimento) {
        formData.append(
          'data_nascimento',
          values.data_nascimento instanceof Date
            ? values.data_nascimento.toISOString().split('T')[0]
            : values.data_nascimento,
        );
      }

      // Características físicas
      if (values.altura) formData.append('altura', String(values.altura));
      if (values.peso) formData.append('peso', String(values.peso));
      if (values.manequim !== undefined)
        formData.append('manequim', String(values.manequim));
      if (values.terno !== undefined) formData.append('terno', String(values.terno));
      if (values.camisa !== undefined) formData.append('camisa', String(values.camisa));
      if (values.sapato !== undefined) formData.append('sapato', String(values.sapato));
      if (values.olhos) formData.append('olhos', values.olhos);
      if (values.tipo_cabelo) formData.append('tipo_cabelo', values.tipo_cabelo);
      if (values.cor_cabelo) formData.append('cor_cabelo', values.cor_cabelo);

      // Tatuagens
      formData.append('tem_tatuagens', values.tem_tatuagens ? 'true' : 'false');
      if (values.locais_tatuagens)
        formData.append('locais_tatuagens', values.locais_tatuagens);

      // Documentos
      if (values.DRT) formData.append('DRT', values.DRT);
      if (values.RG) formData.append('RG', values.RG);
      if (values.CPF) formData.append('CPF', values.CPF);
      if (values.CNH) formData.append('CNH', values.CNH);
      if (values.CNPJ) formData.append('CNPJ', values.CNPJ);
      if (values.PIS) formData.append('PIS', values.PIS);
      formData.append('tem_passaporte', values.tem_passaporte ? 'true' : 'false');
      if (values.passaporte) formData.append('passaporte', values.passaporte);
      if (values.validade_passaporte) {
        formData.append(
          'validade_passaporte',
          values.validade_passaporte instanceof Date
            ? values.validade_passaporte.toISOString().split('T')[0]
            : values.validade_passaporte,
        );
      }
      formData.append(
        'possui_nota_propria',
        values.possui_nota_propria ? 'true' : 'false',
      );
      if (values.razao_social) formData.append('razao_social', values.razao_social);
      if (values.inscricao_estadual)
        formData.append('inscricao_estadual', values.inscricao_estadual);

      // Exclusividade / Plataformas
      formData.append(
        'exclusividade_outro_agente',
        values.exclusividade_outro_agente ? 'true' : 'false',
      );
      if (values.info_exclusividade)
        formData.append('info_exclusividade', values.info_exclusividade);
      formData.append(
        'outras_plataformas_busca_elenco',
        values.outras_plataformas_busca_elenco ? 'true' : 'false',
      );
      if (values.info_outras_plataformas_descricao)
        formData.append(
          'info_outras_plataformas_descricao',
          values.info_outras_plataformas_descricao,
        );

      // Contato
      if (values.celular_whatsapp)
        formData.append('celular_whatsapp', values.celular_whatsapp);
      if (values.email) formData.append('email', values.email);
      if (values.link_instagram) formData.append('link_instagram', values.link_instagram);
      if (values.link_imdb) formData.append('link_imdb', values.link_imdb);
      if (values.website) formData.append('website', values.website);
      if (values.contato_emergencia_nome)
        formData.append('contato_emergencia_nome', values.contato_emergencia_nome);
      if (values.contato_emergencia_telefone)
        formData.append(
          'contato_emergencia_telefone',
          values.contato_emergencia_telefone,
        );

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
      formData.append('aceita_figuracao', values.aceita_figuracao ? 'true' : 'false');

      // Adicionar foto principal se existir
      if (values.foto_principal) {
        formData.append('foto_principal', values.foto_principal);
      }

      // Verificar autenticação
      const token = localStorage.getItem('accessToken');
      if (!token) {
        errorToast('Você precisa estar autenticado para atualizar um casting');
        router.push('/admin/login');
        return;
      }

      const castingId = casting.id;
      // Atualizar o casting
      const response = await CastingService.atualizarCasting(
        String(casting.id),
        formData,
      );

      if (response?.foto_principal) {
        setPreviewFotoPrincipal(response.foto_principal);
      }

      // PATCH - Endereço
      try {
        if (casting.endereco?.cep) {
          await api.patch('/api/casting/enderecos/patch-enderecos/', {
            casting: castingId,
            cep: values.cep,
            logradouro: values.logradouro || '',
            numero: values.numero || '',
            complemento: values.complemento || '',
            bairro: values.bairro || '',
            cidade: values.cidade || '',
            estado: values.estado || '',
            pais: values.pais || '',
          });
          successToast('Endereço atualizado com sucesso');
        }
      } catch (e) {
        errorToast('Erro ao atualizar endereço');
      }

      // PATCH - Dados bancários
      try {
        if (casting.dados_bancarios?.pix_chave) {
          await api.patch('/api/casting/dados-bancarios/patch-dados-bancarios/', {
            casting: castingId,
            banco: values.banco || '',
            agencia: values.agencia || '',
            conta: values.conta || '',
            tipo_conta: values.tipo_conta || '',
            pix_chave: values.pix_chave || '',
          });
          successToast('Dados bancários atualizados com sucesso');
        }
      } catch (e) {
        errorToast('Erro ao atualizar dados bancários');
      }

      // PATCH - Idiomas
      try {
        const idiomasAtualizados = Object.entries(idiomasSelecionados || {}).filter(
          ([_, ativo]) => ativo,
        );

        if (idiomasAtualizados.length > 0) {
          await api.patch('/api/casting/idiomas/patch-idiomas/', {
            casting: castingId,
            ...idiomasSelecionados,
            ...idiomasNiveis,
            outros_idiomas: idiomasOutros || '',
          });
          successToast('Idiomas atualizados com sucesso');
        }
      } catch (e) {
        errorToast('Erro ao atualizar idiomas');
      }

      // Excluir fotos marcadas para exclusão
      const excluirFotosPromises = fotosParaExcluir.map(async (id) => {
        try {
          await CastingService.excluirFoto(
            casting.slug || String(casting.id),
            String(id),
          );
          successToast(`Foto ${id} excluída com sucesso`);
        } catch (error) {
          errorToast(`Erro ao excluir a foto ${id}`);
          console.error('Erro ao excluir foto:', error);
        }
      });
      await Promise.all(excluirFotosPromises);

      // Adicionar novas fotos
      const uploadFotosPromises = fotosAdicionais.map(async (foto, index) => {
        if (!foto) return null;

        try {
          const fotoFormData = new FormData();
          fotoFormData.append('imagem', foto);
          fotoFormData.append('legenda', legendasFotos[index] || '');
          fotoFormData.append('ordem', (fotosExistentes.length + index).toString());

          await CastingService.adicionarFoto(String(casting.id), fotoFormData);
          successToast(`Foto ${index + 1} enviada com sucesso`);
        } catch (error) {
          errorToast(`Erro ao enviar a foto ${index + 1}`);
        }
      });
      await Promise.all(uploadFotosPromises.filter(Boolean));

      // Excluir vídeos marcados para exclusão
      const excluirVideosPromises = videosParaExcluir.map(async (id) => {
        try {
          await CastingService.excluirVideo(
            casting.slug || String(casting.id),
            String(id),
          );
          successToast(`Vídeo ${id} excluído com sucesso`);
        } catch (error) {
          errorToast(`Erro ao excluir o vídeo ${id}`);
          console.error('Erro ao excluir vídeo:', error);
        }
      });
      await Promise.all(excluirVideosPromises);

      // Adicionar novos vídeos
      const uploadVideosPromises = videosNovos.map(async (video, index) => {
        if (!video.titulo || !video.url) return null;

        try {
          await CastingService.adicionarVideo(casting.id, {
            titulo: video.titulo,
            url: video.url,
            ordem: videosExistentes.length + index,
          });
          successToast(`Vídeo "${video.titulo}" adicionado com sucesso`);
        } catch (error) {
          errorToast(`Erro ao adicionar o vídeo "${video.titulo}"`);
        }
      });
      await Promise.all(uploadVideosPromises.filter(Boolean));

      successToast('Casting atualizado com sucesso');

      setTimeout(() => {
        router.push('/admin/casting');
      }, 2000); // 1 segundo é suficiente
    } catch (error: any) {
      if (error.response?.status === 413) {
        errorToast('Imagem muito pesada! Reduza o tamanho antes de enviar.');
      } else {
        console.error('Erro ao atualizar casting:', error);
        errorToast('Erro ao atualizar casting');
      }
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

        <form onSubmit={form.onSubmit(handleSubmitUpdate)}>
          <Tabs defaultValue="informacoes-basicas" mb="xl">
            <Tabs.List mb="md">
              <Tabs.Tab value="informacoes-basicas" icon={<IconUser size={14} />}>
                Informações Básicas
              </Tabs.Tab>
              <Tabs.Tab value="caracteristicas" icon={<IconInfoCircle size={14} />}>
                Características
              </Tabs.Tab>
              <Tabs.Tab value="midia" icon={<IconMovie size={14} />}>
                Mídia
              </Tabs.Tab>
              <Tabs.Tab value="documentos" icon={<IconId size={14} />}>
                Documentos
              </Tabs.Tab>
              <Tabs.Tab value="biografia" icon={<IconAward size={14} />}>
                Biografia
              </Tabs.Tab>
              <Tabs.Tab value="contato" icon={<IconMail size={14} />}>
                Contato
              </Tabs.Tab>
              <Tabs.Tab value="endereco" icon={<IconCreditCard size={14} />}>
                Endereço e Finanças
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
                  <Select
                    label="Naturalidade"
                    searchable
                    placeholder="Natural de (município/estado)"
                    nothingFound="Não encontrado"
                    {...form.getInputProps('natural_de')}
                    data={estados}
                    clearable
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
                </SimpleGrid>

                <SimpleGrid cols={2}>
                  <MultiSelect
                    label="Habilidades"
                    searchable
                    clearable
                    placeholder="Selecione uma ou mais habilidades"
                    data={habilidadesData}
                    {...form.getInputProps('habilidades')}
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
                      key={fotoInputKey} // força o re-render
                      label="Foto Principal (horizontal)"
                      description="Selecione uma nova imagem para substituir a atual / Máx: 1.2MB"
                      accept="image/png,image/jpeg,image/webp"
                      icon={<IconUpload size={14} />}
                      {...form.getInputProps('foto_principal')}
                      onChange={(file) => {
                        if (file && file.size > 1.2 * 1024 * 1024) {
                          errorToast('Imagem muito pesada! Máximo permitido: 1.2MB');
                          // resetar o input para aceitar de novo
                          form.setFieldValue('foto_principal', null);
                          setPreviewFotoPrincipal(null);
                          setFotoInputKey(Date.now());
                          return;
                        }

                        form.setFieldValue('foto_principal', file);
                        setPreviewFotoPrincipal(file ? URL.createObjectURL(file) : null);
                      }}
                      ref={undefined}
                    />
                  </div>

                  {/* Se tiver preview (imagem nova) */}
                  {previewFotoPrincipal ? (
                    <div>
                      <Text size="sm" weight={500} mb={5}>
                        Pré-visualização
                      </Text>
                      <div
                        style={{
                          width: 300,
                          height: 150,
                          position: 'relative',
                          overflow: 'hidden',
                          borderRadius: '4px',
                        }}
                      >
                        <Image
                          src={previewFotoPrincipal}
                          alt="Pré-visualização da foto principal"
                          style={{ objectFit: 'cover' }}
                          fill
                          sizes="300px"
                        />
                      </div>
                    </div>
                  ) : casting.foto_principal ? (
                    // Se não tiver preview, exibe a do backend
                    <div>
                      <Text size="sm" weight={500} mb={5}>
                        Foto Atual <br />
                        (horizontal)
                      </Text>
                      <div
                        style={{
                          width: 300,
                          height: 150,
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
                          sizes="300px"
                        />
                      </div>
                    </div>
                  ) : null}
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
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <Switch
                  label="Aceita figuração?"
                  {...form.getInputProps('aceita_figuracao', {
                    type: 'checkbox',
                  })}
                  mb="md"
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

                  <TextInput
                    label="Altura (em metros)"
                    placeholder="Ex: 1.75"
                    min={0.5}
                    max={2.5}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    step={0.01}
                    required
                    {...form.getInputProps('altura')}
                  />
                  <TextInput
                    label="Peso (em kg)"
                    placeholder="Ex: 70"
                    min={20}
                    max={200}
                    {...form.getInputProps('peso')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={4} mb="md">
                  <TextInput
                    label="Manequim"
                    placeholder="Tamanho do manequim (número)"
                    {...form.getInputProps('manequim')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Sapato"
                    placeholder="Número do sapato (número)"
                    {...form.getInputProps('sapato')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="Terno"
                    placeholder="Tamanho do terno (número)"
                    {...form.getInputProps('terno')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Camisa"
                    placeholder="Tamanho da camisa (número)"
                    {...form.getInputProps('camisa')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <Select
                    label="Cor dos Olhos"
                    placeholder="Selecione a cor dos olhos"
                    data={corOlhos}
                    {...form.getInputProps('olhos')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <Select
                    label="Tipo de Cabelo"
                    placeholder="Selecione o tipo de cabelo"
                    data={tipoCabelo}
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
                <Divider my="md" label="Idiomas" labelPosition="center" />
                <Stack spacing="sm">
                  <Text size="sm" weight={500}>
                    Idiomas
                  </Text>

                  {languages.map(({ value, label }) => (
                    <Group key={value} position="apart" grow>
                      <Checkbox
                        label={label}
                        checked={idiomasSelecionados[value] || false}
                        onChange={(event) =>
                          toggleIdioma(value, event.currentTarget.checked)
                        }
                      />

                      {idiomasSelecionados[value] && value !== 'outros' && (
                        <Select
                          data={languagesLevel}
                          placeholder="Nível"
                          value={idiomasNiveis[`nivel_${value}`]}
                          onChange={(nivel) =>
                            setIdiomasNiveis((prev) => ({
                              ...prev,
                              [`nivel_${value}`]: nivel || '',
                            }))
                          }
                          withinPortal
                        />
                      )}

                      {idiomasSelecionados[value] && value === 'outros' && (
                        <TextInput
                          placeholder="Descreva os idiomas e níveis"
                          value={idiomasOutros}
                          onChange={(event) =>
                            setIdiomasOutros(event.currentTarget.value)
                          }
                        />
                      )}
                    </Group>
                  ))}
                </Stack>
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
                    <SimpleGrid
                      cols={2}
                      spacing="md"
                      breakpoints={[
                        { maxWidth: 'sm', cols: 1 }, // 1 coluna em telas pequenas
                      ]}
                    >
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
                            description="Selecione uma imagem / Máx: 1.2MB"
                            accept="image/png,image/jpeg,image/webp"
                            icon={<IconUpload size={14} />}
                            value={foto}
                            onChange={(file) => {
                              if (file && file.size > 1.2 * 1024 * 1024) {
                                errorToast(
                                  'Imagem muito pesada! Máximo permitido: 1.2MB',
                                );
                                return;
                              }

                              atualizarFoto(file, index);
                            }}
                            mb="md"
                          />
                          {foto && <ImagePreview file={foto} height={150} />}

                          <TextInput
                            label="Legenda"
                            placeholder="Legenda da foto"
                            value={legendasFotos[index] || ''}
                            onChange={(e) => atualizarLegenda(e.target.value, index)}
                          />
                        </Card>
                      ))}
                    </SimpleGrid>
                  </>
                )}

                {fotosExistentes.length === 0 && fotosAdicionais.length === 0 && (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhuma foto adicionada. Clique em &quot;Adicionar Foto&quot; para
                    incluir fotos.
                  </Text>
                )}
                <Divider my="md" label="Videos" labelPosition="center" />
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

                <SimpleGrid
                  cols={3}
                  spacing="md"
                  breakpoints={[
                    { maxWidth: 'sm', cols: 1 },
                    { maxWidth: 'md', cols: 2 },
                  ]}
                >
                  {videosExistentes.map((video) => (
                    <Box
                      key={video.id}
                      style={{
                        width: 300,
                        position: 'relative',
                        marginRight: 10,
                      }}
                    >
                      {/* Ícone de lixeira flutuando sobre o vídeo */}
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => marcarVideoParaExcluir(video.id)}
                        style={{
                          position: 'absolute',
                          top: 18,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                          zIndex: 2,
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>

                      {/* Player do vídeo */}
                      <VideoPreview url={video.url} height={150} />
                    </Box>
                  ))}
                </SimpleGrid>

                {/* Novos vídeos */}
                {videosNovos.length > 0 && (
                  <>
                    <Title order={4} mb="md">
                      Novos Vídeos
                    </Title>
                    <SimpleGrid
                      cols={2}
                      spacing="md"
                      breakpoints={[
                        { maxWidth: 'sm', cols: 1 }, // 1 coluna em telas pequenas
                      ]}
                    >
                      {videosNovos.map((video, index) => (
                        <Card key={index} withBorder p="md" radius="md" mb="md">
                          <Group position="apart" mb="xs">
                            <Text weight={500}>Vídeo Novo {index + 1}</Text>
                            <ActionIcon color="red" onClick={() => removerVideo(index)}>
                              <IconTrash size={16} />
                            </ActionIcon>
                          </Group>

                          <TextInput
                            label="URL"
                            placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                            value={video.url}
                            onChange={(e) => atualizarVideo('url', e.target.value, index)}
                          />

                          {video.url && <VideoPreview url={video.url} height={150} />}

                          <TextInput
                            label="Título"
                            placeholder="Título do vídeo"
                            value={video.titulo}
                            onChange={(e) =>
                              atualizarVideo('titulo', e.target.value, index)
                            }
                            mb="md"
                          />
                        </Card>
                      ))}
                    </SimpleGrid>
                  </>
                )}

                {videosExistentes.length === 0 && videosNovos.length === 0 && (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhum vídeo adicionado. Clique em &quot;Adicionar Vídeo&quot; para
                    incluir vídeos.
                  </Text>
                )}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="documentos">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Documentos e Registros Profissionais
                </Title>

                <SimpleGrid cols={4} mb="md">
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

                  <TextInput
                    label="PIS"
                    placeholder="Número do PIS"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('PIS')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="CNH"
                    placeholder="Número da CNH"
                    {...form.getInputProps('CNH')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <MultiSelect
                    label="Categorias"
                    placeholder="Selecione as categorias"
                    data={[
                      { value: 'A', label: 'A - Motos' },
                      { value: 'B', label: 'B - Carros' },
                      { value: 'C', label: 'C - Veículos de carga acima de 3,5t' },
                      { value: 'D', label: 'D - Veículos com mais de 8 passageiros' },
                      {
                        value: 'E',
                        label: 'E - Veículos com unidade acoplada acima de 6t',
                      },
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
                    mb="md"
                    popoverProps={{
                      zIndex: 9999, // Aumentando o z-index para o calendário aparecer acima de outros elementos
                      withinPortal: true, // Renderiza o calendário dentro de um portal para evitar problemas de z-index
                    }}
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
                  {form.values.tem_passaporte && (
                    <>
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
                    </>
                  )}
                </SimpleGrid>

                <Divider
                  my="md"
                  label="Informações para Nota Fiscal"
                  labelPosition="center"
                />

                <Switch
                  label="Possui Nota Própria"
                  {...form.getInputProps('possui_nota_propria', { type: 'checkbox' })}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                {form.values.possui_nota_propria && (
                  <SimpleGrid cols={3} mb="md">
                    <TextInput
                      label="CNPJ"
                      placeholder="Número do CNPJ"
                      icon={<IconCreditCard size={14} />}
                      {...form.getInputProps('CNPJ')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />

                    <TextInput
                      label="Razão Social"
                      placeholder="Razão Social da empresa"
                      {...form.getInputProps('razao_social')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />

                    <TextInput
                      label="Inscrição Estadual"
                      placeholder="Número da Inscrição Estadual"
                      {...form.getInputProps('inscricao_estadual')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                  </SimpleGrid>
                )}

                <Divider
                  my="md"
                  label="Informações sobre Exclusividade"
                  labelPosition="center"
                />
                <Switch
                  label="Possui exclusividade com outro agente/agência para conteúdo ou publicidade?"
                  {...form.getInputProps('exclusividade_outro_agente', {
                    type: 'checkbox',
                  })}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                {form.values.exclusividade_outro_agente && (
                  <Flex align="end" gap="md">
                    <TextInput
                      label="Informe com qual agência você tem exclusividade"
                      placeholder="BAA, outras..."
                      icon={<IconCreditCard size={14} />}
                      {...form.getInputProps('info_exclusividade')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                      style={{ flexGrow: 1 }} // ocupa o espaço restante
                    />
                  </Flex>
                )}
                <Divider
                  my="md"
                  label="Informações sobre outras plataformas"
                  labelPosition="center"
                />
                <Switch
                  label="Está registrado em alguma outra plataforma de busca de elenco?"
                  {...form.getInputProps('outras_plataformas_busca_elenco', {
                    type: 'checkbox',
                  })}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                {form.values.outras_plataformas_busca_elenco && (
                  <SimpleGrid cols={1} mb="md">
                    <TextInput
                      label="Informe quais outras plataformas"
                      placeholder="Elenco Digital, etc"
                      icon={<IconCreditCard size={14} />}
                      {...form.getInputProps('info_outras_plataformas_descricao')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                  </SimpleGrid>
                )}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="biografia">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Biografia
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

            <Tabs.Panel value="contato">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Informações de Contato
                </Title>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    icon={<IconMail size={16} />}
                    label="E-mail"
                    placeholder="E-mail de contato"
                    type="email"
                    {...form.getInputProps('email')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    icon={<IconBrandWhatsapp size={16} />}
                    label="Celular/Whatsapp"
                    placeholder="(00) 0000-0000"
                    {...form.getInputProps('celular_whatsapp')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="Website"
                    placeholder="Link completo"
                    icon={<IconLink size={16} />}
                    {...form.getInputProps('website')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Instagram"
                    placeholder="@usuario"
                    icon={<IconBrandInstagram size={16} />}
                    {...form.getInputProps('link_instagram')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="IMDB"
                    placeholder="Link completo"
                    icon={<IconLink size={16} />}
                    {...form.getInputProps('link_imdb')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <Divider my="md" label="Contato de Emergência" labelPosition="center" />

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Nome do Contato de Emergência"
                    placeholder="Nome completo"
                    {...form.getInputProps('contato_emergencia_nome')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Telefone de Emergência"
                    placeholder="Número de telefone com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('contato_emergencia_telefone')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="endereco">
              <Card withBorder p="xl" radius="md" mb="xl">
                <Title order={3} mb="lg">
                  Endereço e Informações Financeiras
                </Title>

                <SearchZipCode
                  cep={form.values.cep}
                  onLoading={setLoadingCep}
                  onResult={(endereco) => {
                    if (endereco.logradouro)
                      form.setFieldValue('logradouro', endereco.logradouro);
                    if (endereco.bairro) form.setFieldValue('bairro', endereco.bairro);
                    if (endereco.cidade) form.setFieldValue('cidade', endereco.cidade);
                    if (endereco.estado) form.setFieldValue('estado', endereco.estado);
                  }}
                />

                <SimpleGrid cols={2} spacing="md" mb="md">
                  <TextInput
                    label="CEP"
                    placeholder="Formato: 00000-000"
                    icon={loadingCep ? <Loader size={14} /> : <IconMap size={14} />}
                    onBlur={handleCepBlur}
                    {...form.getInputProps('cep')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="Endereço"
                    placeholder="Rua, Avenida, etc."
                    {...form.getInputProps('logradouro')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
                <SimpleGrid cols={3} spacing="md" mb="md">
                  <TextInput
                    label="Número"
                    placeholder="123"
                    {...form.getInputProps('numero')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="Complemento"
                    placeholder="Apto, bloco, etc (se houver)"
                    {...form.getInputProps('complemento')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  <TextInput
                    label="Bairro"
                    placeholder="Bairro"
                    {...form.getInputProps('bairro')}
                  />
                </SimpleGrid>
                <SimpleGrid cols={3} spacing="md" mb="md">
                  <TextInput
                    label="Cidade"
                    placeholder="Nome da cidade"
                    {...form.getInputProps('cidade')}
                  />
                  <Select
                    label="Estado"
                    placeholder="Selecione o estado"
                    data={estados}
                    searchable
                    {...form.getInputProps('estado')}
                  />
                  <TextInput
                    label="País"
                    placeholder="País"
                    {...form.getInputProps('pais')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
                <Divider my="md" label="Dados Bancários" labelPosition="center" />

                <SimpleGrid cols={3} mb="md">
                  <Select
                    label="Banco"
                    placeholder="Número ou nome do banco"
                    data={banksList}
                    searchable
                    nothingFound="Nada encontrado..."
                    {...form.getInputProps('banco')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Agência"
                    placeholder="Número da agência"
                    {...form.getInputProps('agencia')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Conta"
                    placeholder="Número da conta com dígito"
                    {...form.getInputProps('conta')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <Select
                    label="Tipo de Conta"
                    placeholder="Selecione o tipo de conta"
                    data={[
                      { value: 'corrente', label: 'Corrente' },
                      { value: 'poupanca', label: 'Poupança' },
                      { value: 'conjunta', label: 'Conjunta' },
                      { value: 'pagamento', label: 'Pagamento' },
                    ]}
                    {...form.getInputProps('tipo_conta')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="PIX"
                    placeholder="Chave PIX"
                    {...form.getInputProps('pix_chave')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
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
