import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import OurValues from '@/components/about/OurValues';
import OurTeam from '@/components/about/OurTeam';
import CtaBanner from '@/components/shared/CtaBanner';
import Script from 'next/script';

// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const metadata: MetadataBase = {
  title: 'Sobre Nós',
  description:
    'Conheça a história, valores e equipe por trás da Galharufa, uma agência de talentos comprometida com a excelência e o desenvolvimento de artistas.',
};

export default function AboutPage() {
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
      <AboutHero />
      <OurStory />
      <OurValues />
      <OurTeam />
      <CtaBanner
        title="Seletiva para Agenciamento Artístico"
        description="Estamos muito felizes com seu interesse em integrar nosso casting. Para que possamos lhe conhecer melhor, por gentileza, encaminhar para análise seu material no link abaixo."
        buttonText="Envio de Material"
        buttonLink="/contato"
        bgColor="white"
      />
    </div>
  );
}
