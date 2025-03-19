'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import gsap from 'gsap';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && textRef.current) {
      const tl = gsap.timeline();
      
      tl.from(textRef.current.querySelectorAll('.gsap-hero-text'), {
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
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Overlay de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
      
      {/* Background Video ou Imagem */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[url('/images/hero-bg.jpg')] bg-cover bg-center"></div>
      </div>
      
      {/* Conteúdo */}
      <div 
        ref={textRef}
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center"
      >
        <motion.h1 
          className="gsap-hero-text text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="block">Descubra Talentos</span>
          <span className="block mt-2">Extraordinários</span>
        </motion.h1>
              
        <motion.div 
          className="gsap-hero-text flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/casting">
            <button className="px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-all duration-300">
              Nosso Casting
            </button>
          </Link>
          <Link href="/contato">
            <button className="px-8 py-3 border border-white text-white font-medium rounded-md hover:bg-white/10 transition-all duration-300">
              Entre em Contato
            </button>
          </Link>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <div className="w-8 h-12 border-2 border-white rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ 
              y: [0, 12, 0],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
