import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import OurStory from '@/components/about/OurStory';
import OurValues from '@/components/about/OurValues';
import OurTeam from '@/components/about/OurTeam';
import CtaBanner from '@/components/shared/CtaBanner';

// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const metadata: MetadataBase = {
  title: 'Sobre Nós',
  description: 'Conheça a história, valores e equipe por trás da Galharufa, uma agência de talentos comprometida com a excelência e o desenvolvimento de artistas.',
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStory />
      <OurValues />
      <OurTeam />
      <CtaBanner 
        title="Faça Parte do Nosso Casting"
        description="Está procurando uma agência que valorize seu talento e abra portas para oportunidades incríveis? Entre em contato conosco hoje mesmo."
        buttonText="Entre em Contato"
        buttonLink="/contato"
        bgColor="black"
      />
    </>
  );
}
