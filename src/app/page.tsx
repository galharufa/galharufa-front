'use client';

// Importações básicas
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Carregamento dinâmico dos componentes (apenas do lado do cliente)
const Hero = dynamic(() => import('@/components/home/Hero'), {
  loading: () => <Loading message="Carregando seção de destaque..." />,
  ssr: false,
});

const AboutSection = dynamic(() => import('@/components/home/AboutSection'), {
  loading: () => <Loading message="Carregando seção sobre nós..." />,
  ssr: false,
});

const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), {
  loading: () => <Loading message="Carregando seção de serviços..." />,
  ssr: false,
});

const CastingHighlights = dynamic(() => import('@/components/home/CastingHighlights'), {
  loading: () => <Loading message="Carregando seção de casting..." />,
  ssr: false,
});

const Clients = dynamic(() => import('@/components/home/Clients'), {
  loading: () => <Loading message="Carregando parceiros..." />,
  ssr: false,
});

const ContactSection = dynamic(() => import('@/components/home/ContactSection'), {
  loading: () => <Loading message="Carregando seção de contato..." />,
  ssr: false,
});

// Função principal da página inicial
export default function Home() {
  return (
    <>
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
      <Suspense fallback={<Loading message="Carregando página inicial..." />}>
        <Hero />
        <AboutSection />
        <ServicesSection />
        {/* <CastingHighlights /> */}
        <Clients />
        <ContactSection />
        <Analytics />
        <SpeedInsights />
      </Suspense>
    </>
  );
}
