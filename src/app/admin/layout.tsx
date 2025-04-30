'use client';

import { AppShell, MantineProvider, ColorSchemeProvider } from '@mantine/core';
import { useState } from 'react';
import { useColorScheme } from '@mantine/hooks';
import { AuthProvider } from '@/hooks/useAuth';
// Removendo import de Notifications para evitar duplicação de toasts
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Criando o cliente de consulta para React Query
const queryClient = new QueryClient();

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(preferredColorScheme);

  const toggleColorScheme = (value?: 'light' | 'dark') => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(newColorScheme);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
          <AuthProvider>
            <AppShell padding={0}>
              {/* Removido componente Notifications para evitar duplicação de toasts */}
              {children}
            </AppShell>
          </AuthProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  );
}
