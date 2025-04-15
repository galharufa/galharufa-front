'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

const OurStory = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="heading-secondary text-black dark:text-white">
              Nossa Trajetória
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              Uma história de paixão, dedicação e sucesso no mundo artístico.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-16">
            {/* Item 1 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
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
              <div className="md:col-span-7 order-1 md:order-2 relative h-[300px] overflow-hidden rounded-lg">
                <Image
                  src="/images/about-1.jpg"
                  alt="Início da Galharufa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Item 2 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-7 order-1 relative h-[300px] overflow-hidden rounded-lg">
                <Image
                  src="/images/about-2.jpg"
                  alt="Expansão da Galharufa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:col-span-5 order-2">
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
            </motion.div>

            {/* Item 3 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                  Hoje: Referência no Mercado
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Agenciar para transformar e conectar, através de um gerenciamento de
                  carreira assertivo, explorando que os torna especiais, com o olhar
                  sensível e os unindo as oportunidades, é o nosso ofício e missão.
                </p>
              </div>
              <div className="md:col-span-7 order-1 md:order-2 relative h-[300px] overflow-hidden rounded-lg">
                <Image
                  src="/images/about-3.jpg"
                  alt="Inovação na Galharufa"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
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
