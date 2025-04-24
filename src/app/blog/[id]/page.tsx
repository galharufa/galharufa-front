/* eslint-disable no-console */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';
import { BlogService } from '@/services/blog.service';

type Tag = {
  id: number;
  nome: string;
  slug: string;
};

// Tipo para os posts do Blog
type Posts = {
  id: number;
  titulo: string;
  resumo: string;
  data_publicacao: string;
  imagem_destaque: string;
  categoria_nome: string;
  conteudo: string;
  tags: Tag[];
};

// Outros castings seriam adicionados aqui

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Posts | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await BlogService.getPost(Number(params.id));
        setPost(response);
        setApiError(false);
      } catch (error) {
        console.error('Erro ao carregar post: ', error);
        setApiError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
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

  if (!post || apiError) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
          Post não encontrado
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-8">
          O post que você está procurando não existe ou foi removido.
        </p>
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <FaArrowLeft /> Voltar para o blog
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
            src={post.imagem_destaque}
            alt={post.titulo}
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
              text={post.titulo}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              delay={0.2}
            />
            <AnimatedSection
              className="flex flex-wrap gap-3 mb-4"
              delay={0.4}
              direction="up"
            >
              {post.tags.map((cat, index) => (
                <span
                  key={index}
                  className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                >
                  {cat.nome}
                </span>
              ))}
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Coluna da esquerda - Conteúdo principal */}
          <AnimatedSection className="lg:col-span-2" direction="right" delay={0.4}>
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
              <h1>{post.titulo}</h1>
              {/* <Text fs="italic">{post.resumo}</Text> */}
              {/* {blog.experience && blog.experience.length > 0 && (
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

                {blog.gallery && blog.gallery.length > 0 && (
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
                )} */}
            </div>
          </AnimatedSection>

          {/* Coluna da direita - Informações básicas */}
          <AnimatedSection className="lg:col-span-1" direction="left" delay={0.2}>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Informações
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Idade</h3>
                  {/* <p className="text-black dark:text-white">{blog.age} anos</p> */}
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Altura</h3>
                  {/* <p className="text-black dark:text-white">{blog.height}</p> */}
                </div>

                {/* {blog.measurements && (
                  <>
                    {blog.measurements.bust && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Busto
                        </h3>
                        <p className="text-black dark:text-white">
                          {blog.measurements.bust}
                        </p>
                      </div>
                    )}

                    {blog.measurements.waist && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Cintura
                        </h3>
                        <p className="text-black dark:text-white">
                          {blog.measurements.waist}
                        </p>
                      </div>
                    )}

                    {blog.measurements.hips && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Quadril
                        </h3>
                        <div className="prose dark:prose-invert max-w-none">
                          {blog.bio && <p>{blog.bio}</p>}
                        </div>
                      </div>
                    )}

                    {blog.measurements.shoes && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Calçado
                        </h3>
                        <p className="text-black dark:text-white">
                          {blog.measurements.shoes}
                        </p>
                      </div>
                    )}

                    {blog.measurements.eyes && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Olhos
                        </h3>
                        <p className="text-black dark:text-white">
                          {blog.measurements.eyes}
                        </p>
                      </div>
                    )}

                    {blog.measurements.hair && (
                      <div>
                        <h3 className="text-sm text-gray-500 dark:text-gray-400">
                          Cabelo
                        </h3>
                        <p className="text-black dark:text-white">
                          {blog.measurements.hair}
                        </p>
                      </div>
                    )}
                  </>
                )} */}

                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {/* {blog.specialties.map((specialty: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white px-2 py-1 rounded text-xs"
                      >
                        {specialty}
                      </span>
                    ))} */}
                  </div>
                </div>

                {/* {blog.social && (
                  <div>
                    <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Redes Sociais
                    </h3>
                    <div className="flex space-x-3">
                      {blog.social.instagram && (
                        <a
                          href={blog.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-link text-black dark:text-white"
                          aria-label="Instagram"
                        >
                          <FaInstagram className="w-5 h-5" />
                        </a>
                      )}

                      {blog.social.youtube && (
                        <a
                          href={blog.social.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover-link text-black dark:text-white"
                          aria-label="YouTube"
                        >
                          <FaYoutube className="w-5 h-5" />
                        </a>
                      )}

                      {blog.social.imdb && (
                        <a
                          href={blog.social.imdb}
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
                )} */}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => (window.location.href = '/contato?casting=' + blog.name)}
                  className="btn-primary w-full"
                >
                  Contratar este casting
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
