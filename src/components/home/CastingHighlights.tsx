'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Dados fictícios de castings em destaque
const highlightedTalents = [
  {
    id: '1',
    name: 'Ana Silva',
    category: 'Atriz',
    image: '/images/talents/talent1.jpg',
    description: 'Atriz versátil com experiência em teatro, cinema e televisão.',
  },
  {
    id: '2',
    name: 'Carlos Mendes',
    category: 'Ator',
    image: '/images/talents/talent2.jpg',
    description:
      'Ator premiado com vasta experiência em produções nacionais e internacionais.',
  },
  {
    id: '3',
    name: 'Juliana Costa',
    category: 'Modelo',
    image: '/images/talents/talent3.jpg',
    description:
      'Modelo fotográfica e de passarela com experiência em campanhas publicitárias.',
  },
  {
    id: '4',
    name: 'Pedro Almeida',
    category: 'Ator/Músico',
    image: '/images/talents/talent4.jpg',
    description: 'Ator e músico multitalentoso com habilidades em diversos instrumentos.',
  },
  {
    id: '5',
    name: 'Mariana Santos',
    category: 'Atriz/Dançarina',
    image: '/images/talents/talent5.jpg',
    description:
      'Atriz e dançarina com formação em ballet clássico e dança contemporânea.',
  },
  {
    id: '6',
    name: 'Lucas Oliveira',
    category: 'Ator',
    image: '/images/talents/talent6.jpg',
    description: 'Ator com especialidade em personagens dramáticos e cômicos.',
  },
];

const CastingHighlights = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
          {/* <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Conheça alguns dos castings excepcionais representados pela Galharufa, cada um com habilidades únicas e experiências diversificadas.
          </p> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {highlightedTalents.map((talent) => (
              <SwiperSlide key={talent.id}>
                <div className="bg-white dark:bg-black rounded-lg overflow-hidden shadow-lg h-full transition-transform duration-300 hover:-translate-y-2">
                  <div className="relative h-80 w-full">
                    <Image
                      src={talent.image}
                      alt={talent.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {talent.category}
                    </span>
                    <h3 className="text-xl font-semibold text-black dark:text-white mt-1 mb-2">
                      {talent.name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      {talent.description}
                    </p>
                    <Link
                      href={`/cast/${talent.id}`}
                      className="hover-link text-black dark:text-white font-medium"
                    >
                      Ver perfil completo
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link href="/cast" className="btn-primary">
            Ver Todos os Castings
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CastingHighlights;
