'use client';

// Importações básicas
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import Loading from '@/components/shared/Loading';

// Carregamento dinâmico dos componentes (apenas do lado do cliente)
const Hero = dynamic(() => import('@/components/home/Hero'), {
  loading: () => <Loading message="Carregando seção de destaque..." />,
  ssr: false
});

const AboutSection = dynamic(() => import('@/components/home/AboutSection'), {
  loading: () => <Loading message="Carregando seção sobre nós..." />,
  ssr: false
});

const ServicesSection = dynamic(() => import('@/components/home/ServicesSection'), {
  loading: () => <Loading message="Carregando seção de serviços..." />,
  ssr: false
});

const CastingHighlights = dynamic(() => import('@/components/home/CastingHighlights'), {
  loading: () => <Loading message="Carregando seção de casting..." />,
  ssr: false
});

// const Testimonials = dynamic(() => import('@/components/home/Testimonials'), {
//   loading: () => <Loading message="Carregando depoimentos..." />,
//   ssr: false
// });

const Partners = dynamic(() => import('@/components/home/Partners'), {
  loading: () => <Loading message="Carregando parceiros..." />,
  ssr: false
});

const ContactSection = dynamic(() => import('@/components/home/ContactSection'), {
  loading: () => <Loading message="Carregando seção de contato..." />,
  ssr: false
});

// Função principal da página inicial
export default function Home() {
  return (
    <>
      <Suspense fallback={<Loading message="Carregando página inicial..." />}>
        <Hero />
        <AboutSection />
        <ServicesSection />
        <CastingHighlights />
        {/* <Testimonials /> */}
        <Partners />
        <ContactSection />
      </Suspense>
    </>
  );
}
