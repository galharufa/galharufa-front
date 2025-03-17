import React from 'react';
import ServicesHero from '@/components/services/ServicesHero';
import ServicesList from '@/components/services/ServicesList';
import ServicesFaq from '@/components/services/ServicesFaq';
import CtaBanner from '@/components/shared/CtaBanner';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const metadata: MetadataBase = {
  title: 'Serviços',
  description: 'Conheça os serviços oferecidos pela Galharufa, desde agenciamento de talentos até produção de conteúdo e consultoria para projetos audiovisuais.',
};

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ServicesFaq />
      
      <div className="container-section py-8 text-center">
        <Link 
          href="/servicos/faq" 
          className="hover-link inline-flex items-center text-black dark:text-white font-medium"
        >
          Ver todas as perguntas frequentes
          <FiArrowRight className="ml-2" />
        </Link>
      </div>
      
      <CtaBanner 
        title="Precisa de Talentos para seu Projeto?"
        description="Temos um casting diversificado e profissional para atender às necessidades específicas do seu projeto audiovisual."
        buttonText="Fale Conosco"
        buttonLink="/contato"
        bgColor="gray"
      />
    </>
  );
}
