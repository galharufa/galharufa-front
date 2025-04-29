/* eslint-disable camelcase */
'use client';

import {
  TextInput,
  PasswordInput,
  Title,
  Button,
  Grid,
  Stack,
  Space,
  Center,
  MediaQuery,
  Checkbox,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { errorToast } from '@/utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);

  // Necessário para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  const { values, errors, getInputProps, validate } = useForm({
    initialValues: {
      username: '',
      password: '',
      remember_me: false,
    },

    validate: {
      username: (value) => (value.length < 1 ? 'Usuário é obrigatório.' : null),
      password: (value) => (value.length < 1 ? 'Senha é obrigatória.' : null),
    },
  });

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { hasErrors } = validate();

    if (hasErrors) {
      errorToast('Existem campos inválidos.');
      return;
    }

    setIsLoading(true);
    try {
      await login({
        username: values.username,
        password: values.password,
        remember_me: values.remember_me,
      });
    } catch {
      errorToast('Usuário ou senha inválidos.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      <ToastContainer />
      {/* Botão de troca de tema no canto superior direito */}
      <Box
        sx={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 1000,
        }}
      >
        <ThemeToggle />
      </Box>

      <Grid w="100%" h="100vh" m={0} sx={{ overflow: 'hidden' }}>
        <MediaQuery smallerThan="lg" styles={{ display: 'none' }}>
          <Grid.Col span={6} h="100%" p={0} sx={{ position: 'relative' }}>
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: 'url(/images/home-hero.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </Grid.Col>
        </MediaQuery>

        <Grid.Col md={12} lg={6} h="100%" p={0}>
          <Center
            h="100%"
            sx={{
              backgroundColor: isDark ? '#1A1B1E' : '#FFFFFF',
              color: isDark ? '#FFFFFF' : '#000000',
            }}
          >
            <Stack w="100%" mx="auto" maw={500} px="lg">
              <Box
                mx="auto"
                sx={{
                  '@media (max-width: 768px)': {
                    '& img': {
                      maxHeight: '50px',
                    },
                  },
                }}
              >
                <Image
                  src={
                    isDark
                      ? '/images/logos/logo_horizontal_black.jpg'
                      : '/images/logos/logo_horizontal_white.jpg'
                  }
                  alt="Galharufa Logo"
                  width={300}
                  height={80}
                  priority
                  style={{
                    width: 'auto',
                    height: 'auto',
                    maxHeight: '80px',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Space h="xl" />

              <Title
                order={2}
                align="center"
                sx={(theme) => ({
                  fontFamily: `Greycliff CF, ${theme.fontFamily}`,
                  fontWeight: 700,
                  color: isDark ? '#FFFFFF' : '#000000',
                })}
              >
                Login
              </Title>

              <form onSubmit={onSubmit}>
                <Stack>
                  <TextInput
                    withAsterisk
                    label="Usuário"
                    placeholder="Seu usuário"
                    {...getInputProps('username')}
                    error={errors.username}
                    styles={{
                      input: {
                        backgroundColor: isDark ? '#25262B' : '#F8F9FA',
                        color: isDark ? '#FFFFFF' : '#000000',
                        borderColor: isDark ? '#373A40' : '#CED4DA',
                      },
                      label: {
                        color: isDark ? '#C1C2C5' : '#212529',
                      },
                    }}
                  />

                  <PasswordInput
                    withAsterisk
                    label="Senha"
                    placeholder="Sua senha"
                    {...getInputProps('password')}
                    error={errors.password}
                    styles={{
                      input: {
                        backgroundColor: isDark ? '#25262B' : '#F8F9FA',
                        color: isDark ? '#FFFFFF' : '#000000',
                        borderColor: isDark ? '#373A40' : '#CED4DA',
                      },
                      label: {
                        color: isDark ? '#C1C2C5' : '#212529',
                      },
                    }}
                  />

                  <Checkbox
                    {...getInputProps('remember_me', { type: 'checkbox' })}
                    label="Lembrar-me"
                    styles={{
                      label: {
                        color: isDark ? '#C1C2C5' : '#212529',
                      },
                    }}
                  />
                </Stack>

                <Space h="xl" />

                <Button
                  mt="lg"
                  fullWidth
                  type="submit"
                  loading={isLoading}
                  styles={{
                    root: {
                      backgroundColor: isDark
                        ? '#000000 !important'
                        : '#666666 !important',
                      color: '#FFFFFF !important',
                      '&:hover': {
                        backgroundColor: isDark
                          ? '#333333 !important'
                          : '#000000 !important',
                      },
                    },
                  }}
                >
                  Login
                </Button>
              </form>
            </Stack>
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
}
