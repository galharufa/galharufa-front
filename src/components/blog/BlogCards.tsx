'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { BlogService, Post } from '@/services/blog.service';

const blogPosts = [
  {
    title: 'Agenciamento Artístico na Prática',
    description:
      'Entenda como funciona o trabalho de um agente artístico e o impacto na carreira de um talento.',
    image: '/images/placeholder-talent.jpg',
    slug: 'agenciamento-artistico-na-pratica',
  },
  {
    title: 'Dicas para Criar um Material Atrativo',
    description:
      'Saiba como produzir fotos e vídeos que realmente vendem sua imagem como ator ou atriz.',
    image: '/images/placeholder-talent.jpg',
    slug: 'dicas-material-para-atores',
  },
  {
    title: 'Marketing de Influência: Muito Além dos Números',
    description:
      'Como criar parcerias autênticas com marcas e se destacar como influenciador.',
    image: '/images/placeholder-talent.jpg',
    slug: 'marketing-de-influencia-autenticidade',
  },
  {
    title: 'Por que Fazer Workshops com Frequência?',
    description:
      'Conheça os benefícios de manter-se sempre atualizado através de treinamentos e cursos.',
    image: '/images/placeholder-talent.jpg',
    slug: 'importancia-dos-workshops',
  },
];

const BlogCards = () => {
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
          <h2 className="heading-secondary text-black dark:text-white">Nosso Blog</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Fique por dentro das novidades, tendências e dicas para impulsionar sua
            carreira e seus projetos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-black p-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Image
                src={post.image || '/images/placeholder-talent.jpg'}
                alt={post.title}
                fill
                sizes="(max-width: 420px) 100vw"
                className="object-content rounded-t-lg"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.description}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="nav-link inline-block text-black dark:text-white font-medium"
                >
                  Leia mais
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        ></motion.div>
      </div>
    </section>
  );
};

export default BlogCards;
