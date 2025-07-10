/* eslint-disable camelcase */
/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Card,
  Button,
  Group,
  SimpleGrid,
  Badge,
  useMantineColorScheme,
  Loader,
  Modal,
  TextInput,
  Textarea,
  Select,
  MultiSelect,
  Switch,
  FileInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';
import {
  BlogService,
  type PostResumido,
  type CategoriasBlog,
  type Tag,
} from '@/services';
import { errorToast, successToast } from '@/utils';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload, IconCalendar } from '@tabler/icons-react';

export default function BlogAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [posts, setPosts] = useState<PostResumido[]>([]);
  const [categorias, setCategorias] = useState<CategoriasBlog[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalAberto, { open: abrirModal, close: fecharModal }] = useDisclosure(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [postAtual, setPostAtual] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      titulo: '',
      resumo: '',
      conteudo: '',
      categoria: '',
      tags: [] as string[],
      publicado: true,
      imagem_destaque: null as File | null,
      data_publicacao: new Date(),
    },
    validate: {
      titulo: (value) => (value.trim().length === 0 ? 'O título é obrigatório' : null),
      resumo: (value) => (value.trim().length === 0 ? 'O resumo é obrigatório' : null),
      conteudo: (value) =>
        value.trim().length === 0 ? 'O conteúdo é obrigatório' : null,
      categoria: (value) =>
        value.trim().length === 0 ? 'A categoria é obrigatória' : null,
      data_publicacao: (value) => (!value ? 'A data de publicação é obrigatória' : null),
    },
  });

  // Carregar posts, categorias e tags
  useEffect(() => {
    const carregarDados = async () => {
      if (!isAuthenticated && !authLoading) return;

      try {
        setIsLoading(true);
        const [postsResponse, categoriasResponse, tagsResponse] = await Promise.all([
          BlogService.getPosts({ ordering: '-data_publicacao' }),
          BlogService.getCategorias(),
          BlogService.getTags(),
        ]);

        setPosts(postsResponse.results);
        setCategorias(categoriasResponse.results);
        setTags(tagsResponse.results);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        errorToast('Erro ao carregar dados do blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      carregarDados();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCriarPost = () => {
    form.reset();
    setModoEdicao(false);
    setPostAtual(null);
    abrirModal();
  };

  const handleEditarPost = async (id: number) => {
    try {
      setIsLoading(true);
      const post = await BlogService.getPost(id);

      form.setValues({
        titulo: post.titulo,
        resumo: post.resumo,
        conteudo: post.conteudo,
        categoria: post.categoria.toString(),
        tags: post.tags.map((tag) => tag.id.toString()),
        publicado: post.publicado,
        imagem_destaque: null, // Não podemos carregar o arquivo, apenas a URL
        data_publicacao: post.data_publicacao
          ? new Date(post.data_publicacao)
          : new Date(),
      });

      setModoEdicao(true);
      setPostAtual(id);
      abrirModal();
    } catch (error) {
      console.error('Erro ao carregar post:', error);
      errorToast('Erro ao carregar dados do post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirPost = (id: number) => {
    setPostToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!postToDelete) return;

    try {
      setIsLoading(true);
      await BlogService.excluirPost(postToDelete);

      // Atualizar a lista de posts
      setPosts(posts.filter((post) => post.id !== postToDelete));

      successToast('Post excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      errorToast('Erro ao excluir post');
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setPostToDelete(null);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('titulo', values.titulo);
      formData.append('resumo', values.resumo);
      formData.append('conteudo', values.conteudo);
      formData.append('categoria', values.categoria);
      formData.append('publicado', values.publicado.toString());

      // Formatar a data para o formato ISO
      if (values.data_publicacao) {
        formData.append(
          'data_publicacao',
          values.data_publicacao.toISOString().split('T')[0],
        );
      }

      // Adicionar tags
      values.tags.forEach((tagId) => {
        formData.append('tags', tagId);
      });

      // Adicionar imagem se houver
      if (values.imagem_destaque) {
        formData.append('imagem_destaque', values.imagem_destaque);
      }

      let response: PostResumido;

      if (modoEdicao && postAtual) {
        response = await BlogService.atualizarPost(postAtual, formData);

        // Atualizar o post na lista
        setPosts(
          posts.map((post) =>
            post.id === postAtual
              ? {
                  ...post,
                  titulo: response.titulo,
                  resumo: response.resumo,
                  categoria: response.categoria,
                  categoria_nome: response.categoria_nome,
                  imagem_destaque: response.imagem_destaque,
                  publicado: response.publicado,
                  data_publicacao: response.data_publicacao,
                }
              : post,
          ),
        );

        successToast('Post atualizado com sucesso');
      } else {
        response = await BlogService.criarPost(formData);

        // Adicionar o novo post à lista
        setPosts([response, ...posts]);

        successToast('Post criado com sucesso');
      }

      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      errorToast('Erro ao salvar post');
    } finally {
      setIsLoading(false);
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
          <Title order={2}>Gerenciamento do Bureau Cultural</Title>
          <Button
            onClick={handleCriarPost}
            styles={{
              root: {
                backgroundColor: isDark ? '#404040 !important' : '#737373 !important',
                color: '#FFFFFF !important',
                '&:hover': {
                  backgroundColor: isDark ? '#525252 !important' : '#a3a3a3 !important',
                },
              },
            }}
          >
            Criar Novo Post
          </Button>
        </Group>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '50px 0' }}>
            <Loader size="lg" />
          </div>
        ) : posts.length === 0 ? (
          <Card withBorder p="xl" radius="md">
            <Text align="center" size="lg">
              Nenhum post encontrado. Crie seu primeiro post!
            </Text>
          </Card>
        ) : (
          <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mb="xl">
            {posts.map((post) => (
              <Card key={post.id} p="lg" radius="md" withBorder>
                <Group position="apart" mb="xs">
                  <Badge color="blue">{post.categoria_nome}</Badge>
                  <Text size="xs" color="dimmed">
                    {new Date(post.data_publicacao).toLocaleDateString('pt-BR')}
                  </Text>
                </Group>
                <Title order={3}>{post.titulo}</Title>
                <Text mt="md" color="dimmed">
                  {post.resumo}
                </Text>
                <Group position="apart" mt="xl">
                  <Button
                    onClick={() => handleEditarPost(post.id)}
                    styles={{
                      root: {
                        backgroundColor: isDark
                          ? '#404040 !important'
                          : '#737373 !important',
                        color: '#FFFFFF !important',
                        '&:hover': {
                          backgroundColor: isDark
                            ? '#525252 !important'
                            : '#f3f3f3 !important',
                        },
                      },
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleExcluirPost(post.id)}
                    styles={{
                      root: {
                        backgroundColor: '#dc2626 !important',
                        color: '#FFFFFF !important',
                        '&:hover': {
                          backgroundColor: '#b91c1c !important',
                        },
                      },
                    }}
                  >
                    Excluir
                  </Button>
                </Group>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>

      {/* Modal para criar/editar post */}
      <Modal
        opened={modalAberto}
        onClose={fecharModal}
        title={modoEdicao ? 'Editar Post' : 'Criar Novo Post'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Título"
            placeholder="Título do post"
            required
            {...form.getInputProps('titulo')}
            mb="md"
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <Textarea
            label="Resumo"
            placeholder="Breve resumo do post"
            required
            minRows={2}
            {...form.getInputProps('resumo')}
            mb="md"
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <Textarea
            label="Conteúdo"
            placeholder="Conteúdo completo do post"
            required
            minRows={6}
            {...form.getInputProps('conteudo')}
            mb="md"
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <Select
            label="Categoria"
            placeholder="Selecione uma categoria"
            required
            data={categorias.map((cat) => ({
              value: cat.id.toString(),
              label: cat.nome,
            }))}
            {...form.getInputProps('categoria')}
            mb="md"
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <MultiSelect
            label="Tags"
            placeholder="Selecione as tags"
            data={tags.map((tag) => ({ value: tag.id.toString(), label: tag.nome }))}
            {...form.getInputProps('tags')}
            mb="md"
            required
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <DatePickerInput
            label="Data de Publicação"
            required
            {...form.getInputProps('data_publicacao')}
            mb="md"
            icon={<IconCalendar size={14} />}
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <FileInput
            label="Imagem de Destaque"
            description="Selecione uma imagem"
            accept="image/*"
            icon={<IconUpload size={14} />}
            {...form.getInputProps('imagem_destaque')}
            mb="md"
            required
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <Switch
            label="Publicado"
            {...form.getInputProps('publicado', { type: 'checkbox' })}
            mb="md"
            ref={undefined} /* Corrigindo o problema de ref no React 19 */
          />

          <Group position="right" mt="md">
            <Button
              type="button"
              onClick={fecharModal}
              styles={{
                root: {
                  backgroundColor: isDark ? '#404040 !important' : '#737373 !important',
                  color: '#FFFFFF !important',
                  '&:hover': {
                    backgroundColor: isDark ? '#525252 !important' : '#a3a3a3 !important',
                  },
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              styles={{
                root: {
                  backgroundColor: isDark ? '#404040 !important' : '#737373 !important',
                  color: '#FFFFFF !important',
                  '&:hover': {
                    backgroundColor: isDark ? '#525252 !important' : '#a3a3a3 !important',
                  },
                },
              }}
            >
              {modoEdicao ? 'Atualizar' : 'Criar'}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <Text mb="lg">
          Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.
        </Text>

        <Group position="right">
          <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmarExclusao} loading={isLoading}>
            Excluir
          </Button>
        </Group>
      </Modal>
    </>
  );
}
