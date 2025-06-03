'use client';

import { useEffect } from 'react';

/**
 * Hook para otimizar o carregamento de CSS e evitar warnings
 * Resolvendo problemas de preload de CSS com Next.js
 */
export function useOptimizedCSSLoad(): void {
  useEffect(() => {
    // Busca todos os links de preload e os transforma em links normais
    // Isso resolve os warnings relacionados ao preload de CSS
    const links = document.querySelectorAll('link[rel=preload][as=style]');
    links.forEach((link) => {
      // Convertendo explicitamente para HTMLLinkElement para resolver o erro de tipagem
      const linkElement = link as HTMLLinkElement;
      // Substituir preload por stylesheet
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.removeAttribute('as');
    });
  }, []);
}
