'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

// Dados fictícios de parceiros e clientes
const partners = [
  {
    id: '1',
    name: 'Globo',
    logo: '/images/partners/partner1.png',
  },
  {
    id: '2',
    name: 'Netflix',
    logo: '/images/partners/partner2.png',
  },
  {
    id: '3',
    name: 'HBO',
    logo: '/images/partners/partner3.png',
  },
  {
    id: '4',
    name: 'Amazon Prime',
    logo: '/images/partners/partner4.png',
  },
  {
    id: '5',
    name: 'Disney+',
    logo: '/images/partners/partner5.png',
  },
  {
    id: '6',
    name: 'Canal Brasil',
    logo: '/images/partners/partner6.png',
  },
  {
    id: '7',
    name: 'TV Cultura',
    logo: '/images/partners/partner7.png',
  },
  {
    id: '8',
    name: 'SBT',
    logo: '/images/partners/partner8.png',
  }
];

const Partners = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-16 bg-gray-100 dark:bg-gray-900">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="heading-secondary text-black dark:text-white">Nossos Parceiros</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Trabalhamos com as principais empresas e produtoras do mercado audiovisual, garantindo as melhores oportunidades para nossos talentos.
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
            {partners.map((partner) => (
              <SwiperSlide key={partner.id}>
                <div className="flex items-center justify-center p-4 h-32">
                  <div className="relative h-16 w-full opacity-70 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      fill
                      className="object-contain"
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

export default Partners;
