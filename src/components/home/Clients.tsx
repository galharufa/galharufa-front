'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Dados fictícios de parceiros e clientes
const clients = [
  {
    id: '1',
    name: 'Boticario',
    logo: '/images/clients/001-boticario.png',
  },
  {
    id: '2',
    name: 'Disney',
    logo: '/images/clients/002-disney.png',
  },
  {
    id: '3',
    name: 'Globo',
    logo: '/images/clients/003-globo.png',
  },
  {
    id: '4',
    name: 'Globo Play',
    logo: '/images/clients/004-globoplay.png',
  },
  {
    id: '5',
    name: 'HBO Max+',
    logo: '/images/clients/005-hbo.png',
  },
  {
    id: '6',
    name: 'Paramount',
    logo: '/images/clients/006-para.png',
  },
  {
    id: '7',
    name: 'Prime Video',
    logo: '/images/clients/007-prime.png',
  },
  {
    id: '8',
    name: 'Record',
    logo: '/images/clients/008-record.png',
  },
  {
    id: '9',
    name: 'StarPlus',
    logo: '/images/clients/009-star.png',
  },
  {
    id: '11',
    name: 'Record',
    logo: '/images/clients/010-terra.png',
  },
  {
    id: '12',
    name: 'Vivo',
    logo: '/images/clients/012-vivo.png',
  },
  {
    id: '13',
    name: 'Vedacity',
    logo: '/images/clients/013-veda.png',
  },
];

const Clients = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16  bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-secondary text-black dark:text-white">
            Nossos Clientes
          </h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Trabalhamos com as principais empresas e produtoras do mercado audiovisual,
            garantindo as melhores oportunidades para nossos talentos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              768: {
                slidesPerView: 4,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
          >
            {clients.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex items-center justify-center p-4 h-32">
                  <div className="relative h-16 w-full opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-700 dark:text-gray-300">
            Interessado em trabalhar conosco? Entre em contato para discutir como podemos atender às suas necessidades de casting.
          </p>
          <a 
            href="/contato" 
            className="hover-link inline-block mt-4 text-black dark:text-white font-medium"
          >
            Fale com nossa equipe
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

export default Clients;
