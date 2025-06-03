'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { CastingService, type CastingResumido } from '@/services';

// Função para otimização de CSS implementada diretamente no componente
const useOptimizedCSSLoad = (): void => {
  useEffect(() => {
    // Busca todos os links de preload e os transforma em links normais
    const links = document.querySelectorAll('link[rel=preload][as=style]');
    links.forEach((link) => {
      const linkElement = link as HTMLLinkElement;
      linkElement.setAttribute('rel', 'stylesheet');
      linkElement.removeAttribute('as');
    });
  }, []);
};

// Variantes de animação para os cards
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
  exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const CastingHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [highlightedCastings, setHighlightedCastings] = useState<CastingResumido[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Otimização de CSS
  useOptimizedCSSLoad();

  useEffect(() => {
    const fetchHighlightedCastings = async () => {
      try {
        setIsLoading(true);
        // Busca castings marcados como destaque=true
        const response = await CastingService.getCastings({
          ativo: true,
          // Filtrando apenas os castings em destaque
          destaque: true,
        });

        setHighlightedCastings(response.results);
      } catch {
        // Tratamento silencioso do erro para não quebrar a UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchHighlightedCastings();
  }, []);

  // Se não houver castings em destaque, não exibe a seção
  if (!isLoading && highlightedCastings.length === 0) {
    return null;
  }

  // Componente de mensagem quando não há castings em destaque
  const EmptyMessage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
    >
      <div className="p-8 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Ainda não temos Castings em Destaque
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No momento, não há castings destacados. Visite nossa página de castings para ver
          todos os talentos.
        </p>
      </div>
    </motion.div>
  );

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-secondary text-black dark:text-white">
            Castings em Destaque
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
          ) : highlightedCastings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {highlightedCastings.map((casting, index) => (
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
                          casting.fotos?.[0]?.imagem || '/images/placeholder-talent.jpg'
                        }
                        alt={casting.nome_artistico || casting.nome}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-5 left-0 right-0 px-4 pb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white text-xl font-semibold truncate">
                          {casting.nome_artistico || casting.nome}
                        </h3>
                        <p className="text-gray-300 text-sm truncate">
                          {casting.categoria_nome}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyMessage />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link href="/casting" className="btn-primary">
            Ver Todos os Castings
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CastingHighlights;
