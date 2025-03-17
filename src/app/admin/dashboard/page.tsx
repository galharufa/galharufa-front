'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Card, SimpleGrid, useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { IconUsers, IconNews, IconReceipt } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    {
      title: 'Casting',
      icon: <IconUsers size={32} stroke={1.5} />,
      value: '120+',
      description: 'Talentos cadastrados',
      color: theme.colors.blue[6],
    },
    {
      title: 'Serviços',
      icon: <IconReceipt size={32} stroke={1.5} />,
      value: '15+',
      description: 'Serviços disponíveis',
      color: theme.colors.green[6],
    },
    {
      title: 'Blog',
      icon: <IconNews size={32} stroke={1.5} />,
      value: '25+',
      description: 'Artigos publicados',
      color: theme.colors.orange[6],
    },
  ];

  return (
    <>
      <AdminNavbar />
      <Container size="lg" py="xl">
        <Title order={2} mb="xl">
          Bem-vindo, {user?.name || 'Administrador'}!
        </Title>

        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]} spacing="lg" mb="xl">
          {stats.map((stat) => (
            <Card key={stat.title} p="lg" radius="md" withBorder>
              <Group position="apart">
                <div>
                  <Text size="xs" color="dimmed" transform="uppercase" weight={700}>
                    {stat.title}
                  </Text>
                  <Text size="xl" weight={700}>
                    {stat.value}
                  </Text>
                  <Text size="sm" color="dimmed" mt="xs">
                    {stat.description}
                  </Text>
                </div>
                <div style={{ color: stat.color }}>{stat.icon}</div>
              </Group>
              <Button
                styles={{
                  root: {
                    backgroundColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                    color: '#FFFFFF !important',
                    '&:hover': {
                      backgroundColor: isDark ? '#a855f7 !important' : '#6b21a8 !important',
                    }
                  }
                }}
                fullWidth
                mt="md"
                onClick={() => router.push(`/admin/${stat.title.toLowerCase()}`)}
              >
                Gerenciar
              </Button>
            </Card>
          ))}
        </SimpleGrid>

        <Card withBorder p="xl" radius="md">
          <Title order={3} mb="md">
            Painel Administrativo Galharufa
          </Title>
          <Text mb="xl">
            Este é o painel administrativo da Galharufa, onde você pode gerenciar o casting, serviços, blog e outras configurações do site.
          </Text>
          <Text size="sm" color="dimmed">
            Utilize o menu lateral para navegar entre as diferentes seções do painel administrativo.
          </Text>
        </Card>
      </Container>
    </>
  );
}
