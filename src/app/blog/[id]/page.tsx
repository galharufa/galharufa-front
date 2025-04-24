/* eslint-disable no-console */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaArrowLeft } from 'react-icons/fa';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';
import { BlogService } from '@/services/blog.service';
import { formatarData } from '@/utils';

type Tag = {
  id: number;
  nome: string;
  slug: string;
};

// Tipo para os posts do Blog
type Posts = {
  id: number;
  titulo: string;
  slug?: string;
  resumo: string;
  imagem_destaque: string;
  data_publicacao: string;
  categoria?: number;
  categoria_nome?: string;
  conteudo: string;
  autor_nome?: string;
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
            {/* Titulo */}
            <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
              <h1>{post.titulo}</h1>
            </div>
            {/* Resumo e Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="order-1">
                {/* Espaço em branco para criar coluna vazia e alinhar data a direita */}
                <small></small>
              </div>
              <div className="order-2 text-right text-sm text-gray-500">
                {formatarData(post.data_publicacao)}
              </div>
            </div>
            {/* Conteúdo do Blog */}
            <div>
              <p>{post.conteudo}</p>
            </div>
            <div className="align-right"></div>
          </AnimatedSection>

          {/* Coluna da direita - Informações básicas */}
          <AnimatedSection className="lg:col-span-1" direction="left" delay={0.2}>
            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
                Detalhes
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Tags:</h3>
                  {post.tags.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-white/20 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {cat.nome}
                    </span>
                  ))}
                </div>

                <div>
                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Resumo:</h3>
                  <p className="flex flex-wrap gap-2 mt-1">{post.resumo}</p>

                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Autor:</h3>
                  <p className="flex flex-wrap gap-2 mt-1">{post.autor_nome}</p>

                  <h3 className="text-sm text-gray-500 dark:text-gray-400">Categoria:</h3>
                  <p className="flex flex-wrap gap-2 mt-1">{post.categoria_nome}</p>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleGoBack}
                  className="align-right flex items-center gap-2 bg-black/50 hover:bg-black text-white px-4 py-2 rounded-md transition-colors"
                >
                  <FaArrowLeft /> Voltar
                </button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
