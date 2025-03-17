'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </NextThemeProvider>
  );
};

export default ThemeProvider;
