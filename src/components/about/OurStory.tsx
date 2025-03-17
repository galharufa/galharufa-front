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
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">2010: O Início</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  A Galharufa nasceu do sonho de dois amigos apaixonados pelo mundo artístico, Ricardo Galha e Rúbia Rufa. Com experiência no mercado de entretenimento, eles identificaram a necessidade de uma agência que realmente valorizasse os talentos e construísse carreiras sólidas.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Começando com apenas cinco talentos e um pequeno escritório no centro de São Paulo, a agência rapidamente se destacou pela abordagem personalizada e pelo compromisso com a excelência.
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
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
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
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">2015: Expansão</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Após cinco anos de crescimento constante, a Galharufa expandiu suas operações, mudando-se para um escritório maior na Avenida Paulista e ampliando sua equipe para atender a demanda crescente.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Neste período, a agência começou a representar talentos internacionalmente, estabelecendo parcerias estratégicas com agências na Europa e nos Estados Unidos, abrindo novas portas para seus artistas.
                </p>
              </div>
            </motion.div>

            {/* Item 3 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 order-2 md:order-1">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">2018: Inovação</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Sempre atenta às tendências do mercado, a Galharufa foi pioneira na criação de um departamento dedicado exclusivamente a influenciadores digitais, reconhecendo o potencial das novas mídias.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  A agência também investiu em tecnologia, desenvolvendo um sistema próprio de gestão de talentos e oportunidades, otimizando processos e melhorando a experiência tanto para os artistas quanto para os clientes.
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

            {/* Item 4 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 order-1 relative h-[300px] overflow-hidden rounded-lg">
                <Image
                  src="/images/about-4.jpg"
                  alt="Galharufa Hoje"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="md:col-span-5 order-2">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">Hoje: Referência no Mercado</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Atualmente, a Galharufa é reconhecida como uma das principais agências de talentos do Brasil, representando mais de 200 artistas em diversas categorias e trabalhando com as maiores marcas e produtoras do país.
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  Mantendo sua essência e valores originais, a agência continua a crescer e inovar, sempre com o objetivo de proporcionar as melhores oportunidades para seus talentos e os melhores resultados para seus clientes.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurStory;
