'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Imagem */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative flex items-center justify-center h-[500px] w-full overflow-hidden rounded-lg"
          >
            <div className="absolute inset-0 z-10 rounded-lg"></div>
            <Image
              src={
                isDark
                  ? '/images/Iniciais_Transparente_LetrasBrancas.png'
                  : '/images/Iniciais_Transparente_LetrasPretas.png'
              }
              alt="Agência Galharufa"
              width={426}
              height={426}
              className="object-cover object-center"
              sizes="(max-width: 426px) 80vw, 426px"
            />
          </motion.div>

          {/* Texto */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <h2 className="heading-secondary text-black dark:text-white">
                Sobre a Galharufa
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mt-2 mb-6"></div>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-700 dark:text-gray-300 text-lg"
            >
              A Galharufa é um Bureau de Arte que emergiu do desejo em conectar artistas
              do palco à cena do audiovisual.
            </motion.p>

            <motion.div variants={itemVariants} className="pt-4">
              <Link href="/sobre">
                <button className="btn-primary dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  Conheça Nossa História
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
