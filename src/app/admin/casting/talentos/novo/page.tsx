'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Button, Group, TextInput, Textarea, Switch, Select, Card, Text, ActionIcon, useMantineColorScheme, Loader, FileInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../../../components/AdminNavbar';
import { CastingService, type CategoriasCasting } from '@/services';
import { errorToast, successToast } from '@/utils';
import { IconUpload, IconPlus, IconTrash } from '@tabler/icons-react';

export default function NovoTalento() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<CategoriasCasting[]>([]);
  const [fotosAdicionais, setFotosAdicionais] = useState<File[]>([]);
  const [legendasFotos, setLegendasFotos] = useState<string[]>([]);
  const [videos, setVideos] = useState<{ titulo: string; url: string }[]>([]);
  
  const form = useForm({
    initialValues: {
      nome: '',
      categoria: '',
      biografia: '',
      experiencia: '',
      data_nascimento: null as Date | null,
      altura: '',
      peso: '',
      foto_principal: null as File | null,
      ativo: true,
    },
    validate: {
      nome: (value) => value.trim().length === 0 ? 'O nome é obrigatório' : null,
      categoria: (value) => value.trim().length === 0 ? 'A categoria é obrigatória' : null,
    },
  });

  // Carregar categorias
  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const response = await CastingService.getCategorias({ ordering: 'nome' });
        setCategorias(response.results);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        errorToast('Erro ao carregar categorias');
      }
    };

    if (isAuthenticated) {
      carregarCategorias();
    }
  }, [isAuthenticated]);

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
    setVideos([...videos, { titulo: '', url: '' }]);
  };

  const removerVideo = (index: number) => {
    const novosVideos = [...videos];
    novosVideos.splice(index, 1);
    setVideos(novosVideos);
  };

  const atualizarVideo = (campo: 'titulo' | 'url', valor: string, index: number) => {
    const novosVideos = [...videos];
    novosVideos[index] = { ...novosVideos[index], [campo]: valor };
    setVideos(novosVideos);
  };

  // Função para salvar o talento
  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);
      
      // Criar FormData para envio de arquivos
      const formData = new FormData();
      formData.append('nome', values.nome);
      formData.append('categoria', values.categoria);
      formData.append('biografia', values.biografia || '');
      formData.append('experiencia', values.experiencia || '');
      formData.append('ativo', values.ativo ? 'true' : 'false');
      
      if (values.data_nascimento) {
        formData.append('data_nascimento', values.data_nascimento.toISOString().split('T')[0]);
      }
      
      if (values.altura) {
        formData.append('altura', values.altura);
      }
      
      if (values.peso) {
        formData.append('peso', values.peso);
      }
      
      if (values.foto_principal) {
        formData.append('foto_principal', values.foto_principal);
      }
      
      // Criar o talento
      const talento = await CastingService.criarTalento(formData);
      
      // Adicionar fotos adicionais
      const uploadPromises = fotosAdicionais.map(async (foto, index) => {
        if (!foto) return null;
        
        const fotoFormData = new FormData();
        fotoFormData.append('imagem', foto);
        fotoFormData.append('legenda', legendasFotos[index] || '');
        fotoFormData.append('ordem', index.toString());
        
        return CastingService.adicionarFoto(talento.id, fotoFormData);
      });
      
      await Promise.all(uploadPromises.filter(Boolean));
      
      // Adicionar vídeos
      const videoPromises = videos.map(async (video, index) => {
        if (!video.titulo || !video.url) return null;
        
        return CastingService.adicionarVideo(talento.id, {
          titulo: video.titulo,
          url: video.url,
          ordem: index
        });
      });
      
      await Promise.all(videoPromises.filter(Boolean));
      
      successToast('Talento criado com sucesso');
      router.push('/admin/casting');
    } catch (error) {
      console.error('Erro ao criar talento:', error);
      errorToast('Erro ao criar talento');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
          <Title order={2}>Adicionar Novo Talento</Title>
        </Group>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Informações Básicas</Title>
            
            <TextInput
              label="Nome"
              placeholder="Nome do talento"
              required
              {...form.getInputProps('nome')}
              mb="md"
            />
            
            <Select
              label="Categoria"
              placeholder="Selecione uma categoria"
              data={categorias.map(cat => ({ value: cat.id.toString(), label: cat.nome }))}
              required
              {...form.getInputProps('categoria')}
              mb="md"
            />
            
            <FileInput
              label="Foto Principal"
              description="Selecione uma imagem para a foto principal"
              accept="image/png,image/jpeg,image/webp"
              icon={<IconUpload size={14} />}
              {...form.getInputProps('foto_principal')}
              mb="md"
            />
            
            <Switch
              label="Ativo"
              {...form.getInputProps('ativo', { type: 'checkbox' })}
              mb="xl"
            />
          </Card>
          
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Informações Pessoais</Title>
            
            <DateInput
              label="Data de Nascimento"
              placeholder="Selecione a data"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps('data_nascimento')}
              mb="md"
            />
            
            <TextInput
              label="Altura (em metros)"
              placeholder="Ex: 1.75"
              {...form.getInputProps('altura')}
              mb="md"
            />
            
            <TextInput
              label="Peso (em kg)"
              placeholder="Ex: 70"
              {...form.getInputProps('peso')}
              mb="md"
            />
          </Card>
          
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Biografia e Experiência</Title>
            
            <Textarea
              label="Biografia"
              placeholder="Biografia do talento"
              minRows={4}
              {...form.getInputProps('biografia')}
              mb="md"
            />
            
            <Textarea
              label="Experiência"
              placeholder="Experiência profissional do talento"
              minRows={4}
              {...form.getInputProps('experiencia')}
              mb="md"
            />
          </Card>
          
          <Card withBorder p="xl" radius="md" mb="xl">
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
                  }
                }}
              >
                Adicionar Foto
              </Button>
            </Group>
            
            {fotosAdicionais.length === 0 ? (
              <Text color="dimmed" align="center" py="lg">
                Nenhuma foto adicional. Clique em &quot;Adicionar Foto&quot; para incluir mais fotos.
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
                  }
                }}
              >
                Adicionar Vídeo
              </Button>
            </Group>
            
            {videos.length === 0 ? (
              <Text color="dimmed" align="center" py="lg">
                Nenhum vídeo adicionado. Clique em &quot;Adicionar Vídeo&quot; para incluir vídeos.
              </Text>
            ) : (
              videos.map((video, index) => (
                <Card key={index} withBorder p="md" radius="md" mb="md">
                  <Group position="apart" mb="xs">
                    <Text weight={500}>Vídeo {index + 1}</Text>
                    <ActionIcon color="red" onClick={() => removerVideo(index)}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                  
                  <TextInput
                    label="Título"
                    placeholder="Título do vídeo"
                    value={video.titulo}
                    onChange={(e) => atualizarVideo('titulo', e.target.value, index)}
                    mb="md"
                  />
                  
                  <TextInput
                    label="URL"
                    placeholder="URL do vídeo (YouTube, Vimeo, etc.)"
                    value={video.url}
                    onChange={(e) => atualizarVideo('url', e.target.value, index)}
                  />
                </Card>
              ))
            )}
          </Card>
          
          <Group position="right" mt="xl">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/casting')}
            >
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
                  }
                }
              }}
            >
              Salvar Talento
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
