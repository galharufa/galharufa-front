'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Dados simulados de talentos
const talents = [
  {
    id: 1,
    name: 'Sofia Mendes',
    category: 'Atriz',
    image: '/images/talent-1.jpg',
  },
  {
    id: 2,
    name: 'Rafael Costa',
    category: 'Modelo',
    image: '/images/talent-2.jpg',
  },
  {
    id: 3,
    name: 'Juliana Santos',
    category: 'Influencer',
    image: '/images/talent-3.jpg',
  },
  {
    id: 4,
    name: 'Lucas Oliveira',
    category: 'Ator',
    image: '/images/talent-4.jpg',
  },
  {
    id: 5,
    name: 'Camila Rodrigues',
    category: 'Modelo',
    image: '/images/talent-5.jpg',
  },
  {
    id: 6,
    name: 'Bruno Almeida',
    category: 'Influencer',
    image: '/images/talent-6.jpg',
  },
];

const CastingPreview = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">Nossos Talentos</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Conheça alguns dos talentos excepcionais representados pela Galharufa, prontos para brilhar em seu próximo projeto.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
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
            className="casting-swiper"
          >
            {talents.map((talent) => (
              <SwiperSlide key={talent.id}>
                <div className="group relative overflow-hidden rounded-lg h-[450px] mb-10">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>
                  <Image
                    src={talent.image}
                    alt={talent.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                    <h3 className="text-xl font-semibold text-white">{talent.name}</h3>
                    <p className="text-gray-300 mb-4">{talent.category}</p>
                    <Link href={`/casting/${talent.id}`}>
                      <span className="nav-link text-white">Ver Perfil</span>
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
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-8"
        >
          <Link href="/cast">
            <button className="btn-outline dark:border-white dark:text-white">
              Ver Todos os Talentos
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default CastingPreview;
