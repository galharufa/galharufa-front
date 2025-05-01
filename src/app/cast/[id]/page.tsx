/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft, FaInstagram, FaImdb } from 'react-icons/fa';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';
import AnimatedImage from '@/components/shared/AnimatedImage';
import { CastingDetalhado, CastingService } from '@/services';
import parse from 'html-react-parser';
import {
  tipoMap,
  etniaMap,
  tipoCabeloMap,
  genderMap,
  languagesMap,
  corCabeloMap,
  nacionalidadeMap,
  corOlhosMap,
} from '@/utils';

export default function CastingPage() {
  const params = useParams();
  const router = useRouter();
  const [casting, setCasting] = useState<CastingDetalhado | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre');
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchCasts = async () => {
      try {
        setLoading(true);

        // O parâmetro agora pode ser um nome artístico (slug) ou um UUID
        // Decodificamos a URL para lidar com espaços (%20) e outros caracteres especiais
        const castingId = decodeURIComponent(String(params.id));
        console.log('ID/slug decodificado:', castingId);

        let response;

        // Verificamos se parece um UUID (contém hífens e tem o tamanho adequado)
        const isUuid = castingId.includes('-') && castingId.length > 30;

        if (isUuid) {
          // Se for UUID, usamos o método existente
          response = await CastingService.getCasting(castingId);
        } else {
          // Se for nome artístico (slug), usamos um novo método
          response = await CastingService.getCastingBySlug(castingId);
        }

        setCasting(response);
        setApiError(false);
      } catch (error) {
        console.error('Erro ao carregar o casting: ', error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    if (String(params.id)) {
      fetchCasts();
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

  if (!casting || apiError) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
          Casting não encontrado
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          O casting que você está procurando não existe ou foi removido.
        </p>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft /> Voltar para o Casting
        </button>
      </div>
    );
  }

  const tipoCasting = casting.tipo
    ? tipoMap[casting.tipo] || casting.tipo
    : 'Não informado';
  const nacionalidadeCasting = casting.nacionalidade
    ? nacionalidadeMap[casting.nacionalidade] || casting.nacionalidade
    : 'Não informado';

  const generoCasting = casting.genero
    ? genderMap[casting?.genero] || casting.genero
    : 'Não informado';
  const etniaCasting = casting.etnia
    ? etniaMap[casting?.etnia] || casting.etnia
    : 'Não informado';
  const tipoCabeloCasting = casting.tipo_cabelo
    ? tipoCabeloMap[casting.tipo_cabelo] || casting.tipo_cabelo
    : 'Não informado';
  const corCabeloCasting = casting.cor_cabelo
    ? corCabeloMap[casting.cor_cabelo] || casting.cor_cabelo
    : 'Não informado';

  const corOlhosCasting = casting.olhos
    ? corOlhosMap[casting.olhos] || casting.olhos
    : 'Não informado';

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70 z-10"></div>
        <div className="absolute inset-0">
          <Image
            src={casting.foto_principal}
            alt={casting.nome}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
          <div className="container mx-auto">
            <AnimatedText
              text={casting.nome}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-2"
              delay={0.2}
            />
            <AnimatedSection
              className="flex flex-wrap gap-3 mb-4"
              delay={0.4}
              direction="up"
            >
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                {casting.categoria_nome}
              </span>
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
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Informações
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Tipo</h3>
                  <p className="text-black dark:text-white">{tipoCasting}</p>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">DRT</h3>
                  <p className="text-black dark:text-white">{casting.DRT}</p>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Nacionalidade
                  </h3>
                  <p className="text-black dark:text-white">{nacionalidadeCasting}</p>

                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Gênero</h3>
                  <p className="text-black dark:text-white">{generoCasting}</p>

                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Etnia</h3>
                  <p className="text-black dark:text-white">{etniaCasting}</p>

                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Ano de Nascimento
                  </h3>
                  <p className="text-black dark:text-white">
                    {casting.data_nascimento
                      ? new Date(casting.data_nascimento).getFullYear()
                      : 'Não informado'}
                  </p>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Manequim</h3>
                    <p className="text-black dark:text-white">{casting.manequim}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Sapato</h3>
                    <p className="text-black dark:text-white">
                      {casting.sapato || 'Não informado'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Altura</h3>
                    <p className="text-black dark:text-white">{casting.altura} m</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Peso</h3>
                    <p className="text-black dark:text-white">
                      {Math.round(Number(casting.peso || 'Não informado'))} kg
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Olhos</h3>
                    <p className="text-black dark:text-white">{corOlhosCasting}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">
                      Tipo de Cabelo
                    </h3>
                    <p className="text-black dark:text-white">{tipoCabeloCasting}</p>
                  </div>

                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Cabelos</h3>
                    <p className="text-black dark:text-white">{corCabeloCasting}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400">Idiomas</h3>
                    {casting.idiomas &&
                      Object.entries(casting.idiomas)
                        .filter(([_, valor]) => valor)
                        .map(([idioma], index) => (
                          <p key={index} className="text-black dark:text-white">
                            {idioma.charAt(0).toUpperCase() + idioma.slice(1)}
                          </p>
                        ))}
                  </div>

                  {casting.link_instagram && (
                    <div>
                      <h3 className="text-sm text-gray-500 dark:text-gray-400">
                        Instagram
                      </h3>
                      <p className="text-black dark:text-white flex items-center gap-2">
                        <a
                          href={
                            casting.link_instagram.startsWith('http')
                              ? casting.link_instagram
                              : `https://${casting.link_instagram}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          <FaInstagram />
                        </a>
                      </p>
                    </div>
                  )}
                  {casting.link_imdb && (
                    <div>
                      <h3 className="text-sm text-gray-500 dark:text-gray-400">IMDB</h3>
                      <p className="text-black dark:text-white flex items-center gap-2">
                        <a
                          href={
                            casting.link_imdb.startsWith('http')
                              ? casting.link_imdb
                              : `https://${casting.link_imdb}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline"
                        >
                          <FaImdb />
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* <div className="mt-8">
                <button
                  onClick={() =>
                    (window.location.href = '/contato?casting=' + casting.id)
                  }
                  className="btn-primary w-full"
                >
                  Contratar este casting
                </button>
              </div> */}
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

                {casting.experiencia && casting.experiencia.length > 0 && (
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

                {casting.fotos && casting.fotos.length > 0 && (
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
              {activeTab === 'sobre' && casting.biografia && (
                <AnimatedSection direction="up" delay={0.2}>
                  <h2 className="heading-tertiary text-black dark:text-white">
                    Biografia
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    {casting.biografia}
                  </p>
                </AnimatedSection>
              )}

              {/* Experiência */}
              {activeTab === 'experiencia' &&
                casting.experiencia &&
                casting.experiencia.length > 0 && (
                  <AnimatedSection direction="up" delay={0.2}>
                    <h2 className="heading-tertiary text-black dark:text-white">
                      Experiência Profissional
                    </h2>
                    <ul className="space-y-4 mt-4">
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {parse(casting.experiencia)}
                      </p>
                    </ul>
                  </AnimatedSection>
                )}

              {/* Galeria */}
              {activeTab === 'galeria' && casting.fotos && casting.fotos.length > 0 && (
                <AnimatedSection direction="up" delay={0.2}>
                  <h2 className="heading-tertiary text-black dark:text-white">
                    Galeria de Fotos
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {casting.fotos.map((foto, index) => (
                      <AnimatedImage
                        key={foto.id}
                        src={foto.imagem}
                        alt={
                          foto.legenda || `${casting.nome_artistico} - Foto ${index + 1}`
                        }
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
    </div>
  );
}
