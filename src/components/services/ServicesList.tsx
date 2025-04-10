'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FaUserTie, FaCamera, FaFilm, FaAd, FaTheaterMasks, FaGlobe, FaGraduationCap, FaHandshake } from 'react-icons/fa';

// Dados detalhados dos serviços
const services = [
  {
    id: 1,
    icon: <FaUserTie className="text-5xl mb-6" />,
    title: 'Agenciamento Artístico',
    // description: 'Representação completa para atores, modelos e influenciadores, conectando-os com as melhores oportunidades do mercado.',
    details: [
      'Representação exclusiva para atores, criativos e influenciadores',
      'Negociação de contratos e cachês',
      'Planejamento estratégico de carreira',
      'Assessoria jurídica especializada',
    ],
    image: '/images/service-1.jpg',
  },
  {
    id: 2,
    icon: <FaCamera className="text-5xl mb-6" />,
    title: 'Material para Atores',
    // description: 'Sessões fotográficas profissionais para compor e atualizar o material de divulgação dos nossos talentos.',
    details: [
      'Produção de material fotográfico',
      'Videobook',
      'Vídeos de Apresentação',
      'Edição de Demo Reel',
    ],
    image: '/images/service-2.jpg',
  },
  {
    id: 3,
    icon: <FaFilm className="text-5xl mb-6" />,
    title: 'Casting On Screen e Off Screen para Audiovisual',
    // description: 'Seleção de talentos para produções audiovisuais, desde comerciais até longas-metragens e séries.',
    details: [
      'Fornecimento de elenco criativos para filmes, séries e novelas',
      'Casting para campanhas publicitárias',
      'Testes e audições personalizados',
      'Banco de talentos categorizado e atualizado',
      'Consultoria para diretores e produtores'
    ],
    image: '/images/service-3.jpg',
  },
  // {
  //   id: 4,
  //   icon: <FaAd className="text-5xl mb-6" />,
  //   title: 'Campanhas Publicitárias',
  //   description: 'Conexão entre marcas e talentos para campanhas publicitárias impactantes e autênticas.',
  //   details: [
  //     'Seleção de talentos para campanhas de marcas',
  //     'Negociação de contratos de imagem',
  //     'Gestão de direitos autorais e de imagem',
  //     'Acompanhamento durante as produções',
  //     'Assessoria para aprovações e ajustes',
  //   ],
  //   image: '/images/service-4.jpg',
  // },
  // {
  //   id: 5,
  //   icon: <FaTheaterMasks className="text-5xl mb-6" />,
  //   title: 'Produção de Eventos',
  //   description: 'Organização e produção de eventos corporativos, desfiles e apresentações artísticas.',
  //   details: [
  //     'Produção completa de desfiles de moda',
  //     'Organização de eventos corporativos',
  //     'Casting para eventos especiais',
  //     'Coordenação de backstage',
  //     'Produção de showcases para novos talentos',
  //   ],
  //   image: '/images/service-5.jpg',
  // },
  // {
  //   id: 6,
  //   icon: <FaGlobe className="text-5xl mb-6" />,
  //   title: 'Carreira Internacional',
  //   description: 'Suporte para desenvolvimento de carreira internacional, com parcerias em diversos países.',
  //   details: [
  //     'Parcerias com agências internacionais',
  //     'Preparação para o mercado global',
  //     'Tradução e adaptação de material promocional',
  //     'Assessoria para vistos de trabalho',
  //     'Acompanhamento remoto durante trabalhos no exterior',
  //   ],
  //   image: '/images/service-6.jpg',
  // },
  // {
  //   id: 7,
  //   icon: <FaGraduationCap className="text-5xl mb-6" />,
  //   title: 'Workshops e Treinamentos',
  //   description: 'Capacitação contínua para nossos talentos através de workshops, cursos e treinamentos especializados.',
  //   details: [
  //     'Workshops de interpretação e técnicas de atuação',
  //     'Treinamento de passarela para modelos',
  //     'Cursos de oratória e expressão corporal',
  //     'Workshops de marketing pessoal para influenciadores',
  //     'Treinamentos de postura para fotografia',
  //   ],
  //   image: '/images/service-7.jpg',
  // },
  // {
  //   id: 8,
  //   icon: <FaHandshake className="text-5xl mb-6" />,
  //   title: 'Consultoria para Empresas',
  //   description: 'Serviços de consultoria para empresas que desejam trabalhar com influenciadores e talentos em suas estratégias de marketing.',
  //   details: [
  //     'Análise de perfil de marca e público-alvo',
  //     'Seleção estratégica de talentos alinhados com valores da marca',
  //     'Desenvolvimento de campanhas com influenciadores',
  //     'Mensuração de resultados e ROI',
  //     'Gestão de relacionamento com talentos',
  //   ],
  //   image: '/images/service-8.jpg',
  // },
];

const ServicesList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">
            O Que Oferecemos
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Conheça nossa gama completa de serviços, desenvolvidos para atender às necessidades específicas de nossos talentos e clientes.
          </p>
        </motion.div>

        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 0 ? '' : 'lg:flex-row-reverse'
              }`}
            >
              <div className={`${index % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="text-black dark:text-white flex justify-center lg:justify-start">
                  {service.icon}
                </div>
                <h3 className="text-3xl font-semibold mb-4 text-black dark:text-white text-center lg:text-left">
                  {service.title}
                </h3>
                <ul className="space-y-3 mb-6">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="inline-block w-2 h-2 bg-black dark:bg-white rounded-full mt-2 mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`relative h-[400px] rounded-lg overflow-hidden ${index % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesList;
