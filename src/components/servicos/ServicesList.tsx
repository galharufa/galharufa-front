/* eslint-disable no-console */
/* eslint-disable camelcase */
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FaUserTie, FaCamera, FaFilm } from 'react-icons/fa';
import { ServicosService, ServicoResumido } from '@/services';

// Dados detalhados dos serviços
const services = [
  {
    id: 1,
    icon: <FaUserTie className="text-5xl mb-6" />,
    title: 'Agenciamento Artístico',
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
    details: [
      'Fornecimento de elenco criativos para filmes, séries e novelas',
      'Casting para campanhas publicitárias',
      'Testes e audições personalizados',
      'Banco de talentos categorizado e atualizado',
      'Consultoria para diretores e produtores',
    ],
    image: '/images/service-3.jpg',
  },
];

const ServicesList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(true);
  const [servicos, setServicos] = useState<ServicoResumido[]>([]);

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        setIsLoading(true);
        setApiError(false);

        const params = {
          ativo: true, // ou false, conforme desejado
          search: '', // se quiser incluir
          ordering: 'preco', // ou outro campo
          page: 1,
          page_size: 10,
        };

        const response = await ServicosService.getServicos(params);
        setServicos(response.results);
      } catch (error) {
        console.error(error);
        setApiError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServicos(); // Aqui é onde você chama a função!
  }, []); // substitua [] por qualquer dependência que você quiser usar

  // Animação para card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  if (isLoading) {
    return (
      <div className="container-section py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-200 dark:bg-gray-800 rounded-xl w-full aspect-[3/4] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Componente de mensagem quando a API está indisponível
  const ErrorMessage = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
    >
      <div className="p-8 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Ainda não temos Posts selecionados
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          No momento, nosso arsenal de posts está indisponível. Por favor, tente novamente
          mais tarde ou entre em contato conosco para mais informações.
        </p>
      </div>
    </motion.div>
  );

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
            Conheça nossa gama completa de serviços, desenvolvidos para atender às
            necessidades específicas de nossos talentos e clientes.
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
              <div
                className={`relative h-[400px] rounded-lg overflow-hidden ${index % 2 !== 0 ? 'lg:order-1' : ''}`}
              >
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
