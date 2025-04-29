/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
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
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
// import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../../../components/AdminNavbar';
import { CastingService, api } from '@/services';
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
    extensions: [StarterKit, Link, TextAlign, Highlight],
    content: form.getInputProps('curriculum_artistico').value,
    onUpdate: ({ editor }) =>
      form.getInputProps('curriculum_artistico').onChange(editor.getHTML()),
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
      if (
        !values.altura ||
        !values.peso ||
        !values.biografia ||
        !values.experiencia ||
        !values.foto_principal
      ) {
        errorToast('Por favor, preencha todos os campos obrigatórios');
        return;
      }

      // Criar FormData para envio de arquivos
      const formData = new FormData();

      // Adicionar campos básicos manualmente
      formData.set('nome', values.nome);
      if (values.nome_artistico) formData.set('nome_artistico', values.nome_artistico);
      formData.set('genero', values.genero || 'masculino');
      formData.set('categoria', values.categoria);

      // Características físicas - campos obrigatórios
      formData.set('altura', values.altura);
      formData.set('peso', values.peso);
      if (values.manequim) formData.set('manequim', String(values.manequim));
      if (values.sapato) formData.set('sapato', String(values.sapato));

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
        const response = await api.post('/api/casting/castings/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          // Aumentar o timeout para uploads grandes
          timeout: 60000, // 60 segundos
        });

        const casting = response.data;

        // Adicionar fotos adicionais
        if (compressedFotos.length > 0) {
          const fotosPromises = compressedFotos.map(async (foto, index) => {
            if (!foto) return null;

            const fotoFormData = new FormData();
            fotoFormData.append('imagem', foto);
            fotoFormData.append('legenda', legendasFotos[index] || '');
            fotoFormData.append('ordem', index.toString());

            try {
              return await CastingService.adicionarFoto(casting.id, fotoFormData);
            } catch (error) {
              console.error('Erro ao adicionar foto:', error);
              return null;
            }
          });

          await Promise.all(fotosPromises.filter(Boolean));
        }

        // Adicionar vídeos
        if (videos.length > 0) {
          const videosPromises = videos.map(async (url, index) => {
            if (!url) return null;

            try {
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
        }

        successToast('Casting cadastrado com sucesso!');
        router.push('/admin/casting');
      } catch (error: any) {
        console.error('Erro ao cadastrar casting:', error);

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
    } catch (error) {
      console.error('Erro ao processar formulário:', error);
      errorToast('Falha ao processar formulário. Tente novamente.');
    } finally {
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
                  />
                </SimpleGrid>

                <SimpleGrid cols={3}>
                  <Select
                    label="Gênero"
                    placeholder="Selecione o gênero"
                    data={genderData}
                    {...form.getInputProps('genero')}
                  />
                </SimpleGrid>

                <MultiSelect
                  label="Habilidades"
                  searchable
                  clearable
                  placeholder="Selecione uma ou mais habilidades"
                  data={habilidadesData}
                  {...form.getInputProps('habilidades')}
                />

                <SimpleGrid cols={3}>
                  <TextInput
                    label="Naturalidade"
                    placeholder="Natural de (município/estado)"
                    {...form.getInputProps('natural_de')}
                    mb="md"
                  />
                  <Select
                    label="Nacionalidade"
                    searchable
                    placeholder="Nacionalidade"
                    nothingFound="Não encontrado"
                    clearable
                    data={nationality}
                    {...form.getInputProps('nacionalidade')}
                  />

                  <Select
                    label="Etnia"
                    placeholder="Selecione a etnia"
                    data={etny}
                    {...form.getInputProps('etnia')}
                  />
                </SimpleGrid>

                <FileInput
                  label="Foto Principal"
                  description="Selecione uma imagem para a foto principal - formato landscape(formatos: JPG, PNG, WebP)"
                  accept="image/png,image/jpeg,image/webp"
                  icon={<IconUpload size={14} />}
                  {...form.getInputProps('foto_principal')}
                  mb="md"
                />

                <Switch
                  label="Ativo"
                  {...form.getInputProps('ativo', { type: 'checkbox' })}
                  mb="md"
                />

                <Switch
                  label="Autoriza imagem no site"
                  {...form.getInputProps('autoriza_imagem_site', { type: 'checkbox' })}
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
                  />

                  <NumberInput
                    label="Ano"
                    placeholder="Ano de nascimento"
                    min={1900}
                    max={new Date().getFullYear()}
                    {...form.getInputProps('ano')}
                  />

                  <NumberInput
                    label="Altura (em metros)"
                    placeholder="Ex: 1.75"
                    precision={2}
                    min={0.5}
                    max={2.5}
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
                  />

                  <NumberInput
                    label="Manequim"
                    placeholder="Tamanho do manequim"
                    {...form.getInputProps('manequim')}
                  />

                  <NumberInput
                    label="Sapato"
                    placeholder="Número do sapato"
                    {...form.getInputProps('sapato')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <NumberInput
                    label="Terno"
                    placeholder="Tamanho do terno"
                    {...form.getInputProps('terno')}
                  />

                  <NumberInput
                    label="Camisa"
                    placeholder="Tamanho da camisa"
                    {...form.getInputProps('camisa')}
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
                  />

                  <Select
                    label="Cor do Cabelo"
                    placeholder="Selecione a cor do cabelo"
                    data={corCabelo}
                    {...form.getInputProps('cor_cabelo')}
                  />
                </SimpleGrid>

                <Switch
                  label="Possui Tatuagens"
                  {...form.getInputProps('tem_tatuagens', { type: 'checkbox' })}
                  mb="md"
                />

                {form.values.tem_tatuagens && (
                  <Textarea
                    label="Locais das Tatuagens"
                    placeholder="Descreva onde estão localizadas as tatuagens"
                    {...form.getInputProps('locais_tatuagens')}
                    mb="md"
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
                  />

                  <TextInput
                    label="RG"
                    placeholder="Número do RG"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('RG')}
                  />

                  <TextInput
                    label="CPF"
                    placeholder="Número do CPF"
                    icon={<IconId size={14} />}
                    {...form.getInputProps('CPF')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <Group align="center">
                    <Switch
                      label="Possui Passaporte"
                      {...form.getInputProps('tem_passaporte', { type: 'checkbox' })}
                    />
                  </Group>

                  <TextInput
                    label="CNH"
                    placeholder="Número da CNH"
                    {...form.getInputProps('CNH')}
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
                  />

                  <TextInput
                    label="Razão Social"
                    placeholder="Razão Social da empresa"
                    {...form.getInputProps('razao_social')}
                  />

                  <TextInput
                    label="Inscrição Estadual"
                    placeholder="Número da Inscrição Estadual"
                    {...form.getInputProps('inscricao_estadual')}
                  />
                </SimpleGrid>

                <Switch
                  label="Possui Nota Própria"
                  {...form.getInputProps('possui_nota_propria', { type: 'checkbox' })}
                  mb="md"
                />
              </Card>
            </Tabs.Panel>

            <Tabs.Panel value="habilidades">
              <Card withBorder p="xl" radius="md" mb="md">
                <Title order={3} mb="lg">
                  Biografia e Experiência
                </Title>

                <Text size="sm" fw={500} mb="xs">
                  Mini Curriculo
                </Text>
                <RichTextEditor editor={editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Highlight />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.H1 />
                      <RichTextEditor.H2 />
                      <RichTextEditor.H3 />
                      <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Hr />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  <RichTextEditor.Content placeholder="Mini Curriculo" />
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
                      />

                      <TextInput
                        label="Legenda"
                        placeholder="Legenda da foto"
                        value={legendasFotos[index] || ''}
                        onChange={(e) => atualizarLegenda(e.target.value, index)}
                      />
                    </Card>
                  ))
                )}
              </Card>

              <Card withBorder p="xl" radius="md" mb="md">
                <Group position="apart" mb="lg">
                  <Title order={3}>Links de Mídia</Title>
                </Group>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Link de Monólogo"
                    placeholder="URL do monólogo ou apresentação"
                    icon={<IconMovie size={14} />}
                    {...form.getInputProps('link_monologo')}
                  />

                  <TextInput
                    label="Link de Trabalho 1"
                    placeholder="URL de algum trabalho realizado"
                    icon={<IconMovie size={14} />}
                    {...form.getInputProps('link_trabalho_1')}
                  />
                </SimpleGrid>

                <TextInput
                  label="Link de Trabalho 2"
                  placeholder="URL de outro trabalho realizado"
                  icon={<IconMovie size={14} />}
                  {...form.getInputProps('link_trabalho_2')}
                  mb="md"
                />
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
                  />

                  <TextInput
                    label="Telefone"
                    placeholder="Número de telefone com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('telefone')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Celular"
                    placeholder="Número de celular com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('celular')}
                  />

                  <TextInput
                    label="WhatsApp"
                    placeholder="Número de WhatsApp (se diferente do celular)"
                    icon={<IconBrandWhatsapp size={14} />}
                    {...form.getInputProps('whatsapp')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Instagram"
                    placeholder="@usuario"
                    icon={<IconBrandInstagram size={14} />}
                    {...form.getInputProps('instagram')}
                  />

                  <TextInput
                    label="TikTok"
                    placeholder="@usuario"
                    icon={<IconBrandTiktok size={14} />}
                    {...form.getInputProps('tiktok')}
                  />

                  <TextInput
                    label="Youtube"
                    placeholder="URL do canal ou vídeo"
                    icon={<IconBrandYoutube size={14} />}
                    {...form.getInputProps('youtube')}
                  />
                </SimpleGrid>

                <TextInput
                  label="Website"
                  placeholder="URL do site pessoal (se houver)"
                  icon={<IconWorld size={14} />}
                  {...form.getInputProps('website')}
                  mb="md"
                />

                <Divider my="md" label="Contato de Emergência" labelPosition="center" />

                <SimpleGrid cols={2} mb="md">
                  <TextInput
                    label="Nome do Contato de Emergência"
                    placeholder="Nome completo"
                    {...form.getInputProps('emergencia_nome')}
                  />

                  <TextInput
                    label="Telefone de Emergência"
                    placeholder="Número de telefone com DDD"
                    icon={<IconPhone size={14} />}
                    {...form.getInputProps('emergencia_telefone')}
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
                  />

                  <TextInput
                    label="Rua/Avenida"
                    placeholder="Nome da rua ou avenida"
                    {...form.getInputProps('rua')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Número"
                    placeholder="Número do endereço"
                    {...form.getInputProps('numero')}
                  />

                  <TextInput
                    label="Complemento"
                    placeholder="Apto, bloco, etc (se houver)"
                    {...form.getInputProps('complemento')}
                  />

                  <TextInput
                    label="Bairro"
                    placeholder="Nome do bairro"
                    {...form.getInputProps('bairro')}
                  />
                </SimpleGrid>

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Cidade"
                    placeholder="Nome da cidade"
                    {...form.getInputProps('cidade')}
                  />

                  <TextInput
                    label="Estado"
                    placeholder="UF"
                    maxLength={2}
                    {...form.getInputProps('estado')}
                  />

                  <TextInput
                    label="País"
                    placeholder="País"
                    {...form.getInputProps('pais')}
                  />
                </SimpleGrid>

                <Divider my="md" label="Dados Bancários" labelPosition="center" />

                <SimpleGrid cols={3} mb="md">
                  <TextInput
                    label="Banco"
                    placeholder="Número ou nome do banco"
                    {...form.getInputProps('banco')}
                  />

                  <TextInput
                    label="Agência"
                    placeholder="Número da agência"
                    {...form.getInputProps('agencia')}
                  />

                  <TextInput
                    label="Conta"
                    placeholder="Número da conta com dígito"
                    {...form.getInputProps('conta')}
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
                  />

                  <TextInput
                    label="PIX"
                    placeholder="Chave PIX"
                    {...form.getInputProps('pix')}
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
                  />

                  <DateInput
                    label="Validade da CNH"
                    placeholder="Data de validade da CNH"
                    valueFormat="DD/MM/YYYY"
                    {...form.getInputProps('habilitacao_validade')}
                    mb="md"
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
                      />

                      <TextInput
                        label="Ano"
                        placeholder="Ano do veículo"
                        value={descricaoVideos[index] || ''}
                        onChange={(e) => atualizarDescricaoVideo(e.target.value, index)}
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
