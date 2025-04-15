'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Container, Title, Button, Group, TextInput, Textarea, FileInput, Switch, Select, Card, Text, ActionIcon, useMantineColorScheme, Loader } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../../../../components/AdminNavbar';
import { CastingService, type CategoriasCasting, type CastingDetalhado, type Foto, type Video } from '@/services';
import { errorToast, successToast } from '@/utils';
import { IconUpload, IconPlus, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';

export default function EditarCasting() {
  const params = useParams();
  const id = params?.id as string;
  
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [isLoading, setIsLoading] = useState(false);
  const [categorias, setCategorias] = useState<CategoriasCasting[]>([]);
  const [casting, setCasting] = useState<CastingDetalhado | null>(null);
  const [fotosExistentes, setFotosExistentes] = useState<Foto[]>([]);
  const [fotosParaExcluir, setFotosParaExcluir] = useState<number[]>([]);
  const [fotosAdicionais, setFotosAdicionais] = useState<File[]>([]);
  const [legendasFotos, setLegendasFotos] = useState<string[]>([]);
  const [videosExistentes, setVideosExistentes] = useState<Video[]>([]);
  const [videosParaExcluir, setVideosParaExcluir] = useState<number[]>([]);
  const [videosNovos, setVideosNovos] = useState<{ titulo: string; url: string }[]>([]);
  
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

  const dadosCarregados = useRef(false);
  
  useEffect(() => {
    const carregarDados = async () => {
      if (!isAuthenticated || !id || dadosCarregados.current) return;
      
      try {
        setIsLoading(true);
        dadosCarregados.current = true;
        
        // Carregar categorias e casting em paralelo
        const [categoriasResponse, castingResponse] = await Promise.all([
          CastingService.getCategorias({ ordering: 'nome' }),
          CastingService.getCasting(parseInt(id))
        ]);
        
        setCategorias(categoriasResponse.results);
        setCasting(castingResponse);
        setFotosExistentes(castingResponse.fotos);
        setVideosExistentes(castingResponse.videos);
        
        // Preencher o formulário com os dados do casting
        const dataNascimento = castingResponse.data_nascimento ? new Date(castingResponse.data_nascimento) : null;
        
        form.setValues({
          nome: castingResponse.nome,
          categoria: castingResponse.categoria.toString(),
          biografia: castingResponse.biografia || '',
          experiencia: castingResponse.experiencia || '',
          data_nascimento: dataNascimento,
          altura: castingResponse.altura || '',
          peso: castingResponse.peso || '',
          foto_principal: null,
          ativo: castingResponse.ativo,
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
  }, [isAuthenticated, id, form, router]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Funções para gerenciar fotos existentes
  const marcarFotoParaExcluir = (id: number) => {
    setFotosParaExcluir([...fotosParaExcluir, id]);
    setFotosExistentes(fotosExistentes.filter(foto => foto.id !== id));
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
    setVideosExistentes(videosExistentes.filter(video => video.id !== id));
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

  // Função para salvar as alterações
  const handleSubmit = async (values: typeof form.values) => {
    if (!casting) return;
    
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
      
      // Atualizar o casting
      await CastingService.atualizarCasting(casting.id, formData);
      
      // Excluir fotos marcadas para exclusão
      const excluirFotosPromises = fotosParaExcluir.map(id => 
        CastingService.excluirFoto(casting.id, id)
      );
      
      await Promise.all(excluirFotosPromises);
      
      // Adicionar novas fotos
      const uploadFotosPromises = fotosAdicionais.map(async (foto, index) => {
        if (!foto) return null;
        
        const fotoFormData = new FormData();
        fotoFormData.append('imagem', foto);
        fotoFormData.append('legenda', legendasFotos[index] || '');
        fotoFormData.append('ordem', (fotosExistentes.length + index).toString());
        
        return CastingService.adicionarFoto(casting.id, fotoFormData);
      });
      
      await Promise.all(uploadFotosPromises.filter(Boolean));
      
      // Excluir vídeos marcados para exclusão
      const excluirVideosPromises = videosParaExcluir.map(id => 
        CastingService.excluirVideo(casting.id, id)
      );
      
      await Promise.all(excluirVideosPromises);
      
      // Adicionar novos vídeos
      const uploadVideosPromises = videosNovos.map(async (video, index) => {
        if (!video.titulo || !video.url) return null;
        
        return CastingService.adicionarVideo(casting.id, {
          titulo: video.titulo,
          url: video.url,
          ordem: videosExistentes.length + index
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Informações Básicas</Title>
            
            <TextInput
              label="Nome"
              placeholder="Nome do casting"
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
            
            <Group align="flex-start" mb="md">
              <div style={{ flex: 1 }}>
                <FileInput
                  label="Foto Principal"
                  description="Selecione uma nova imagem para substituir a atual"
                  accept="image/png,image/jpeg,image/webp"
                  icon={<IconUpload size={14} />}
                  {...form.getInputProps('foto_principal')}
                />
              </div>
              
              {casting.foto_principal && (
                <div>
                  <Text size="sm" weight={500} mb={5}>Foto Atual</Text>
                  <div style={{ width: 100, height: 100, position: 'relative', overflow: 'hidden', borderRadius: '4px' }}>
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
              placeholder="Biografia do casting"
              minRows={4}
              {...form.getInputProps('biografia')}
              mb="md"
            />
            
            <Textarea
              label="Experiência"
              placeholder="Experiência profissional do casting"
              minRows={4}
              {...form.getInputProps('experiencia')}
              mb="md"
            />
          </Card>
          
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
                  }
                }}
              >
                Adicionar Foto
              </Button>
            </Group>
            
            {/* Fotos existentes */}
            {fotosExistentes.length > 0 && (
              <>
                <Title order={4} mb="md">Fotos Existentes</Title>
                <Group mb="xl">
                  {fotosExistentes.map((foto) => (
                    <Card key={foto.id} withBorder p="md" radius="md" style={{ width: 200 }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '100%', height: 150, position: 'relative', overflow: 'hidden', borderRadius: '4px', marginBottom: 10 }}>
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
                          style={{ position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(255,255,255,0.8)' }}
                          onClick={() => marcarFotoParaExcluir(foto.id)}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      </div>
                      <Text size="sm" align="center">{foto.legenda || 'Sem legenda'}</Text>
                    </Card>
                  ))}
                </Group>
              </>
            )}
            
            {/* Novas fotos */}
            {fotosAdicionais.length > 0 && (
              <>
                <Title order={4} mb="md">Novas Fotos</Title>
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
                Nenhuma foto adicionada. Clique em &quot;Adicionar Foto&quot; para incluir fotos.
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
                  }
                }}
              >
                Adicionar Vídeo
              </Button>
            </Group>
            
            {/* Vídeos existentes */}
            {videosExistentes.length > 0 && (
              <>
                <Title order={4} mb="md">Vídeos Existentes</Title>
                {videosExistentes.map((video) => (
                  <Card key={video.id} withBorder p="md" radius="md" mb="md">
                    <Group position="apart" mb="xs">
                      <Text weight={500}>{video.titulo}</Text>
                      <ActionIcon color="red" onClick={() => marcarVideoParaExcluir(video.id)}>
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                    <Text component="a" href={video.url} target="_blank" rel="noopener noreferrer" size="sm" color="blue">
                      {video.url}
                    </Text>
                  </Card>
                ))}
              </>
            )}
            
            {/* Novos vídeos */}
            {videosNovos.length > 0 && (
              <>
                <Title order={4} mb="md">Novos Vídeos</Title>
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
                ))}
              </>
            )}
            
            {videosExistentes.length === 0 && videosNovos.length === 0 && (
              <Text color="dimmed" align="center" py="lg">
                Nenhum vídeo adicionado. Clique em &quot;Adicionar Vídeo&quot; para incluir vídeos.
              </Text>
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
              Atualizar Casting
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
