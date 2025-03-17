'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';

// Dados simulados de depoimentos
const testimonials = [
  {
    id: 1,
    name: 'Carla Ferreira',
    role: 'Diretora de Marketing',
    company: 'Empresa XYZ',
    image: '/images/testimonial-1.jpg',
    quote: 'A Galharufa superou todas as nossas expectativas. Os talentos selecionados para nossa campanha foram perfeitos e o processo foi extremamente profissional do início ao fim.',
  },
  {
    id: 2,
    name: 'André Martins',
    role: 'Ator',
    company: 'Talento Agenciado',
    image: '/images/testimonial-2.jpg',
    quote: 'Fazer parte da Galharufa transformou minha carreira. A equipe está sempre atenta às melhores oportunidades e o suporte que recebo é incomparável.',
  },
  {
    id: 3,
    name: 'Mariana Costa',
    role: 'Produtora Executiva',
    company: 'Produtora de Cinema',
    image: '/images/testimonial-3.jpg',
    quote: 'Trabalhar com a Galharufa é sempre uma experiência incrível. A agência entende perfeitamente nossas necessidades e sempre entrega os melhores talentos para nossos projetos.',
  },
  {
    id: 4,
    name: 'Rodrigo Alves',
    role: 'Modelo',
    company: 'Talento Agenciado',
    image: '/images/testimonial-4.jpg',
    quote: 'A Galharufa não é apenas uma agência, é uma família que realmente se importa com o desenvolvimento da minha carreira. Sou muito grato por fazer parte deste time.',
  },
];

const TestimonialsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-black text-white">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary">Depoimentos</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-white to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Veja o que nossos clientes e talentos dizem sobre a Galharufa.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="testimonials-swiper"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-900 p-8 md:p-10 rounded-lg text-center">
                  <div className="relative w-20 h-20 mx-auto mb-6 overflow-hidden rounded-full border-2 border-white">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                  <blockquote className="text-lg md:text-xl italic mb-6 text-gray-300">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  <div className="flex flex-col items-center">
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
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

export default TestimonialsSection;
