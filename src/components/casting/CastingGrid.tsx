/* eslint-disable no-console */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'framer-motion';

// Função para gerar uma URL amigável a partir do nome artístico
const slugify = (text: string | undefined | null): string => {
  if (!text) return '';

  // Converter para texto em minúsculas e remover acentos
  return encodeURIComponent(text);
};

import { CastingService, CastingResumido } from '@/services/casting.service';

interface CastingGridProps {
  filter: string;
  generoFilter: string;
}

const CastingGrid = ({ filter, generoFilter }: CastingGridProps) => {
  const [castings, setCastings] = useState<CastingResumido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(8);
  const [apiError, setApiError] = useState(false);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    const fetchCastings = async () => {
      try {
        setIsLoading(true);
        setApiError(false);
        const params: {
          ordering: string;
          ativo: boolean;
          categoria?: number;
          genero?: string;
        } = {
          ordering: 'nome',
          ativo: true,
        };

        // Se o filtro não for "todos", filtrar por categoria
        if (filter !== 'todos') {
          const categoriaId = parseInt(filter);
          if (!isNaN(categoriaId)) {
            params.categoria = categoriaId;
          }
        }

        // Se o filtro de gênero não for "todos", adicionar filtro
        if (generoFilter !== 'todos') {
          params.genero = generoFilter;
        }

        const response = await CastingService.getCastings(params);
        setCastings(response.results);
      } catch (error) {
        console.error('Erro ao carregar castings:', error);
        setCastings([]);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCastings();
  }, [filter, generoFilter]);

  // Incrementar o número de castings exibidos quando o elemento de referência estiver visível
  useEffect(() => {
    if (isInView && displayCount < castings.length) {
      setDisplayCount((prev) => Math.min(prev + 4, castings.length));
    }
  }, [isInView, castings.length, displayCount]);

  // Animação para card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div className="container-section py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-800 rounded-xl w-full aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Componente de mensagem quando a API está indisponível
  const ErrorMessage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
    >
      <div className="p-8 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Ainda não temos Castings selecionados
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No momento, nosso catálogo de castings está indisponível. Por favor, tente
          novamente mais tarde ou entre em contato conosco para mais informações.
        </p>
      </div>
    </motion.div>
  );

  // Filtrar os castings visíveis
  const visibleCastings = castings.slice(0, displayCount);

  return (
    <div className="container-section py-16">
      <AnimatePresence>
        {apiError ? (
          <ErrorMessage />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {castings.length > 0
              ? visibleCastings.map((casting, index) => (
                  <motion.div
                    key={casting.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layoutId={`casting-${casting.id}`}
                    className="group cursor-pointer opacity-70 hover:opacity-100 hover:cursor-pointer grayscale hover:grayscale-0"
                  >
                    <Link
                      href={`/casting/${slugify(casting.nome_artistico) || casting.id}`}
                      passHref
                    >
                      <div className="relative overflow-hidden rounded-xl w-full aspect-[3/4]">
                        <Image
                          src={
                            casting.fotos?.[0]?.imagem || '/images/placeholder-talent.jpg'
                          }
                          alt={casting.nome}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white text-xl font-semibold">
                            {casting.nome}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {casting.categoria_nome}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))
              : !isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
                  >
                    <p className="text-gray-600 dark:text-gray-400">
                      Nenhum casting encontrado para os filtros selecionados.
                    </p>
                  </motion.div>
                )}
          </div>
        )}
      </AnimatePresence>

      {!apiError && castings.length > displayCount && (
        <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
          />
        </div>
      )}
    </div>
  );
};

export default CastingGrid;
