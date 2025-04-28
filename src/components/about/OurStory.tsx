'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { useTheme } from 'next-themes';

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
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
    <section ref={ref} className="py-10 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto"
        >
          <div className="space-y-8">
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 order-2 md:order-1">
                <h3 className="text-2xl font-medium mb-4 text-black dark:text-white">
                  A Galharufa
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A Galharufa é um Bureau de Arte que emergiu do desejo em conectar
                  artistas do palco à cena do audiovisual.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Somos multi, pois a arte é a ponte para a transmutação humana e reunimos
                  em nossa comunidade as diversas potências criativas que fazem pulsar o
                  audiovisual dentro e fora das telas.
                </p>
              </div>
              <div className="md:col-span-7 order-2 relative flex items-center justify-center h-[500px] overflow-hidden rounded-lg">
                <Image
                  src={
                    isDark
                      ? '/images/LogoGalharufa_Antigo.png'
                      : '/images/LogoGalharufa_Antigo.png'
                  }
                  alt="Agência Galharufa"
                  width={426}
                  height={426}
                  className="object-cover object-center"
                  sizes="(max-width: 426px) 80vw, 426px"
                />
              </div>
            </motion.div>

            {/* Item 2 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  A Expansão
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Surgimos do chão do Teatro Paulistano, no início dos anos 2000, com o
                  desejo de evidenciar a brasilidade de rostos potentes, com talentos
                  únicos, pois acreditamos que cada artista carrega consigo a
                  singularidade de sua trajetória e potência criativa.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Camaleonicamente inovamos, para abranger as demandas do mercado e sempre
                  atentos às inovações.
                </p>
              </div>
              <div className="md:col-span-7 order-2 relative flex items-center justify-center h-[500px] overflow-hidden rounded-lg">
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
              </div>
            </motion.div>

            {/* Item 3 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 order-1 md:order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  Hoje: Referência no Mercado
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Agenciar para transformar e conectar, através de um gerenciamento de
                  carreira assertivo, explorando o que os torna especiais, com o olhar
                  sensível os unindo às oportunidades. É o nosso ofício e missão.
                </p>
              </div>

              <div className="md:col-span-7 order-2 relative flex items-center justify-center h-[500px] overflow-hidden rounded-lg">
                <Image
                  src={
                    isDark
                      ? '/images/LogoGalha_Atual_Transparente_LetrasBrancas.png'
                      : '/images/LogoGalha_Atual_Transparente_LetrasPretas.png'
                  }
                  alt="Agência Galharufa"
                  width={426}
                  height={426}
                  className="object-cover object-center"
                  sizes="(max-width: 426px) 80vw, 426px"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
