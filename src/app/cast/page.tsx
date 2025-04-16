'use client';

import { useState } from 'react';
import CastingHero from '@/components/casting/CastingHero';
import CastingFilters from '@/components/casting/CastingFilters';
import CastingGrid from '@/components/casting/CastingGrid';
import CtaBanner from '@/components/shared/CtaBanner';
import Script from 'next/script';

export default function CastingPage() {
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
      <CastingHero />
      <CastingFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <CastingGrid filter={activeFilter} />
      {/* <CtaBanner
        title="Quer fazer parte do nosso casting?"
        description="Estamos sempre em busca de novos talentos. Se você tem interesse em fazer parte da nossa agência, entre em contato conosco."
        buttonText="Cadastre-se"
        buttonLink="/contato"
        bgColor="white"
      /> */}
    </div>
  );
}
