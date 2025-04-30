/* eslint-disable no-console */
/* eslint-disable camelcase */
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
// import { FaUserTie, FaCamera } from 'react-icons/fa';
import { ServicosService, ServicoResumido } from '@/services';

// // Dados detalhados dos serviços
// const services = [
//   {
//     id: 1,
//     icon: <FaUserTie className="text-5xl mb-6" />,
//     title: 'Agenciamento Artístico',
//     details: [
//       'Representação exclusiva para atores, criativos e influenciadores',
//       'Negociação de contratos e cachês',
//       'Planejamento estratégico de carreira',
//       'Assessoria jurídica especializada',
//     ],
//     image: '/images/service-1.jpg',
//   },
//   {
//     id: 2,
//     icon: <FaCamera className="text-5xl mb-6" />,
//     title: 'Material para Atores',
//     details: [
//       'Produção de material fotográfico',
//       'Videobook',
//       'Vídeos de Apresentação',
//       'Edição de Demo Reel',
//     ],
//     image: '/images/service-2.jpg',
//   },
// ];

const ServicesList = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(true);
  const [servicos, setServicos] = useState<ServicoResumido[]>([]);
  const [displayCount, setDisplayCount] = useState(8);
  const loadMoreRef = useRef(null);

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

    fetchServicos();
  }, []);

  // Incrementar o número de serviços exibidos quando o elemento de referência estiver visível
  useEffect(() => {
    if (isInView && displayCount < servicos.length) {
      setDisplayCount((prev) => Math.min(prev + 4, servicos.length));
    }
  }, [isInView, servicos.length, displayCount]);

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
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
      >
        <div className="p-8 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
            Ainda não temos serviços a serem exibidos
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No momento, nosso arsenal de serviços está indisponível. Por favor, tente
            novamente mais tarde ou entre em contato conosco para mais informações.
          </p>
        </div>
      </motion.div>
    </>
  );

  return (
    <section className="py-20 bg-white dark:bg-black">
      <div className="container-section py-4">
        <h2 className="heading-secondary text-black dark:text-white text-center mb-16">
          O Que Oferecemos
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
        <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
          Conheça nossa gama completa de serviços, desenvolvidos para atender às
          necessidades específicas de nossos talentos e clientes.
        </p>

        <AnimatePresence>
          {apiError ? (
            <ErrorMessage />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {servicos.length > 0
                ? servicos.slice(0, displayCount).map((servico, index) => (
                    <motion.div
                      key={servico.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layoutId={`post-${servico.id}`}
                      className="group cursor-pointer opacity-70 hover:opacity-100 hover:cursor-pointer grayscale hover:grayscale-0"
                    >
                      <Link href={`/servicos/${servico.id}`} passHref>
                        <div className="relative overflow-hidden rounded-xl w-full aspect-[3/4]">
                          <Image
                            src={servico.imagem || '/images/placeholder-talent.jpg'}
                            alt={servico.nome}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xl font-semibold">
                              {servico.nome}
                            </h3>
                            <p className="text-gray-300 text-sm">{servico.descricao}</p>
                            <p className="text-gray-300 text-sm">{servico.descricao}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                : !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 text-center py-12"
                    >
                      <p className="text-gray-600 dark:text-gray-400">
                        Nenhum serviço encontrado para os filtros selecionados.
                      </p>
                    </motion.div>
                  )}
            </div>
          )}
        </AnimatePresence>

        {!apiError && servicos.length > displayCount && (
          <div ref={loadMoreRef} className="w-full h-20 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ServicesList;
