/* eslint-disable camelcase */
/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Card,
  SimpleGrid,
  useMantineColorScheme,
  Loader,
} from '@mantine/core';
import { IconUsers, IconNews, IconReceipt } from '@tabler/icons-react';
import { useAuth } from '@/hooks/useAuth';
import AdminNavbar from '../components/AdminNavbar';
import { CastingService, type Categoria } from '@/services/casting.service';
import { ServicosService } from '@/services/servicos.service';
import { BlogService } from '@/services/blog.service';
import { errorToast } from '@/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// Interfaces para os dados dos gráficos
interface DataCategoria {
  nome: string;
  quantidade: number;
}

interface DataMensal {
  mes: string;
  quantidade: number;
}

export default function Dashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const [isLoading, setIsLoading] = useState(true);
  const [totalCastings, setTotalCastings] = useState(0);
  const [totalServicos, setTotalServicos] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [dadosCategorias, setDadosCategorias] = useState<DataCategoria[]>([]);
  const [dadosMensais, setDadosMensais] = useState<DataMensal[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const carregarDados = async () => {
      if (!isAuthenticated || authLoading) return;

      setIsLoading(true);
      try {
        // Carregar dados em paralelo para melhor performance
        const [castings, servicos, posts, categorias] = await Promise.all([
          CastingService.getCastings({ page_size: 1 }),
          ServicosService.getServicos({ page_size: 1 }),
          BlogService.getPosts({ page_size: 100 }),
          CastingService.getCategorias(),
        ]);

        setTotalCastings(castings.count);
        setTotalServicos(servicos.count);
        setTotalPosts(posts.count);

        // Obter castings por categoria
        const categoriasMap = new Map<number, Categoria>();
        categorias.results.forEach((cat) => categoriasMap.set(cat.id, cat));

        const castingsPorCategoria: Map<number, number> = new Map();

        // Inicializar todas as categorias com zero
        categorias.results.forEach((cat) => castingsPorCategoria.set(cat.id, 0));

        // Fazer chamada adicional para obter todos os castings
        const todosCastings = await CastingService.getCastings({ page_size: 100 });

        // Contar castings por categoria
        todosCastings.results.forEach((casting) => {
          // Verificar se categoria existe e obter o primeiro item como ID (se for array)
          let categoriaId: number | undefined;

          if (
            casting.categoria &&
            Array.isArray(casting.categoria) &&
            casting.categoria.length > 0
          ) {
            // Se for array, pega o primeiro item e converte para número
            categoriaId = Number(casting.categoria[0]);
          } else if (typeof casting.categoria === 'string') {
            // Se for string simples, converte para número
            categoriaId = Number(casting.categoria);
          }

          // Só adiciona se conseguiu obter um ID válido
          if (categoriaId && !isNaN(categoriaId) && categoriasMap.has(categoriaId)) {
            castingsPorCategoria.set(
              categoriaId,
              (castingsPorCategoria.get(categoriaId) || 0) + 1,
            );
          }
        });

        // Formatar dados para o gráfico
        const dadosGraficoCat = Array.from(castingsPorCategoria.entries())
          .map(([categoriaId, quantidade]) => ({
            nome: categoriasMap.get(categoriaId)?.nome || 'Sem categoria',
            quantidade,
          }))
          .sort((a, b) => b.quantidade - a.quantidade) // Ordenar do maior para o menor
          .slice(0, 5); // Pegar apenas os 5 maiores

        setDadosCategorias(dadosGraficoCat);

        // Processar posts por mês
        const postsData = posts.results;
        const dataAtual = new Date();
        const ultimosMeses: DataMensal[] = [];

        // Criar um array para os últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const data = new Date(dataAtual.getFullYear(), dataAtual.getMonth() - i, 1);
          const mesAno = `${data.toLocaleString('pt-BR', { month: 'short' })}/${data.getFullYear().toString().slice(2)}`;

          ultimosMeses.push({
            mes: mesAno,
            quantidade: 0,
          });
        }

        // Contar posts por mês
        postsData.forEach((post) => {
          const dataPost = new Date(post.data_publicacao);
          const mesAnoPost = `${dataPost.toLocaleString('pt-BR', { month: 'short' })}/${dataPost.getFullYear().toString().slice(2)}`;

          const index = ultimosMeses.findIndex((item) => item.mes === mesAnoPost);
          if (index >= 0) {
            ultimosMeses[index].quantidade += 1;
          }
        });

        setDadosMensais(ultimosMeses);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
        errorToast('Erro ao carregar dados do dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      carregarDados();
    }
  }, [isAuthenticated, authLoading]);

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

  const corPrimaria = isDark ? '#9333ea' : '#7e22ce';
  const corSecundaria = isDark ? '#a855f7' : '#6b21a8';

  const stats = [
    {
      title: 'Casting',
      icon: <IconUsers size={32} stroke={1.5} color={isDark ? '#FFFFFF' : '#000000'} />,
      value: isLoading ? <Loader size="sm" /> : `${totalCastings}`,
      description: 'Castings cadastrados',
    },
    {
      title: 'Serviços',
      icon: <IconReceipt size={32} stroke={1.5} color={isDark ? '#FFFFFF' : '#000000'} />,
      value: isLoading ? <Loader size="sm" /> : `${totalServicos}`,
      description: 'Serviços disponíveis',
    },
    {
      title: 'Blog',
      icon: <IconNews size={32} stroke={1.5} color={isDark ? '#FFFFFF' : '#000000'} />,
      value: isLoading ? <Loader size="sm" /> : `${totalPosts}`,
      description: 'Artigos publicados',
    },
  ];

  return (
    <>
      <AdminNavbar />
      <Container size="lg" py="xl">
        <Title order={2} mb="xl">
          Bem-vindo, {user?.name || 'Administrador'}!
        </Title>

        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: 'sm', cols: 1 }]}
          spacing="lg"
          mb="xl"
        >
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
                <div>{stat.icon}</div>
              </Group>
              <Button
                styles={{
                  root: {
                    backgroundColor: isDark ? '#9333ea !important' : '#7e22ce !important',
                    color: '#FFFFFF !important',
                    '&:hover': {
                      backgroundColor: isDark
                        ? '#a855f7 !important'
                        : '#6b21a8 !important',
                    },
                  },
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

        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: 'md', cols: 1 }]}
          spacing="lg"
          mb="xl"
        >
          {/* Gráfico de Talentos por Categoria */}
          <Card withBorder p="lg" radius="md">
            <Title order={3} mb="lg">
              Castings por Categoria
            </Title>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader size="lg" />
              </div>
            ) : dadosCategorias.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dadosCategorias}
                  margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="nome"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    stroke={isDark ? '#adb5bd' : '#495057'}
                  />
                  <YAxis stroke={isDark ? '#adb5bd' : '#495057'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#2C2E33' : '#fff',
                      color: isDark ? '#fff' : '#000',
                      border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                    }}
                  />
                  <Bar dataKey="quantidade" name="Quantidade" fill={corPrimaria} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Text align="center">Nenhum dado disponível</Text>
            )}
          </Card>

          {/* Gráfico de Publicações por Mês */}
          <Card withBorder p="lg" radius="md">
            <Title order={3} mb="lg">
              Publicações nos Últimos 6 Meses
            </Title>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Loader size="lg" />
              </div>
            ) : dadosMensais.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dadosMensais}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" stroke={isDark ? '#adb5bd' : '#495057'} />
                  <YAxis stroke={isDark ? '#adb5bd' : '#495057'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#2C2E33' : '#fff',
                      color: isDark ? '#fff' : '#000',
                      border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="quantidade"
                    name="Publicações"
                    stroke={corPrimaria}
                    strokeWidth={2}
                    activeDot={{ r: 8, fill: corSecundaria }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Text align="center">Nenhum dado disponível</Text>
            )}
          </Card>
        </SimpleGrid>

        <Card withBorder p="xl" radius="md">
          <Title order={3} mb="md">
            Painel Administrativo Galharufa
          </Title>
          <Text mb="xl">
            Este é o painel administrativo da Galharufa, onde você pode gerenciar o
            casting, serviços, blog e outras configurações do site.
          </Text>
          <Text size="sm" color="dimmed">
            Utilize o menu lateral para navegar entre as diferentes seções do painel
            administrativo.
          </Text>
        </Card>
      </Container>
    </>
  );
}
