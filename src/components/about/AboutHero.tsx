'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={heroRef}
      className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/camera-2400-1600.jpg')] bg-cover bg-center"></div>
      </div>
      
      {/* Conteúdo */}
      <div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center"
      >
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Nossa História
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Conheça a trajetória da Galharufa e nossa paixão em conectar talentos extraordinários com oportunidades transformadoras.
        </motion.p>
      </div>
    </div>
  );
};

export default AboutHero;
