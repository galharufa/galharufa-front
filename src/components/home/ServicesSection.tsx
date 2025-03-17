'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaUserTie, FaCamera, FaFilm, FaAd, FaTheaterMasks, FaGlobe } from 'react-icons/fa';

const services = [
  {
    icon: <FaUserTie className="text-4xl mb-4" />,
    title: 'Agenciamento',
    description: 'Representação completa para atores, modelos e influenciadores, conectando-os com as melhores oportunidades do mercado.',
  },
  {
    icon: <FaCamera className="text-4xl mb-4" />,
    title: 'Produção Fotográfica',
    description: 'Sessões fotográficas profissionais para compor e atualizar o material de divulgação dos nossos talentos.',
  },
  {
    icon: <FaFilm className="text-4xl mb-4" />,
    title: 'Casting para Cinema e TV',
    description: 'Seleção de talentos para produções audiovisuais, desde comerciais até longas-metragens e séries.',
  },
  {
    icon: <FaAd className="text-4xl mb-4" />,
    title: 'Campanhas Publicitárias',
    description: 'Conexão entre marcas e talentos para campanhas publicitárias impactantes e autênticas.',
  },
  {
    icon: <FaTheaterMasks className="text-4xl mb-4" />,
    title: 'Produção de Eventos',
    description: 'Organização e produção de eventos corporativos, desfiles e apresentações artísticas.',
  },
  {
    icon: <FaGlobe className="text-4xl mb-4" />,
    title: 'Carreira Internacional',
    description: 'Suporte para desenvolvimento de carreira internacional, com parcerias em diversos países.',
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">Nossos Serviços</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Oferecemos uma gama completa de serviços para impulsionar a carreira dos nossos talentos e atender às necessidades dos nossos clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-black p-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="text-black dark:text-white">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">{service.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
              <Link href="/servicos" className="nav-link inline-block text-black dark:text-white font-medium">
                Saiba mais
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/servicos">
            <button className="btn-primary dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Ver Todos os Serviços
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
