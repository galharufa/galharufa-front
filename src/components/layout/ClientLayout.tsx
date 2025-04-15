'use client';

import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MantineProvider } from '@mantine/core';
import { usePathname } from 'next/navigation';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Verificar se a rota atual é uma rota de admin (exceto login)
  const isAdminRoute =
    pathname?.startsWith('/admin') && !pathname?.includes('/admin/login');

  // Verificar se é a página de login do admin
  const isAdminLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <MantineProvider withGlobalStyles withNormalizeCSS>
          {!isAdminRoute && !isAdminLoginPage && <Navbar />}
          <main className="min-h-screen">{children}</main>
          {!isAdminRoute && !isAdminLoginPage && <Footer />}
          <ToastContainer position="bottom-right" />
        </MantineProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
