'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  FaStar,
  FaHandshake,
  FaLightbulb,
  FaUsers,
  FaGlobe,
  FaHeart,
} from 'react-icons/fa';

const values = [
  {
    icon: <FaStar className="text-4xl mb-4" />,
    title: 'Excelência',
    description:
      'Buscamos a excelência em tudo o que fazemos, desde a seleção de talentos até a execução de projetos.',
  },
  {
    icon: <FaHandshake className="text-4xl mb-4" />,
    title: 'Integridade',
    description:
      'Agimos com transparência e ética em todos os relacionamentos, construindo confiança com clientes e talentos.',
  },
  {
    icon: <FaLightbulb className="text-4xl mb-4" />,
    title: 'Inovação',
    description:
      'Estamos sempre em busca de novas ideias e abordagens para impulsionar a carreira de nossos talentos.',
  },
  {
    icon: <FaUsers className="text-4xl mb-4" />,
    title: 'Colaboração',
    description:
      'Acreditamos no poder do trabalho em equipe e na colaboração para alcançar resultados extraordinários.',
  },
  {
    icon: <FaGlobe className="text-4xl mb-4" />,
    title: 'Diversidade',
    description:
      'Valorizamos a diversidade em todas as suas formas, promovendo um ambiente inclusivo e representativo.',
  },
  {
    icon: <FaHeart className="text-4xl mb-4" />,
    title: 'Paixão',
    description:
      'Somos movidos pela paixão pelo mundo artístico e pelo desenvolvimento de talentos excepcionais.',
  },
];

const OurValues = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">Nossos Valores</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Os princípios que guiam nossas ações e decisões todos os dias.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-black dark:text-white">{value.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                {value.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurValues;
