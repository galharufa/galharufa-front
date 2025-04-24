'use client';

import { useState } from 'react';
import BlogHero from '@/components/blog/BlogHero';
import BlogCards from '@/components/blog/BlogCards';
import Script from 'next/script';

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('todos');
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
      <BlogCards filter={activeFilter} />
    </div>
  );
}
