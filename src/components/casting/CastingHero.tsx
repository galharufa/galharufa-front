'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const CastingHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && textRef.current) {
      const tl = gsap.timeline();
      
      tl.from(textRef.current.querySelectorAll('.gsap-casting-text'), {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
      });
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/casting-hero.jpg')] bg-cover bg-center"></div>
      </div>
      
      {/* Conteúdo */}
      <div 
        ref={textRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center"
      >
        <motion.h1 
          className="gsap-casting-text text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Nosso Casting
        </motion.h1>
        
        <motion.p 
          className="gsap-casting-text text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Conheça os talentos excepcionais da Galharufa, uma seleção diversa e qualificada para os mais variados projetos.
        </motion.p>
      </div>
    </div>
  );
};

export default CastingHero;
