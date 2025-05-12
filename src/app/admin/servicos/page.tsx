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
  Switch,
  FileInput,
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';
import { ServicosService, type Servico, type ServicoResumido } from '@/services';
import { errorToast, successToast } from '@/utils';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconUpload } from '@tabler/icons-react';
import Image from 'next/image';
import { useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import parse from 'html-react-parser';

export default function ServicoAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [servicos, setServicos] = useState<ServicoResumido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalAberto, { open: abrirModal, close: fecharModal }] = useDisclosure(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [servicoAtual, setServicoAtual] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [servicoToDelete, setServicoToDelete] = useState<number | null>(null);

  const form = useForm({
    initialValues: {
      nome: '',
      descricao: '',
      preco: '',
      ativo: true,
      imagem: null as File | null,
    },
    validate: {
      nome: (value) => (value.trim().length === 0 ? 'O nome é obrigatório' : null),
      descricao: (value) =>
        value.trim().length === 0 ? 'A descrição é obrigatória' : null,
      preco: (value) => (value.trim().length === 0 ? 'O preço é obrigatório' : null),
    },
  });

  const editor = useEditor({
    extensions: [StarterKit, Link, TextAlign, Highlight, Underline],
    content: form.getInputProps('experiencia').value,
    onUpdate: ({ editor }) => form.getInputProps('descricao').onChange(editor.getHTML()),
    immediatelyRender: false, // Corrige o problema de hidratação SSR
  });

  // Carregar serviços
  useEffect(() => {
    const carregarServicos = async () => {
      if (!isAuthenticated && !authLoading) return;

      try {
        setIsLoading(true);
        const response = await ServicosService.getServicos({ ordering: 'nome' });
        setServicos(response.results);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        errorToast('Erro ao carregar serviços');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      carregarServicos();
    }
  }, [isAuthenticated, authLoading]);

  //carregar campo rich text usando o editor
  useEffect(() => {
    if (
      isAuthenticated &&
      !authLoading &&
      editor &&
      modoEdicao &&
      servicoAtual !== null
    ) {
      const servicoSelecionado = servicos.find((s) => s.id === servicoAtual);
      if (servicoSelecionado && servicoSelecionado.descricao) {
        editor.commands.setContent(servicoSelecionado.descricao);
      }
    }
  }, [editor, modoEdicao, servicoAtual, servicos, isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleCriarServico = () => {
    form.reset();
    setModoEdicao(false);
    setServicoAtual(null);
    abrirModal();
  };

  const handleEditarServico = async (id: number) => {
    try {
      setIsLoading(true);
      const servico = await ServicosService.getServico(id);

      form.setValues({
        nome: servico.nome,
        descricao: servico.descricao,
        preco: servico.preco,
        ativo: servico.ativo,
        imagem: null, // Não podemos carregar o arquivo, apenas a URL
      });

      setModoEdicao(true);
      setServicoAtual(id);
      abrirModal();
    } catch (error) {
      console.error('Erro ao carregar serviço:', error);
      errorToast('Erro ao carregar dados do serviço');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirServico = (id: number) => {
    setServicoToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!servicoToDelete) return;

    try {
      setIsLoading(true);
      await ServicosService.excluirServico(servicoToDelete);

      // Atualizar a lista de serviços
      setServicos(servicos.filter((servico) => servico.id !== servicoToDelete));

      successToast('Serviço excluído com sucesso');
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      errorToast('Erro ao excluir serviço');
    } finally {
      setIsLoading(false);
      setDeleteModalOpen(false);
      setServicoToDelete(null);
    }
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append('nome', values.nome);
      formData.append('descricao', values.descricao);
      formData.append('preco', values.preco);
      formData.append('ativo', values.ativo.toString());

      // Adicionar imagem se houver
      if (values.imagem) {
        formData.append('imagem', values.imagem);
      }

      let response: Servico | ServicoResumido;

      if (modoEdicao && servicoAtual) {
        response = await ServicosService.atualizarServico(servicoAtual, formData);

        // Atualizar o serviço na lista
        setServicos(
          servicos.map((servico) =>
            servico.id === servicoAtual
              ? {
                  ...servico,
                  nome: response.nome,
                  descricao: response.descricao,
                  imagem: response.imagem,
                  ativo: response.ativo,
                }
              : servico,
          ),
        );

        successToast('Serviço atualizado com sucesso');
      } else {
        response = await ServicosService.criarServico(formData);

        // Adicionar o novo serviço à lista
        setServicos([response as ServicoResumido, ...servicos]);

        successToast('Serviço criado com sucesso');
      }

      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      errorToast('Erro ao salvar serviço');
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
          <Title order={2}>Gerenciamento de Serviços</Title>
          <Button
            onClick={handleCriarServico}
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
            Adicionar Novo Serviço
          </Button>
        </Group>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader size="xl" />
          </div>
        ) : (
          <>
            {servicos.length === 0 ? (
              <Card withBorder p="xl" radius="md">
                <Text align="center" size="lg">
                  Nenhum serviço cadastrado.
                </Text>
              </Card>
            ) : (
              <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'xs', cols: 1 }]} mb="xl">
                {servicos.map((servico) => (
                  <Card key={servico.id} p="lg" radius="md" withBorder>
                    <Group position="apart">
                      <Title order={3}>{servico.nome}</Title>
                      {!servico.ativo && (
                        <Text color="dimmed" size="sm" style={{ fontStyle: 'italic' }}>
                          Inativo
                        </Text>
                      )}
                    </Group>
                    <Text mt="md" color="dimmed">
                      {parse(servico.descricao)}
                    </Text>
                    {servico.imagem && (
                      <div
                        style={{
                          marginTop: '1rem',
                          textAlign: 'center',
                          position: 'relative',
                          height: '200px',
                        }}
                      >
                        <Image
                          src={servico.imagem}
                          alt={servico.nome}
                          fill
                          style={{
                            objectFit: 'contain',
                          }}
                        />
                      </div>
                    )}
                    <Group position="apart" mt="xl">
                      <Button
                        onClick={() => handleEditarServico(servico.id)}
                        styles={{
                          root: {
                            backgroundColor: isDark
                              ? '#404040 !important'
                              : '#737373 !important',
                            color: '#FFFFFF !important',
                            '&:hover': {
                              backgroundColor: isDark
                                ? '#525252 !important'
                                : '#a3a3a3 !important',
                            },
                          },
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleExcluirServico(servico.id)}
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
          </>
        )}
      </Container>

      {/* Modal de criação/edição de serviço */}
      <Modal
        opened={modalAberto}
        onClose={fecharModal}
        title={modoEdicao ? 'Editar Serviço' : 'Novo Serviço'}
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Nome"
            placeholder="Nome do serviço"
            required
            {...form.getInputProps('nome')}
            mb="md"
          />

          <Text size="sm" fw={500} mb="xs">
            Descrição
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

          {/* <Textarea
            label="Descrição"
            placeholder="Descrição detalhada do serviço"
            required
            minRows={4}
            {...form.getInputProps('descricao')}
            mb="md"
          /> */}

          <TextInput
            label="Preço"
            placeholder="Ex: 1000.00"
            required
            {...form.getInputProps('preco')}
            mb="md"
          />

          <FileInput
            label="Imagem"
            description="Selecione uma imagem"
            accept="image/png,image/jpeg,image/webp"
            icon={<IconUpload size={14} />}
            {...form.getInputProps('imagem')}
            mb="md"
          />

          <Switch
            label="Ativo"
            {...form.getInputProps('ativo', { type: 'checkbox' })}
            mb="xl"
          />

          <Group position="right">
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
              {modoEdicao ? 'Atualizar' : 'Salvar'}
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
        <Text mb="xl">
          Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
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
