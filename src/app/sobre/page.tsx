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
        title="Seletiva para Agenciamento Artístico"
        description="Estamos muito felizes com seu interesse em integrar nosso casting. Para que possamos lhe conhecer melhor, por gentileza, encaminhar para análise seu material no link abaixo."
        buttonText="Envio de Material"
        buttonLink="/contato"
        bgColor="white"
      />
    </>
  );
}
