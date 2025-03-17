'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaInstagram, FaYoutube, FaImdb } from 'react-icons/fa';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';
import AnimatedImage from '@/components/shared/AnimatedImage';
import CtaBanner from '@/components/shared/CtaBanner';

// Tipo para os talentos
type Talent = {
  id: number;
  name: string;
  category: string[];
  image: string;
  age: number;
  height: string;
  specialties: string[];
  featured: boolean;
  bio?: string;
  experience?: string[];
  gallery?: string[];
  social?: {
    instagram?: string;
    youtube?: string;
    imdb?: string;
  };
  measurements?: {
    bust?: string;
    waist?: string;
    hips?: string;
    shoes?: string;
    eyes?: string;
    hair?: string;
  };
};

// Dados simulados detalhados de talentos
const talentsData: Talent[] = [
  {
    id: 1,
    name: 'Ana Silva',
    category: ['atrizes', 'modelos'],
    image: '/images/talent-1.jpg',
    age: 28,
    height: '1.75m',
    specialties: ['Drama', 'Comerciais', 'Passarela'],
    featured: true,
    bio: 'Ana Silva é uma atriz e modelo versátil com experiência em produções nacionais e internacionais. Formada em artes cênicas pela Escola de Arte Dramática da USP, ela tem se destacado em papéis dramáticos e trabalhos publicitários.',
    experience: [
      'Novela "Amor Eterno" - Papel: Júlia (2022)',
      'Filme "Além do Horizonte" - Papel: Mariana (2021)',
      'Campanha Renault - Protagonista (2020)',
      'Desfile São Paulo Fashion Week - Marca: Osklen (2019)',
    ],
    gallery: [
      '/images/talent-1-gallery-1.jpg',
      '/images/talent-1-gallery-2.jpg',
      '/images/talent-1-gallery-3.jpg',
      '/images/talent-1-gallery-4.jpg',
    ],
    social: {
      instagram: 'https://instagram.com/anasilva',
      youtube: 'https://youtube.com/anasilva',
      imdb: 'https://imdb.com/name/anasilva',
    },
    measurements: {
      bust: '86cm',
      waist: '62cm',
      hips: '90cm',
      shoes: '37',
      eyes: 'Castanhos',
      hair: 'Castanho escuro',
    },
  },
  // Outros talentos seriam adicionados aqui
];

export default function TalentPage() {
  const params = useParams();
  const router = useRouter();
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');

  useEffect(() => {
    // Simulando busca de dados
    if (params.id) {
      const id = parseInt(params.id as string);
      const foundTalent = talentsData.find(t => t.id === id) || talentsData[0]; // Fallback para o primeiro talento se não encontrar
      setTalent(foundTalent);
      setLoading(false);
    }
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Talento não encontrado</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">O talento que você está procurando não existe ou foi removido.</p>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft /> Voltar para o Casting
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src={talent.image}
            alt={talent.name}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute top-8 left-8 z-20">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 bg-black/50 hover:bg-black text-white px-4 py-2 rounded-full transition-colors"
          >
            <FaArrowLeft /> Voltar
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="container mx-auto">
            <AnimatedText
              text={talent.name}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              delay={0.2}
            />
            <AnimatedSection
              className="flex flex-wrap gap-3 mb-4"
              delay={0.4}
              direction="up"
            >
              {talent.category.map((cat, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {cat === 'atores' ? 'Ator' : 
                   cat === 'atrizes' ? 'Atriz' : 
                   cat === 'modelos' ? 'Modelo' : 
                   cat === 'influenciadores' ? 'Influenciador' : 
                   cat === 'apresentadores' ? 'Apresentador' : 
                   cat === 'infantil' ? 'Infantil' : 
                   cat === 'plus-size' ? 'Plus Size' : 
                   cat === 'terceira-idade' ? 'Terceira Idade' : cat}
                </span>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna da esquerda - Informações básicas */}
          <AnimatedSection className="lg:col-span-1" direction="right" delay={0.2}>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Informações</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Idade</h3>
                  <p className="text-black dark:text-white">{talent.age} anos</p>
                </div>
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Altura</h3>
                  <p className="text-black dark:text-white">{talent.height}</p>
                </div>
                
                {talent.measurements && (
                  <>
                    {talent.measurements.bust && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Busto</h3>
                        <p className="text-black dark:text-white">{talent.measurements.bust}</p>
                      </div>
                    )}
                    
                    {talent.measurements.waist && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Cintura</h3>
                        <p className="text-black dark:text-white">{talent.measurements.waist}</p>
                      </div>
                    )}
                    
                    {talent.measurements.hips && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Quadril</h3>
                        <p className="text-black dark:text-white">{talent.measurements.hips}</p>
                      </div>
                    )}
                    
                    {talent.measurements.shoes && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Calçado</h3>
                        <p className="text-black dark:text-white">{talent.measurements.shoes}</p>
                      </div>
                    )}
                    
                    {talent.measurements.eyes && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Olhos</h3>
                        <p className="text-black dark:text-white">{talent.measurements.eyes}</p>
                      </div>
                    )}
                    
                    {talent.measurements.hair && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">Cabelo</h3>
                        <p className="text-black dark:text-white">{talent.measurements.hair}</p>
                      </div>
                    )}
                  </>
                )}
                
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Especialidades</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {talent.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-2 py-1 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                {talent.social && (
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">Redes Sociais</h3>
                    <div className="flex space-x-3">
                      {talent.social.instagram && (
                        <a
                          href={talent.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-link text-black dark:text-white"
                          aria-label="Instagram"
                        >
                          <FaInstagram className="w-5 h-5" />
                        </a>
                      )}
                      
                      {talent.social.youtube && (
                        <a
                          href={talent.social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-link text-black dark:text-white"
                          aria-label="YouTube"
                        >
                          <FaYoutube className="w-5 h-5" />
                        </a>
                      )}
                      
                      {talent.social.imdb && (
                        <a
                          href={talent.social.imdb}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-link text-black dark:text-white"
                          aria-label="IMDb"
                        >
                          <FaImdb className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => window.location.href = '/contato?talent=' + talent.name}
                  className="btn-primary w-full"
                >
                  Contratar este talento
                </button>
              </div>
            </div>
          </AnimatedSection>
          
          {/* Coluna da direita - Conteúdo principal */}
          <AnimatedSection className="lg:col-span-2" direction="left" delay={0.4}>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('sobre')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm hover-link ${
                    activeTab === 'sobre'
                      ? 'border-black dark:border-white text-black dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400'
                  }`}
                >
                  Sobre
                </button>
                
                {talent.experience && talent.experience.length > 0 && (
                  <button
                    onClick={() => setActiveTab('experiencia')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm hover-link ${
                      activeTab === 'experiencia'
                        ? 'border-black dark:border-white text-black dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Experiência
                  </button>
                )}
                
                {talent.gallery && talent.gallery.length > 0 && (
                  <button
                    onClick={() => setActiveTab('galeria')}
                    className={`py-4 px-1 border-b-2 font-medium text-sm hover-link ${
                      activeTab === 'galeria'
                        ? 'border-black dark:border-white text-black dark:text-white'
                        : 'border-transparent text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Galeria
                  </button>
                )}
              </nav>
            </div>
            
            {/* Conteúdo das tabs */}
            <div className="min-h-[400px]">
              {/* Sobre */}
              {activeTab === 'sobre' && talent.bio && (
                <AnimatedSection direction="up" delay={0.2}>
                  <h2 className="heading-tertiary text-black dark:text-white">Biografia</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {talent.bio}
                  </p>
                </AnimatedSection>
              )}
              
              {/* Experiência */}
              {activeTab === 'experiencia' && talent.experience && (
                <AnimatedSection direction="up" delay={0.2}>
                  <h2 className="heading-tertiary text-black dark:text-white">Experiência Profissional</h2>
                  <ul className="space-y-4 mt-4">
                    {talent.experience.map((exp, index) => (
                      <li 
                        key={index}
                        className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-1"
                      >
                        <p className="text-gray-700 dark:text-gray-300">{exp}</p>
                      </li>
                    ))}
                  </ul>
                </AnimatedSection>
              )}
              
              {/* Galeria */}
              {activeTab === 'galeria' && talent.gallery && (
                <AnimatedSection direction="up" delay={0.2}>
                  <h2 className="heading-tertiary text-black dark:text-white">Galeria de Fotos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {talent.gallery.map((image, index) => (
                      <AnimatedImage
                        key={index}
                        src={image}
                        alt={`${talent.name} - Imagem ${index + 1}`}
                        width={600}
                        height={800}
                        className="rounded-lg overflow-hidden w-full h-[300px] md:h-[400px]"
                        delay={index * 0.1}
                      />
                    ))}
                  </div>
                </AnimatedSection>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
      
      {/* CTA Banner */}
      <CtaBanner 
        title="Procurando talentos para seu projeto?"
        description="Entre em contato conosco para encontrar o talento ideal para sua produção."
        buttonText="Fale Conosco"
        buttonLink="/contato"
        bgColor="black"
      />
    </div>
  );
}
