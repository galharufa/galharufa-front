'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const CastingHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={heroRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black text-white"
      style={{ paddingTop: '0', paddingBottom: '0' }}
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/capa_casting.jpg')] bg-cover bg-center"></div>
      </div>

      {/* Conteúdo */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold lg:mt-20 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Nosso Casting
        </motion.h1>
      </div>
    </div>
  );
};

export default CastingHero;
