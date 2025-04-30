'use client';

import { useState } from 'react';
import CastingHero from '@/components/casting/CastingHero';
import CastingFilters from '@/components/casting/CastingFilters';
import CastingGrid from '@/components/casting/CastingGrid';
import Script from 'next/script';

export default function CastingPage() {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [activeGeneroFilter, setActiveGeneroFilter] = useState('todos');

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
      <CastingHero />
      <CastingFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeGeneroFilter={activeGeneroFilter}
        setActiveGeneroFilter={setActiveGeneroFilter}
      />
      <CastingGrid filter={activeFilter} generoFilter={activeGeneroFilter} />
    </div>
  );
}
