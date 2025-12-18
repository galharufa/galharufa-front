/* eslint-disable no-console */
'use client';

import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Pagination from '@/components/shared/Pagination';
import { CastingResumido, CastingService } from '@/services/casting.service';

interface CastingGridProps {
  filter: string;
  generoFilter: string;
}

const CastingGrid = ({ filter, generoFilter }: CastingGridProps) => {
  const [allCastings, setAllCastings] = useState<CastingResumido[]>([]); // Todos os castings
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [apiError, setApiError] = useState(false);

  const itemsPerPage = 8; // Número de itens por página

  // Reset para primeira página quando filtros mudarem
  useEffect(() => {
    console.log('Filters changed, resetting to page 1');
    setCurrentPage(1);
  }, [filter, generoFilter]);

  useEffect(() => {
    const fetchAllCastings = async () => {
      try {
        console.log('Fetching ALL castings with filters:', { filter, generoFilter });
        setIsLoading(true);
        setApiError(false);
        const params: {
          ordering: string;
          ativo: boolean;
          categoria?: string;
          genero?: string;
          pageSize?: number;
        } = {
          ordering: 'nome',
          ativo: true,
          pageSize: 1000, // Definir um número alto para pegar todos os registros
        };

        // Se o filtro não for "todos", filtrar por categoria
        if (filter !== 'todos') {
          params.categoria = filter;
        }

        // Se o filtro de gênero não for "todos", adicionar filtro
        if (generoFilter !== 'todos') {
          params.genero = generoFilter;
        } // Buscar TODOS os registros
        const { pageSize, ...baseParams } = params;
        const apiParams = {
          ...baseParams,
          ['page_size']: pageSize, // Usar notação de colchetes para evitar warning
        };

        const response = await CastingService.getCastings(apiParams);
        console.log('API Response (all castings):', {
          resultsCount: response.results.length,
          totalCount: response.count,
          hasNext: !!response.next,
          hasPrevious: !!response.previous,
        });

        let allResults = [...response.results];

        // Se ainda há mais páginas, buscar todas
        if (response.next && response.count > response.results.length) {
          console.log(
            '⚠️ API retornou apenas',
            response.results.length,
            'de',
            response.count,
            'registros. Buscando o restante...',
          );

          // Fazer múltiplas chamadas para pegar todos os registros
          let page = 2;
          let hasMore = true;

          while (hasMore && allResults.length < response.count) {
            try {
              // Criar params para página específica, omitindo pageSize original
              const baseParamsForPage = {
                ordering: params.ordering,
                ativo: params.ativo,
                ...(params.categoria && { categoria: params.categoria }),
                ...(params.genero && { genero: params.genero }),
              };
              const pageApiParams = {
                ...baseParamsForPage,
                page: page,
                ['page_size']: 100, // Usar notação de colchetes para evitar warning
              };

              const pageResponse = await CastingService.getCastings(pageApiParams);

              console.log(`📄 Página ${page}:`, pageResponse.results.length, 'registros');
              allResults = [...allResults, ...pageResponse.results];

              hasMore = !!pageResponse.next;
              page++;

              // Evitar loop infinito
              if (page > 20) {
                console.warn('⚠️ Máximo de 20 páginas atingido');
                break;
              }
            } catch (error) {
              console.error('Erro ao buscar página', page, ':', error);
              break;
            }
          }
        }

        console.log('✅ Total de registros carregados:', allResults.length);
        setAllCastings(allResults);
        setTotalCount(allResults.length);
        setTotalPages(Math.ceil(allResults.length / itemsPerPage));
      } catch (error) {
        console.error('Erro ao carregar castings:', error);
        setAllCastings([]);
        setApiError(true);
        setTotalCount(0);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCastings();
  }, [filter, generoFilter]); // Removido currentPage da dependência

  const handlePageChange = (page: number) => {
    console.log('Changing page from', currentPage, 'to', page);
    setCurrentPage(page);

    // Scroll suave para um pouco acima do grid
    // Busca o elemento do grid e rola para 20px acima dele
    const gridElement = document.querySelector('.grid');
    if (gridElement) {
      const gridRect = gridElement.getBoundingClientRect();
      const currentScrollY = window.scrollY;
      const targetScrollY = currentScrollY + gridRect.top - 20;

      window.scrollTo({
        top: Math.max(0, targetScrollY),
        behavior: 'smooth',
      });
    } else {
      // Fallback: apenas scroll um pouco para cima da posição atual
      window.scrollBy({ top: -20, behavior: 'smooth' });
    }
  };

  // Animação para card
  const cardVariants: Variants = {
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
  // Debug: vamos ver exatamente quantos registros temos
  console.log('🎯 Current state:', {
    currentPage,
    totalCount,
    totalPages,
    allCastingsLength: allCastings.length,
    itemsPerPage,
  });

  // Fazer paginação no frontend
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCastings = allCastings.slice(startIndex, endIndex);

  console.log('🔢 Pagination calc:', {
    startIndex,
    endIndex,
    visibleCastingsLength: visibleCastings.length,
  });

  return (
    <div className="container-section py-16">
      <AnimatePresence>
        {apiError ? (
          <ErrorMessage />
        ) : (
          <>
            {' '}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {allCastings.length > 0
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
                      <Link href={`/casting/${casting.slug || casting.id}`} passHref>
                        <div className="relative overflow-hidden rounded-xl w-full aspect-[3/4]">
                          <Image
                            src={
                              casting.fotos?.[0]?.imagem ||
                              '/images/placeholder-talent.jpg'
                            }
                            alt={casting.nome_artistico}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-5 left-0 right-0 px-4 pb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xl font-semibold truncate">
                              {casting.nome_artistico}
                            </h3>
                            <p className="text-gray-300 text-sm truncate">
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
            {/* Componente de Paginação */}
            {!apiError && totalCount > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CastingGrid;
