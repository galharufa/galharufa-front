/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import AdminNavbar from '../../../components/AdminNavbar';
import { CastingService, api } from '@/services';
import VideoPreview from '@/components/shared/VideoPreview';
import { notifications } from '@mantine/notifications';
import {
  corCabelo,
  errorToast,
  genderData,
  habilidades,
  successToast,
  tipoCabelo,
} from '@/utils';
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
  IconCar,
  IconId,
  IconCreditCard,
  IconAward,
  IconEdit,
  IconUser,
  // IconEPassport,
  IconBrandWhatsapp,
  IconBrandTiktok,
  IconWorld,
  IconMap,
} from '@tabler/icons-react';

const habilidadesData = [
  ...(habilidades || []),
  ...(modalidadesCircenses || []),
  ...(esportes || []),
  ...(instrumentos || []),
];

export default function NovoCasting() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [habilidades, setHabilidades] = useState<any[]>([]);
  const [esportes, setEsportes] = useState<any[]>([]);
  const [modalidadesCircenses, setModalidadesCircenses] = useState<any[]>([]);
  const [instrumentos, setInstrumentos] = useState<any[]>([]);
  const [plataformasBusca, setPlataformasBusca] = useState<any[]>([]);

  const [fotosAdicionais, setFotosAdicionais] = useState<(File | null)[]>([]);
  const [legendasFotos, setLegendasFotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [linksTrabalho, setLinksTrabalho] = useState<string[]>(['', '']);
  const [descricaoVideos, setDescricaoVideos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      // Informações Básicas
      nome: '',
      nome_artistico: '',
      genero: 'masculino',
      categoria: '',
      habilidades: [],
      natural_de: '',
      nacionalidade: 'Brasileira',
      etnia: '',
      foto_principal: null as File | null,
      ativo: true,
      autoriza_imagem_site: true,

      // Características Físicas
      data_nascimento: null as Date | null,
      ano: new Date().getFullYear() - 20,
      altura: '',
      peso: '',
      manequim: '',
      sapato: '',
      terno: '',
      camisa: '',
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
      CNH: '',
      CNPJ: '',
      razao_social: '',
      inscricao_estadual: '',
      possui_nota_propria: false,

      // Biografia e Experiência
      curriculum_artistico: '',

      // Mídia
      link_monologo: '',
      link_trabalho_1: '',
      link_trabalho_2: '',

      // Contato
      email: '',
      telefone: '',
      celular: '',
      whatsapp: '',
      instagram: '',
      tiktok: '',
      youtube: '',
      website: '',
      emergencia_nome: '',
      emergencia_telefone: '',

      // Endereço e Informações Financeiras
      CEP: '',
      rua: '',
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
      // biografia: (value) => (!value ? 'A biografia é obrigatória' : null),
      // experiencia: (value) => (!value ? 'A experiência é obrigatória' : null),
      foto_principal: (value) => (!value ? 'A foto principal é obrigatória' : null),
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Link, TextAlign, Highlight, Underline],
    content: form.getInputProps('experiencia').value,
    onUpdate: ({ editor }) =>
      form.getInputProps('experiencia').onChange(editor.getHTML()),
    immediatelyRender: false, // Corrige o problema de hidratação SSR
  });

  // Carregar dados iniciais (categorias, funções, etc.)
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const categoriasData = await CastingService.getCategorias({ ordering: 'nome' });
        setCategorias(categoriasData.results || []);

        // Buscar funções da API
        // const habilidadesData = await CastingService.getHabilidades({ ordering: 'nome' });
        // setHabilidades(habilidadesData.results || []);
        // setHabilidades([modalidadesCircenses, instrumentos, habilidades, esportes]);

        setPlataformasBusca([
          { id: '1', nome: 'Casting.com' },
          { id: '2', nome: 'Elenco Direto' },
          { id: '3', nome: 'Casting Net' },
          { id: '4', nome: 'Dama Cast' },
          { id: '5', nome: 'Qual Casting' },
        ]);
      } catch (error) {
        console.error('Falha ao carregar dados iniciais:', error);
        notifications.show({
          title: 'Erro',
          message: 'Falha ao carregar dados iniciais. Tente novamente mais tarde.',
          color: 'red',
        });
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Funções para gerenciar fotos adicionais
  const adicionarFoto = () => {
    // Verifica se já atingiu o limite de 8 fotos
    if (fotosAdicionais.length >= 8) {
      notifications.show({
        title: 'Limite atingido',
        message: 'Você já adicionou o número máximo de 8 fotos.',
        color: 'yellow',
      });
      return;
    }

    // Verifica se a última foto adicionada está preenchida
    const ultimaFotoIndex = fotosAdicionais.length - 1;
    if (ultimaFotoIndex >= 0 && !fotosAdicionais[ultimaFotoIndex]) {
      notifications.show({
        title: 'Foto vazia',
        message: 'Selecione uma imagem para a foto atual antes de adicionar outra.',
        color: 'yellow',
      });
      return;
    }

    // Adiciona nova foto e legenda
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

  // Funções para gerenciar vídeos
  const adicionarVideo = () => {
    setVideos([...videos, '']);
    setDescricaoVideos([...descricaoVideos, '']);
  };

  const removerVideo = (index: number) => {
    const novosVideos = [...videos];
    novosVideos.splice(index, 1);
    setVideos(novosVideos);

    const novasDescricoes = [...descricaoVideos];
    novasDescricoes.splice(index, 1);
    setDescricaoVideos(novasDescricoes);
  };

  const atualizarVideo = (valor: string, index: number) => {
    const novosVideos = [...videos];
    novosVideos[index] = valor;
    setVideos(novosVideos);
  };

  const atualizarDescricaoVideo = (valor: string, index: number) => {
    const novasDescricoes = [...descricaoVideos];
    novasDescricoes[index] = valor;
    setDescricaoVideos(novasDescricoes);
  };

  // Função para salvar o casting
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    console.log('Iniciando salvamento de casting com valores:', values);
    try {
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
      // Verificar se os campos obrigatórios estão preenchidos
      console.log('Verificando campos obrigatórios...');
      const camposObrigatorios = {
        nome: values.nome,
        categoria: values.categoria,
        altura: values.altura,
        peso: values.peso,
        biografia: values.biografia,
        experiencia: values.experiencia,
        foto_principal: values.foto_principal,
      };

      // Garantir que o conteúdo do editor seja utilizado para experiencia
      if (editor && !values.experiencia) {
        values.experiencia = editor.getHTML();
        camposObrigatorios.experiencia = editor.getHTML();
      }

      const camposFaltantes = Object.entries(camposObrigatorios)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (camposFaltantes.length > 0) {
        console.error('Campos obrigatórios faltando:', camposFaltantes);
        errorToast(
          `Por favor, preencha os campos obrigatórios: ${camposFaltantes.join(', ')}`,
        );
        return;
      }
      console.log('Todos os campos obrigatórios estão preenchidos.');

      // Criar FormData para envio de arquivos
      const formData = new FormData();

      // Adicionar campos básicos manualmente
      formData.set('nome', values.nome);
      if (values.nome_artistico) formData.set('nome_artistico', values.nome_artistico);
      formData.set('genero', values.genero || 'masculino');
      formData.set('categoria', values.categoria);

      // Tipo (categoria)
      if (values.tipo) formData.set('tipo', values.tipo);

      // Naturalidade e informações de origem
      if (values.natural_de) formData.set('natural_de', values.natural_de);
      if (values.nacionalidade) formData.set('nacionalidade', values.nacionalidade);
      if (values.etnia) formData.set('etnia', values.etnia);
      if (values.data_nascimento)
        formData.set(
          'data_nascimento',
          values.data_nascimento instanceof Date
            ? values.data_nascimento.toISOString().split('T')[0]
            : values.data_nascimento,
        );
      if (values.ano) formData.set('ano', String(values.ano));

      // Características físicas - campos obrigatórios
      formData.set('altura', values.altura);
      formData.set('peso', values.peso);
      if (values.manequim) formData.set('manequim', String(values.manequim));
      if (values.sapato) formData.set('sapato', String(values.sapato));
      if (values.olhos) formData.set('olhos', values.olhos);
      if (values.tipo_cabelo) formData.set('tipo_cabelo', values.tipo_cabelo);
      if (values.cor_cabelo) formData.set('cor_cabelo', values.cor_cabelo);

      // Tatuagens
      formData.set('tem_tatuagens', values.tem_tatuagens ? 'true' : 'false');
      if (values.locais_tatuagens)
        formData.set('locais_tatuagens', values.locais_tatuagens);

      // Documentos
      if (values.DRT) formData.set('DRT', values.DRT);
      if (values.RG) formData.set('RG', values.RG);
      if (values.CPF) formData.set('CPF', values.CPF);
      formData.set('tem_passaporte', values.tem_passaporte ? 'true' : 'false');
      if (values.cnpj) formData.set('cnpj', values.cnpj);
      if (values.razao_social) formData.set('razao_social', values.razao_social);
      if (values.inscricao_estadual)
        formData.set('inscricao_estadual', values.inscricao_estadual);
      formData.set('possui_nota_propria', values.possui_nota_propria ? 'true' : 'false');
      if (values.cnh) formData.set('cnh', values.cnh);

      // Currículo e habilidades
      if (values.curriculum_artistico)
        formData.set('curriculum_artistico', values.curriculum_artistico);
      if (values.habilidades)
        formData.set('habilidades', JSON.stringify(values.habilidades));
      if (values.habilidade_especifica)
        formData.set('habilidade_especifica', values.habilidade_especifica);
      if (values.outros_esportes) formData.set('outros_esportes', values.outros_esportes);
      if (values.outras_modalidades_circenses)
        formData.set('outras_modalidades_circenses', values.outras_modalidades_circenses);
      if (values.outros_instrumentos)
        formData.set('outros_instrumentos', values.outros_instrumentos);
      if (values.terno) formData.set('terno', values.terno);
      if (values.camisa) formData.set('camisa', values.camisa);

      // Links de mídia
      if (values.link_monologo) formData.set('link_monologo', values.link_monologo);
      if (values.link_trabalho_1) formData.set('link_trabalho_1', values.link_trabalho_1);
      if (values.link_trabalho_2) formData.set('link_trabalho_2', values.link_trabalho_2);

      // Links de trabalho adicionais (3 a 7)
      linksTrabalho.forEach((link, index) => {
        if (index >= 2 && link) {
          // A partir do link 3 (índice 2)
          formData.set(`link_trabalho_${index + 1}`, link);
        }
      });

      // Contato
      if (values.telefone) formData.set('telefone', values.telefone);
      if (values.email) formData.set('email', values.email);
      if (values.link_imdb) formData.set('link_imdb', values.link_imdb);
      if (values.link_instagram) formData.set('link_instagram', values.link_instagram);

      // Exclusividade e informações adicionais
      if (values.info_exclusividade)
        formData.set('info_exclusividade', values.info_exclusividade);
      formData.set(
        'exclusividade_outro_age',
        values.exclusividade_outro_age ? 'true' : 'false',
      );

      // Informações bancárias
      if (values.pix_tipo) formData.set('pix_tipo', values.pix_tipo);
      if (values.pix_chave) formData.set('pix_chave', values.pix_chave);
      if (values.dados_bancarios_id)
        formData.set('dados_bancarios_id', values.dados_bancarios_id);

      // IDs relacionados
      if (values.endereco_id) formData.set('endereco_id', values.endereco_id);
      if (values.idiomas_id) formData.set('idiomas_id', values.idiomas_id);
      if (values.usuario_id) formData.set('usuario_id', values.usuario_id);
      if (values.veiculos_id) formData.set('veiculos_id', values.veiculos_id);

      // Adicionar biografia - campos obrigatórios
      formData.set('biografia', values.biografia);
      formData.set('experiencia', values.experiencia);

      // Adicionar campos booleanos
      formData.set('ativo', values.ativo ? 'true' : 'false');
      formData.set(
        'autoriza_imagem_site',
        values.autoriza_imagem_site ? 'true' : 'false',
      );

      // Tratar arrays
      if (values.funcoes && values.funcoes.length > 0) {
        values.funcoes.forEach((habilidade: string) => {
          formData.append('funcoes', habilidade);
        });
      }

      if (values.idiomas && values.idiomas.length > 0) {
        formData.set('idiomas', JSON.stringify(values.idiomas));
      }

      // Adicionar foto principal - campo obrigatório
      if (values.foto_principal) {
        formData.set('foto_principal', values.foto_principal);
      }

      // Depurar o FormData antes de enviar
      const formDataEntries: { [key: string]: any } = {};
      for (const pair of formData.entries()) {
        formDataEntries[pair[0]] = pair[1];
      }

      // Verificar autenticação
      const token = localStorage.getItem('accessToken');
      if (!token) {
        errorToast('Você precisa estar autenticado para criar um casting');
        router.push('/admin/login');
        return;
      }

      // Verificar se o FormData foi criado corretamente - outra forma de debug
      let formDataContent = '';
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          formDataContent += `${key}: ${value}\n`;
        } else {
          formDataContent += `${key}: [Arquivo: ${value.name} - ${(value.size / 1024).toFixed(2)} KB]\n`;
        }
      }

      // Enviar para o backend
      try {
        // Usando a instância de API configurada no projeto
        // Ajustar a URL para usar o proxy local que configuramos no next.config.ts
        const apiUrl = '/api/casting/castings/';
        console.log('Enviando dados para:', apiUrl);

        // Verificar cada chave e valor no formData para debug
        console.log('Conteúdo do FormData:');
        for (const [key, value] of formData.entries()) {
          if (typeof value === 'string') {
            console.log(`${key}: ${value}`);
          } else {
            console.log(
              `${key}: [Arquivo: ${value.name} - ${(value.size / 1024).toFixed(2)} KB]`,
            );
          }
        }

        // Usar a URL relativa para aproveitar o proxy configurado no next.config.ts
        console.log('Enviando dados para o backend...');
        try {
          const response = await api.post('/api/casting/castings/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
            // Aumentar o timeout para uploads grandes
            timeout: 60000, // 60 segundos
          });

          console.log('Resposta do servidor:', response.data);
          const casting = response.data;

          // Adicionar fotos adicionais
          if (compressedFotos.length > 0 && casting && casting.id) {
            console.log('Adicionando fotos adicionais para o casting ID:', casting.id);
            const fotosPromises = compressedFotos.map(async (foto, index) => {
              if (!foto) return null;

              const fotoFormData = new FormData();
              fotoFormData.append('imagem', foto);
              fotoFormData.append('legenda', legendasFotos[index] || '');
              fotoFormData.append('ordem', index.toString());

              try {
                // Verificar se o ID do casting está definido
                if (!casting.id) {
                  console.error('ID do casting indefinido ao adicionar foto');
                  return null;
                }
                return await CastingService.adicionarFoto(casting.id, fotoFormData);
              } catch (error) {
                console.error('Erro ao adicionar foto:', error);
                return null;
              }
            });

            await Promise.all(fotosPromises.filter(Boolean));
          } else if (compressedFotos.length > 0) {
            console.error('Não foi possível adicionar fotos: ID do casting indefinido');
          }

          // Adicionar vídeos
          if (videos.length > 0 && casting && casting.id) {
            console.log('Adicionando vídeos para o casting ID:', casting.id);
            const videosPromises = videos.map(async (url, index) => {
              if (!url) return null;

              try {
                // Verificar se o ID do casting está definido
                if (!casting.id) {
                  console.error('ID do casting indefinido ao adicionar vídeo');
                  return null;
                }
                return await CastingService.adicionarVideo(casting.id, {
                  titulo: descricaoVideos[index] || 'Vídeo ' + (index + 1),
                  url,
                  ordem: index,
                });
              } catch (error) {
                console.error('Erro ao adicionar vídeo:', error);
                return null;
              }
            });

            await Promise.all(videosPromises.filter(Boolean));
          } else if (videos.length > 0) {
            console.error('Não foi possível adicionar vídeos: ID do casting indefinido');
          }

          successToast('Casting cadastrado com sucesso!');
          router.push('/admin/casting');
        } catch (apiError: any) {
          console.error('Erro na chamada da API:', apiError);

          if (apiError.response) {
            console.error('Resposta de erro do servidor:', apiError.response.data);
            throw apiError;
          } else {
            throw apiError;
          }
        }
      } catch (error: any) {
        console.error('Erro ao cadastrar casting:', error);
        console.error('Stack de erro:', error.stack);

        // Log detalhado dos erros
        if (error.response) {
          // Resposta do servidor com status de erro
          console.error('Detalhes do erro:', {
            data: error.response.data,
            status: error.response.status,
            headers: error.response.headers,
          });
        } else if (error.request) {
          // Requisição foi feita mas não houve resposta
          console.error('Sem resposta do servidor:', error.request);
        } else {
          // Erro durante a configuração da requisição
          console.error('Erro de configuração da requisição:', error.message);
        }

        // Verificar se é erro de autenticação
        if (error?.response?.status === 401) {
          errorToast('Sessão expirada. Faça login novamente.');
          localStorage.removeItem('accessToken');
          router.push('/admin/login');
        } else {
          errorToast(
            `Falha ao cadastrar: ${error?.response?.data?.detail || error.message || 'Erro desconhecido'}`,
          );
        }
      }
    } catch (error: unknown) {
      console.error('Erro ao processar formulário:', error);
      if (error instanceof Error) {
        console.error('Detalhes do erro:', error.stack);
      }
      errorToast('Falha ao processar formulário. Tente novamente.');
    } finally {
      console.log('Finalizando processo de salvamento');
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <AdminNavbar />
      <Container size="lg" py="xl">
        <Group position="apart" mb="xl">
          <Title order={2}>Adicionar Novo Casting</Title>
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
              <Tabs.Tab value="idiomas" icon={<IconEdit size={14} />}>
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
                    required
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

                <FileInput
                  label="Foto Principal"
                  description="Selecione uma imagem para a foto principal - formato landscape(formatos: JPG, PNG, WebP)"
                  accept="image/png,image/jpeg,image/webp"
                  icon={<IconUpload size={14} />}
                  {...form.getInputProps('foto_principal')}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

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
                      zIndex: 9999, // Aumentando o z-index para o calendário aparecer acima de outros elementos
                      withinPortal: true, // Renderiza o calendário dentro de um portal para evitar problemas de z-index
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

                  <TextInput
                    label="Manequim"
                    placeholder="Tamanho do manequim"
                    {...form.getInputProps('manequim')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
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

                  <TextInput
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
                    data={tipoCabelo}
                    {...form.getInputProps('tipo_cabelo')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <Select
                    label="Cor do Cabelo"
                    placeholder="Selecione a cor do cabelo"
                    data={corCabelo}
                    disabled={form.values.tipo_cabelo === 'careca'}
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

                <SimpleGrid cols={2} mb="md">
                  <Group align="center">
                    <Switch
                      label="Possui Passaporte"
                      {...form.getInputProps('tem_passaporte', { type: 'checkbox' })}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                  </Group>

                  <TextInput
                    label="CNH"
                    placeholder="Número da CNH"
                    {...form.getInputProps('CNH')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
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

                <Switch
                  label="Possui Nota Própria"
                  {...form.getInputProps('possui_nota_propria', { type: 'checkbox' })}
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
              <Card withBorder p="xl" radius="md" mb="md">
                <Group position="apart" mb="lg">
                  <Title order={3}>Fotos Adicionais</Title>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    variant="outline"
                    onClick={adicionarFoto}
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
                    Adicionar Foto
                  </Button>
                </Group>

                {fotosAdicionais.length === 0 ? (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhuma foto adicional. Clique em &quot;Adicionar Foto&quot; para
                    incluir mais fotos.
                  </Text>
                ) : (
                  fotosAdicionais.map((foto, index) => (
                    <Card key={index} withBorder p="md" radius="md" mb="md">
                      <Group position="apart" mb="xs">
                        <Text weight={500}>Foto {index + 1}</Text>
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
                        ref={undefined} /* Corrigindo o problema de ref no React 19 */
                      />

                      <TextInput
                        label="Legenda"
                        placeholder="Legenda da foto"
                        value={legendasFotos[index] || ''}
                        onChange={(e) => atualizarLegenda(e.target.value, index)}
                        ref={undefined} /* Corrigindo o problema de ref no React 19 */
                      />
                    </Card>
                  ))
                )}
              </Card>

              <Card withBorder p="xl" radius="md" mb="md">
                <Group position="apart" mb="lg">
                  <Title order={3}>Links de Mídia</Title>
                </Group>

                <div>
                  <Group position="apart" mb="lg">
                    <Title order={4}>Link de Monólogo</Title>
                  </Group>
                  <TextInput
                    label="Link de Monólogo"
                    placeholder="URL do monólogo ou apresentação"
                    icon={<IconMovie size={14} />}
                    {...form.getInputProps('link_monologo')}
                    mb="xs"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                  {form.values.link_monologo && (
                    <VideoPreview url={form.values.link_monologo} height={280} />
                  )}
                </div>

                <Divider my="md" label="Links de Trabalho" labelPosition="center" />

                {/* Links de Trabalho 1 e 2 (já existentes no form) */}
                <SimpleGrid cols={2} mb="md">
                  <div>
                    <TextInput
                      label="Link de Trabalho 1"
                      placeholder="URL de algum trabalho realizado"
                      icon={<IconMovie size={14} />}
                      {...form.getInputProps('link_trabalho_1')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                    {form.values.link_trabalho_1 && (
                      <VideoPreview url={form.values.link_trabalho_1} height={280} />
                    )}
                  </div>

                  <div>
                    <TextInput
                      label="Link de Trabalho 2"
                      placeholder="URL de outro trabalho realizado"
                      icon={<IconMovie size={14} />}
                      {...form.getInputProps('link_trabalho_2')}
                      ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    />
                    {form.values.link_trabalho_2 && (
                      <VideoPreview url={form.values.link_trabalho_2} height={280} />
                    )}
                  </div>
                </SimpleGrid>

                {/* Links de Trabalho adicionais (3 a 7) */}
                {linksTrabalho.map(
                  (link, index) =>
                    index >= 2 && (
                      <Box key={`trabalho_${index + 1}`} mb="md">
                        <Group position="apart" mb="xs">
                          <Text weight={500}>Link de Trabalho {index + 1}</Text>
                          <ActionIcon
                            color="red"
                            onClick={() => {
                              const novosLinks = [...linksTrabalho];
                              novosLinks.splice(index, 1);
                              setLinksTrabalho(novosLinks);
                            }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Group>
                        <TextInput
                          placeholder={`URL do trabalho ${index + 1}`}
                          icon={<IconMovie size={14} />}
                          value={link}
                          onChange={(e) => {
                            const novosLinks = [...linksTrabalho];
                            novosLinks[index] = e.target.value;
                            setLinksTrabalho(novosLinks);
                          }}
                          ref={undefined} /* Corrigindo o problema de ref no React 19 */
                        />
                        {link && <VideoPreview url={link} height={280} />}
                      </Box>
                    ),
                )}

                {/* Botão para adicionar mais links de trabalho */}
                {linksTrabalho.length < 9 && (
                  <Group position="center" mt="md">
                    <Button
                      leftIcon={<IconPlus size={16} />}
                      variant="outline"
                      onClick={() => {
                        // Verificar se o último link foi preenchido
                        const ultimoLink = linksTrabalho[linksTrabalho.length - 1];
                        if (!ultimoLink) {
                          notifications.show({
                            title: 'Campo vazio',
                            message: 'Preencha o link atual antes de adicionar outro.',
                            color: 'yellow',
                          });
                          return;
                        }

                        // Adicionar novo link vazio
                        setLinksTrabalho([...linksTrabalho, '']);
                      }}
                      styles={{
                        root: {
                          borderColor: isDark
                            ? '#9333ea !important'
                            : '#7e22ce !important',
                          color: isDark ? '#9333ea !important' : '#7e22ce !important',
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          },
                        },
                      }}
                    >
                      Adicionar Link de Trabalho
                    </Button>
                  </Group>
                )}
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="contato">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Informações de Contato
                </Title>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Email"
                    placeholder="Endereço de email para contato"
                    icon={<IconMail size={14} />}
                    {...form.getInputProps('email')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Telefone"
                    placeholder="Número de telefone com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('telefone')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Celular"
                    placeholder="Número de celular com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('celular')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="WhatsApp"
                    placeholder="Número de WhatsApp (se diferente do celular)"
                    icon={<IconBrandWhatsapp size={14} />}
                    {...form.getInputProps('whatsapp')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Instagram"
                    placeholder="@usuario"
                    icon={<IconBrandInstagram size={14} />}
                    {...form.getInputProps('instagram')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="TikTok"
                    placeholder="@usuario"
                    icon={<IconBrandTiktok size={14} />}
                    {...form.getInputProps('tiktok')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Youtube"
                    placeholder="URL do canal ou vídeo"
                    icon={<IconBrandYoutube size={14} />}
                    {...form.getInputProps('youtube')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <TextInput
                  label="Website"
                  placeholder="URL do site pessoal (se houver)"
                  icon={<IconWorld size={14} />}
                  {...form.getInputProps('website')}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <Divider my="md" label="Contato de Emergência" labelPosition="center" />

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Nome do Contato de Emergência"
                    placeholder="Nome completo"
                    {...form.getInputProps('emergencia_nome')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Telefone de Emergência"
                    placeholder="Número de telefone com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('emergencia_telefone')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="endereco">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Endereço e Informações Financeiras
                </Title>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="CEP"
                    placeholder="Formato: 00000-000"
                    icon={<IconMap size={14} />}
                    {...form.getInputProps('CEP')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Rua/Avenida"
                    placeholder="Nome da rua ou avenida"
                    {...form.getInputProps('rua')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Número"
                    placeholder="Número do endereço"
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
                    placeholder="Nome do bairro"
                    {...form.getInputProps('bairro')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Cidade"
                    placeholder="Nome da cidade"
                    {...form.getInputProps('cidade')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <TextInput
                    label="Estado"
                    placeholder="UF"
                    maxLength={2}
                    {...form.getInputProps('estado')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
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
                  <TextInput
                    label="Banco"
                    placeholder="Número ou nome do banco"
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
                    {...form.getInputProps('pix')}
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />
                </SimpleGrid>
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="idiomas">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Idiomas
                </Title>

                <MultiSelect
                  label="Idiomas"
                  placeholder="Selecione os idiomas que domina"
                  data={[
                    { value: 'portugues', label: 'Português' },
                    { value: 'ingles', label: 'Inglês' },
                    { value: 'espanhol', label: 'Espanhol' },
                    { value: 'frances', label: 'Francês' },
                    { value: 'italiano', label: 'Italiano' },
                    { value: 'alemao', label: 'Alemão' },
                    { value: 'mandarim', label: 'Mandarim' },
                    { value: 'japones', label: 'Japonês' },
                    { value: 'russo', label: 'Russo' },
                    { value: 'arabe', label: 'Árabe' },
                    { value: 'hungaro', label: 'Húngaro' },
                    { value: 'outros', label: 'Outros' },
                  ]}
                  {...form.getInputProps('idiomas')}
                  mb="md"
                  ref={undefined} /* Corrigindo o problema de ref no React 19 */
                />

                <Divider my="md" label="Veículos" labelPosition="center" />

                <Card withBorder p="sm" radius="md" mb="md">
                  <Title order={4} mb="sm">
                    Habilitação
                  </Title>

                  <MultiSelect
                    label="Categorias de Habilitação"
                    placeholder="Selecione as categorias de habilitação que possui"
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
                    {...form.getInputProps('habilitacao_categorias')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                  />

                  <DateInput
                    label="Validade da CNH"
                    placeholder="Data de validade da CNH"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps('habilitacao_validade')}
                    mb="md"
                    ref={undefined} /* Corrigindo o problema de ref no React 19 */
                    popoverProps={{
                      zIndex: 9999, // Aumentando o z-index para o calendário aparecer acima de outros elementos
                      withinPortal: true, // Renderiza o calendário dentro de um portal para evitar problemas de z-index
                    }}
                  />
                </Card>

                <Group position="apart" mb="lg">
                  <Title order={4}>Veículos</Title>
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
                    Adicionar Veículo
                  </Button>
                </Group>

                {videos.length === 0 ? (
                  <Text color="dimmed" align="center" py="lg">
                    Nenhum veículo adicionado. Clique em &quot;Adicionar Veículo&quot;
                    para incluir os veículos do casting.
                  </Text>
                ) : (
                  videos.map((video, index) => (
                    <Card key={index} withBorder p="md" radius="md" mb="md">
                      <Group position="apart" mb="xs">
                        <Text weight={500}>Veículo {index + 1}</Text>
                        <ActionIcon color="red" onClick={() => removerVideo(index)}>
                          <IconTrash size={16} />
                        </ActionIcon>
                      </Group>

                      <TextInput
                        label="Marca e Modelo"
                        placeholder="Ex: Honda Civic, Yamaha Factor, etc."
                        value={video}
                        onChange={(e) => atualizarVideo(e.target.value, index)}
                        icon={<IconCar size={14} />}
                        mb="md"
                        ref={undefined} /* Corrigindo o problema de ref no React 19 */
                      />

                      <TextInput
                        label="Ano"
                        placeholder="Ano do veículo"
                        value={descricaoVideos[index] || ''}
                        onChange={(e) => atualizarDescricaoVideo(e.target.value, index)}
                        ref={undefined} /* Corrigindo o problema de ref no React 19 */
                      />
                    </Card>
                  ))
                )}
              </Card>
            </Tabs.Panel>
          </Tabs>

          <Group position="right" mt="xl">
            <Button variant="outline" onClick={() => router.push('/admin/casting')}>
              Cancelar
            </Button>
            <Button
              type="submit"
              color="purple"
              loading={isSubmitting}
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
              Salvar Casting
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
