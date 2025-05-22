'use client';

import { AppShell, MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@mantine/hooks';
import { AuthProvider } from '@/hooks/useAuth';
import { AuthService } from '@/services/auth.service';
// Removendo import de Notifications para evitar duplicação de toasts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { warningToast } from '@/utils';

// Criando o cliente de consulta para React Query
const queryClient = new QueryClient();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(preferredColorScheme);

  const toggleColorScheme = (value?: 'light' | 'dark') => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
  };

  useEffect(() => {
    AuthService.scheduleTokenWarning(() => {
      warningToast('Deseja continuar logado?');
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <AppShell padding={0}>
              <ToastContainer toastStyle={{ zIndex: 9999 }} />
              {children}
            </AppShell>
          </AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
