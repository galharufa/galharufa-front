'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'framer-motion';


import { CastingService, TalentoResumido } from '@/services/casting.service';

interface CastingGridProps {
  filter: string;
}

const CastingGrid = ({ filter }: CastingGridProps) => {
  const [talentos, setTalentos] = useState<TalentoResumido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(8);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef);

  useEffect(() => {
    const fetchTalentos = async () => {
      try {
        setIsLoading(true);
        const params: { ordering: string; ativo: boolean; categoria?: number } = {
          ordering: 'nome',
          ativo: true
        };

        // Se o filtro não for "todos", filtrar por categoria
        if (filter !== 'todos') {
          const categoriaId = parseInt(filter);
          if (!isNaN(categoriaId)) {
            params.categoria = categoriaId;
          }
        }

        const response = await CastingService.getTalentos(params);
        setTalentos(response.results);
      } catch (error) {
        console.error('Erro ao carregar talentos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentos();
  }, [filter]);

  // Incrementar o número de talentos exibidos quando o elemento de referência estiver visível
  useEffect(() => {
    if (isInView && displayCount < talentos.length) {
      setDisplayCount(prev => Math.min(prev + 4, talentos.length));
    }
  }, [isInView, talentos.length, displayCount]);

  // Animação para card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
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


  return (
    <div className="container-section py-16">
      <AnimatePresence>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {talentos.slice(0, displayCount).map((talento, index) => (
            <motion.div
              key={talento.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layoutId={`talent-${talento.id}`}
              className="group cursor-pointer"
            >
              <Link href={`/casting/${talento.id}`} passHref>
                <div className="relative overflow-hidden rounded-xl w-full aspect-[3/4]">
                  <Image
                    src={talento.foto_principal || '/images/placeholder-talent.jpg'}
                    alt={talento.nome}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-xl font-semibold">{talento.nome}</h3>
                    <p className="text-gray-300 text-sm">{talento.categoria_nome}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {displayCount < talentos.length && (
        <div ref={loadMoreRef} className="flex justify-center mt-12">
          <button
            onClick={() => setDisplayCount(prev => Math.min(prev + 4, talentos.length))}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full 
                        font-medium transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Carregar Mais
          </button>
        </div>
      )}
    </div>
  );
};

export default CastingGrid;
