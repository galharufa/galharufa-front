import React from 'react';
import BlogHero from '@/components/blog/BlogHero';

import Script from 'next/script';
import BlogCards from '@/components/blog/BlogCards';

// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const metadata: MetadataBase = {
  title: 'Blog',
  description:
    'Conheça a história, valores e equipe por trás da Galharufa, uma agência de talentos comprometida com a excelência e o desenvolvimento de artistas.',
};

export default function BlogPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Script para otimizar carregamento de CSS */}
      <Script id="optimize-css" strategy="afterInteractive">
        {`
           document.addEventListener('DOMContentLoaded', function() {
             const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
             preloadLinks.forEach(link => {
               if (link instanceof HTMLLinkElement) {
                 link.setAttribute('rel', 'stylesheet');
                 link.removeAttribute('as');
               }
             });
           });
         `}
      </Script>
      <BlogHero />
      <BlogCards />
    </div>
  );
}
