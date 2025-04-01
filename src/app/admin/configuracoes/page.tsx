'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Card, Button, Group, TextInput, Textarea, Stack, useMantineColorScheme, Loader, FileInput } from '@mantine/core';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';
import { ConfiguracoesService } from '@/services';
import { errorToast, successToast } from '@/utils';
import { useForm } from '@mantine/form';
import { IconUpload } from '@tabler/icons-react';

export default function ConfiguracoesAdmin() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const form = useForm({
    initialValues: {
      nome_site: '',
      logo: null as File | null,
      favicon: null as File | null,
      email_contato: '',
      telefone: '',
      endereco: '',
      horario_funcionamento: '',
      facebook: '',
      instagram: '',
      youtube: '',
      linkedin: '',
      twitter: '',
      descricao_meta: '',
      palavras_chave: '',
    },
  });

  // Carregar configurações
  useEffect(() => {
    const carregarConfiguracoes = async () => {
      if (!isAuthenticated && !authLoading) return;
      
      try {
        setIsLoading(true);
        const configuracoes = await ConfiguracoesService.getConfiguracoes();
        
        form.setValues({
          nome_site: configuracoes.nome_site,
          logo: null, // Não podemos carregar o arquivo, apenas a URL
          favicon: null, // Não podemos carregar o arquivo, apenas a URL
          email_contato: configuracoes.email_contato,
          telefone: configuracoes.telefone,
          endereco: configuracoes.endereco,
          horario_funcionamento: configuracoes.horario_funcionamento,
          facebook: configuracoes.facebook,
          instagram: configuracoes.instagram,
          youtube: configuracoes.youtube,
          linkedin: configuracoes.linkedin,
          twitter: configuracoes.twitter,
          descricao_meta: configuracoes.descricao_meta,
          palavras_chave: configuracoes.palavras_chave,
        });
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        errorToast('Erro ao carregar configurações do site');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      carregarConfiguracoes();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setSalvando(true);
      
      const formData = new FormData();
      
      // Adicionar todos os campos de texto
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'logo' && key !== 'favicon' && value !== null) {
          formData.append(key, value);
        }
      });
      
      // Adicionar arquivos se houver
      if (values.logo) {
        formData.append('logo', values.logo);
      }
      
      if (values.favicon) {
        formData.append('favicon', values.favicon);
      }
      
      await ConfiguracoesService.atualizarConfiguracoes(formData);
      
      successToast('Configurações atualizadas com sucesso');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      errorToast('Erro ao salvar configurações');
    } finally {
      setSalvando(false);
    }
  };

  if (authLoading || isLoading) {
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
        <Title order={2} mb="xl">Configurações do Site</Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Informações Gerais</Title>
            
            <Stack spacing="md">
              <TextInput
                label="Nome do Site"
                placeholder="Galharufa"
                {...form.getInputProps('nome_site')}
              />
              
              <FileInput
                label="Logo"
                description="Selecione uma imagem para o logo do site"
                accept="image/*"
                icon={<IconUpload size={14} />}
                {...form.getInputProps('logo')}
              />
              
              <FileInput
                label="Favicon"
                description="Selecione uma imagem para o favicon do site"
                accept="image/*"
                icon={<IconUpload size={14} />}
                {...form.getInputProps('favicon')}
              />
              
              <TextInput
                label="E-mail de Contato"
                placeholder="contato@galharufa.com.br"
                {...form.getInputProps('email_contato')}
              />
              
              <TextInput
                label="Telefone"
                placeholder="(11) 99999-9999"
                {...form.getInputProps('telefone')}
              />
              
              <TextInput
                label="Endereço"
                placeholder="Av. Paulista, 1000 - São Paulo/SP"
                {...form.getInputProps('endereco')}
              />
              
              <TextInput
                label="Horário de Funcionamento"
                placeholder="Segunda a Sexta, das 9h às 18h"
                {...form.getInputProps('horario_funcionamento')}
              />
              
              <Textarea
                label="Descrição do Site (Meta)"
                placeholder="Agência de talentos especializada em conectar artistas excepcionais com oportunidades transformadoras."
                {...form.getInputProps('descricao_meta')}
                minRows={3}
              />
              
              <Textarea
                label="Palavras-chave (Meta)"
                placeholder="agência, talentos, artistas, casting, publicidade"
                {...form.getInputProps('palavras_chave')}
                minRows={2}
              />
            </Stack>
          </Card>

          <Card withBorder p="xl" radius="md" mb="xl">
            <Title order={3} mb="lg">Redes Sociais</Title>
            
            <Stack spacing="md">
              <TextInput
                label="Instagram"
                placeholder="@galharufa"
                {...form.getInputProps('instagram')}
              />
              
              <TextInput
                label="Facebook"
                placeholder="facebook.com/galharufa"
                {...form.getInputProps('facebook')}
              />
              
              <TextInput
                label="LinkedIn"
                placeholder="linkedin.com/company/galharufa"
                {...form.getInputProps('linkedin')}
              />
              
              <TextInput
                label="YouTube"
                placeholder="youtube.com/galharufa"
                {...form.getInputProps('youtube')}
              />
              
              <TextInput
                label="Twitter"
                placeholder="twitter.com/galharufa"
                {...form.getInputProps('twitter')}
              />
            </Stack>
          </Card>

          <Group position="right" mt="xl">
            <Button 
              type="submit"
              loading={salvando}
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
              Salvar Alterações
            </Button>
          </Group>
        </form>
      </Container>
    </>
  );
}
