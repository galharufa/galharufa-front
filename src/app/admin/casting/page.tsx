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
  useMantineColorScheme,
  Loader,
  Modal,
  TextInput,
  Textarea,
  Tabs,
  Table,
  ActionIcon,
} from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';
import { CastingService, type CategoriasCasting, type CastingResumido } from '@/services';
import { errorToast, successToast } from '@/utils';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Image from 'next/image';

export default function CastingAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [categorias, setCategorias] = useState<CategoriasCasting[]>([]);
  const [castings, setCastings] = useState<CastingResumido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string | null>('categorias');

  // Estados para modal de categoria
  const [
    categoriaModalAberto,
    { open: abrirCategoriaModal, close: fecharCategoriaModal },
  ] = useDisclosure(false);
  const [modoEdicaoCategoria, setModoEdicaoCategoria] = useState(false);
  const [categoriaAtual, setCategoriaAtual] = useState<number | null>(null);
  const [deleteModalCategoriaOpen, setDeleteModalCategoriaOpen] = useState(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);

  // Formulário de categoria
  const categoriaForm = useForm({
    initialValues: {
      nome: '',
      descricao: '',
    },
    validate: {
      nome: (value) => (value.trim().length === 0 ? 'O nome é obrigatório' : null),
      descricao: (value) =>
        value.trim().length === 0 ? 'A descrição é obrigatória' : null,
    },
  });

  // Função para contar castings por categoria
  const getCastingsCountByCategoria = (categoriaId: number): number => {
    return castings.filter((casting) =>
      casting.categoria?.includes(categoriaId.toString()),
    ).length;
  };

  // Carregar categorias e talentos
  useEffect(() => {
    const carregarDados = async () => {
      if (!isAuthenticated && !authLoading) return;

      try {
        setIsLoading(true);
        const [categoriasResponse, castingsResponse] = await Promise.all([
          CastingService.getCategorias({ ordering: 'nome' }),
          CastingService.getCastings({ ordering: 'nome' }),
        ]);

        setCategorias(categoriasResponse.results);
        setCastings(castingsResponse.results);
      } catch (error) {
        console.error('Erro ao carregar dados de casting:', error);
        errorToast('Erro ao carregar dados de casting');
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

  // Funções para gerenciar categorias
  const handleCriarCategoria = () => {
    categoriaForm.reset();
    setModoEdicaoCategoria(false);
    setCategoriaAtual(null);
    abrirCategoriaModal();
  };

  const handleEditarCategoria = async (id: number) => {
    try {
      setIsLoading(true);
      const categoria = await CastingService.getCategoria(id);

      categoriaForm.setValues({
        nome: categoria.nome,
        descricao: categoria.descricao,
      });

      setModoEdicaoCategoria(true);
      setCategoriaAtual(id);
      abrirCategoriaModal();
    } catch (error) {
      console.error('Erro ao carregar categoria:', error);
      errorToast('Erro ao carregar dados da categoria');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirCategoria = (id: number) => {
    setCategoriaToDelete(id);
    setDeleteModalCategoriaOpen(true);
  };

  const confirmarExclusaoCategoria = async () => {
    if (!categoriaToDelete) return;

    try {
      setIsLoading(true);
      await CastingService.excluirCategoria(categoriaToDelete);

      // Atualizar a lista de categorias
      setCategorias(categorias.filter((cat) => cat.id !== categoriaToDelete));

      successToast('Categoria excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      errorToast(
        'Erro ao excluir categoria. Verifique se não existem castings associados a ela.',
      );
    } finally {
      setIsLoading(false);
      setDeleteModalCategoriaOpen(false);
      setCategoriaToDelete(null);
    }
  };

  const handleSubmitCategoria = async (values: typeof categoriaForm.values) => {
    try {
      setIsLoading(true);

      let response: CategoriasCasting;

      if (modoEdicaoCategoria && categoriaAtual) {
        response = await CastingService.atualizarCategoria(categoriaAtual, values);

        // Atualizar a categoria na lista
        setCategorias(
          categorias.map((cat) => (cat.id === categoriaAtual ? response : cat)),
        );

        successToast('Categoria atualizada com sucesso');
      } else {
        response = await CastingService.criarCategoria(values);

        // Adicionar a nova categoria à lista
        setCategorias([...categorias, response]);

        successToast('Categoria criada com sucesso');
      }

      fecharCategoriaModal();
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      errorToast('Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  // Navegação para criar novo casting
  const handleCriarCasting = () => {
    router.push('/admin/casting/castings/novo');
  };

  // Navegação para editar casting
  const handleEditarCasting = (id: string) => {
    router.push(`/admin/casting/castings/editar/${id}`);
  };

  // Função para excluir casting
  const handleExcluirCasting = async (id: string) => {
    if (
      !confirm(
        'Tem certeza que deseja excluir este casting? Esta ação não pode ser desfeita.',
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      await CastingService.excluirCasting(id);

      // Atualizar a lista de castings
      setCastings(castings.filter((casting) => casting.id !== id));

      successToast('Casting excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir talento:', error);
      errorToast('Erro ao excluir casting');
    } finally {
      setIsLoading(false);
    }
  };

  // // Contagem de castings por categoria
  // const getCastingsCountByCategoria = (categoriaId: number) => {
  //   return castings.filter((casting) => casting.categoria === categoriaId).length;
  // };

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
          <Title order={2}>Gerenciamento de Casting</Title>
          <Group>
            <Button
              onClick={handleCriarCategoria}
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
              Nova Categoria
            </Button>
            <Button
              onClick={handleCriarCasting}
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
              Novo Casting
            </Button>
          </Group>
        </Group>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader size="xl" />
          </div>
        ) : (
          <Tabs value={activeTab} onTabChange={setActiveTab}>
            <Tabs.List mb="xl">
              <Tabs.Tab value="categorias">Categorias</Tabs.Tab>
              <Tabs.Tab value="castings">Castings</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="categorias">
              {categorias.length === 0 ? (
                <Card withBorder p="xl" radius="md">
                  <Text align="center" size="lg">
                    Nenhuma categoria cadastrada.
                  </Text>
                </Card>
              ) : (
                <SimpleGrid
                  cols={4}
                  breakpoints={[
                    { maxWidth: 'md', cols: 2 },
                    { maxWidth: 'xs', cols: 1 },
                  ]}
                  mb="xl"
                >
                  {categorias.map((categoria) => {
                    const count = getCastingsCountByCategoria(categoria.id);
                    return (
                      <Card key={categoria.id} p="lg" radius="md" withBorder>
                        <Group position="apart">
                          <Title order={3}>{categoria.nome}</Title>
                          <Group spacing={8}>
                            <ActionIcon
                              color="blue"
                              onClick={() => handleEditarCategoria(categoria.id)}
                            >
                              <IconEdit size={18} />
                            </ActionIcon>
                            <ActionIcon
                              color="red"
                              onClick={() => handleExcluirCategoria(categoria.id)}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </Group>
                        </Group>
                        <Text size="xl" weight={700} mt="md">
                          {count}
                        </Text>
                        <Text size="sm" color="dimmed">
                          castings cadastrados
                        </Text>
                        <Text mt="md" color="dimmed" size="sm">
                          {categoria.descricao}
                        </Text>
                      </Card>
                    );
                  })}
                </SimpleGrid>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="castings">
              {castings.length === 0 ? (
                <Card withBorder p="xl" radius="md">
                  <Text align="center" size="lg">
                    Nenhum casting cadastrado.
                  </Text>
                </Card>
              ) : (
                <Card withBorder p={0} radius="md">
                  <Table striped highlightOnHover>
                    <thead>
                      <tr>
                        <th>Foto</th>
                        <th>Nome</th>
                        <th>Categoria</th>
                        <th>Status</th>
                        <th style={{ width: 120 }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {castings.map((casting) => (
                        <tr key={casting.id}>
                          <td style={{ width: 60 }}>
                            {casting.foto_principal ? (
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  position: 'relative',
                                  overflow: 'hidden',
                                  borderRadius: '4px',
                                }}
                              >
                                <Image
                                  src={casting.foto_principal}
                                  alt={casting.nome}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                            ) : (
                              <div
                                style={{
                                  width: 50,
                                  height: 50,
                                  backgroundColor: '#f0f0f0',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Text size="xs" color="dimmed">
                                  Sem foto
                                </Text>
                              </div>
                            )}
                          </td>
                          <td>{casting.nome}</td>
                          <td>{casting.categoria_nome}</td>
                          <td>
                            {casting.ativo ? (
                              <Text color="green">Ativo</Text>
                            ) : (
                              <Text color="gray">Inativo</Text>
                            )}
                          </td>
                          <td>
                            <Group spacing={8}>
                              <ActionIcon
                                color="blue"
                                onClick={() => handleEditarCasting(String(casting.id))}
                              >
                                <IconEdit size={18} />
                              </ActionIcon>
                              <ActionIcon
                                color="red"
                                onClick={() => handleExcluirCasting(casting.id)}
                              >
                                <IconTrash size={18} />
                              </ActionIcon>
                            </Group>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              )}
            </Tabs.Panel>
          </Tabs>
        )}
      </Container>

      {/* Modal de criação/edição de categoria */}
      <Modal
        opened={categoriaModalAberto}
        onClose={fecharCategoriaModal}
        title={modoEdicaoCategoria ? 'Editar Categoria' : 'Nova Categoria'}
        size="md"
      >
        <form onSubmit={categoriaForm.onSubmit(handleSubmitCategoria)}>
          <TextInput
            label="Nome"
            placeholder="Nome da categoria"
            required
            {...categoriaForm.getInputProps('nome')}
            mb="md"
          />

          <Textarea
            label="Descrição"
            placeholder="Descrição da categoria"
            required
            minRows={3}
            {...categoriaForm.getInputProps('descricao')}
            mb="xl"
          />

          <Group position="right">
            <Button
              type="button"
              onClick={fecharCategoriaModal}
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
              {modoEdicaoCategoria ? 'Atualizar' : 'Salvar'}
            </Button>
          </Group>
        </form>
      </Modal>

      {/* Modal de confirmação de exclusão de categoria */}
      <Modal
        opened={deleteModalCategoriaOpen}
        onClose={() => setDeleteModalCategoriaOpen(false)}
        title="Confirmar Exclusão"
        size="sm"
      >
        <Text mb="xl">
          Tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita.
        </Text>
        <Group position="right">
          <Button variant="outline" onClick={() => setDeleteModalCategoriaOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={confirmarExclusaoCategoria} loading={isLoading}>
            Excluir
          </Button>
        </Group>
      </Modal>
    </>
  );
}
