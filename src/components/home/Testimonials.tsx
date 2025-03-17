'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Dados fictícios de depoimentos
const testimonials = [
  {
    id: '1',
    name: 'Roberto Andrade',
    role: 'Diretor de Cinema',
    image: '/images/testimonials/testimonial1.jpg',
    quote: 'A Galharufa tem um casting excepcional. Encontrei exatamente os talentos que precisava para meu último filme, com profissionalismo e agilidade impressionantes.'
  },
  {
    id: '2',
    name: 'Carla Mendonça',
    role: 'Produtora de TV',
    image: '/images/testimonials/testimonial2.jpg',
    quote: 'Trabalhar com a Galharufa é sempre uma experiência incrível. A equipe entende perfeitamente nossas necessidades e apresenta opções que superam nossas expectativas.'
  },
  {
    id: '3',
    name: 'Paulo Ribeiro',
    role: 'Diretor de Publicidade',
    image: '/images/testimonials/testimonial3.jpg',
    quote: 'Em mais de 15 anos de mercado, nunca trabalhei com uma agência tão eficiente e profissional. Os talentos da Galharufa são diferenciados.'
  },
  {
    id: '4',
    name: 'Fernanda Lima',
    role: 'Diretora de Teatro',
    image: '/images/testimonials/testimonial4.jpg',
    quote: 'A diversidade de talentos e a qualidade dos profissionais da Galharufa fizeram toda a diferença na montagem da nossa peça. Recomendo sem hesitar.'
  },
  {
    id: '5',
    name: 'Marcelo Santos',
    role: 'Produtor Musical',
    image: '/images/testimonials/testimonial5.jpg',
    quote: 'Encontrei na Galharufa vozes incríveis para meu projeto musical. O processo foi rápido e os resultados superaram todas as expectativas.'
  }
];

const Testimonials = () => {
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
          <h2 className="heading-secondary text-black dark:text-white">O Que Dizem Sobre Nós</h2>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Veja o que nossos clientes e parceiros têm a dizer sobre a experiência de trabalhar com a Galharufa e nossos talentos.
          </p>
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
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 shadow-md h-full flex flex-col">
                  <div className="mb-6">
                    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-black dark:text-white font-medium">{testimonial.name}</h4>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
