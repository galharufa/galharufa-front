import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesList from '@/components/services/ServicesList';
import CtaBanner from '@/components/shared/CtaBanner';
import Script from 'next/script';

export default function ServicesPage() {
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
      <ServicesHero />
      <ServicesList />
      {/* <ServicesFaq /> */}

      <CtaBanner
        title="Precisa de Talentos para seu Projeto?"
        description="Temos um casting diversificado e profissional para atender às necessidades específicas do seu projeto audiovisual."
        buttonText="Fale Conosco"
        buttonLink="/contato"
        bgColor="gray"
      />
    </div>
  );
}
