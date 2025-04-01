'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ContactHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(heroRef, { once: true });

  return (
    <div 
      ref={heroRef}
      className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/contact-hero.jpg')] bg-cover bg-center bg-no-repeat"></div>
      </div>
      
      {/* Conteúdo */}
      <div 
        className="container-section relative z-20 text-center"
      >
        <motion.h1 
          className="heading-primary text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Fale Conosco
        </motion.h1>
      </div>
    </div>
  );
};

export default ContactHero;
