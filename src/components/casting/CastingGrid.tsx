'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'framer-motion';

// Tipos para os talentos
type Talent = {
  id: number;
  name: string;
  category: string[];
  image: string;
  age: number;
  height: string;
  specialties: string[];
  featured: boolean;
};

// Dados simulados de talentos
const talents: Talent[] = [
  {
    id: 1,
    name: 'Ana Silva',
    category: ['atrizes', 'modelos'],
    image: '/images/talents/talent1.jpg',
    age: 28,
    height: '1.75m',
    specialties: ['Drama', 'Comerciais', 'Passarela'],
    featured: true,
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    category: ['atores'],
    image: '/images/talents/talent2.jpg',
    age: 35,
    height: '1.82m',
    specialties: ['Cinema', 'Teatro', 'Publicidade'],
    featured: true,
  },
  {
    id: 3,
    name: 'Juliana Costa',
    category: ['atrizes', 'apresentadores'],
    image: '/images/talents/talent3.jpg',
    age: 31,
    height: '1.68m',
    specialties: ['Apresentação', 'Entrevistas', 'Comerciais'],
    featured: false,
  },
  {
    id: 4,
    name: 'Pedro Almeida',
    category: ['atores', 'modelos'],
    image: '/images/talents/talent4.jpg',
    age: 27,
    height: '1.85m',
    specialties: ['Moda', 'Publicidade', 'Fotografia'],
    featured: true,
  },
  {
    id: 5,
    name: 'Mariana Santos',
    category: ['atrizes', 'influenciadores'],
    image: '/images/talents/talent5.jpg',
    age: 24,
    height: '1.70m',
    specialties: ['Redes Sociais', 'Lifestyle', 'Beleza'],
    featured: false,
  },
  {
    id: 6,
    name: 'Lucas Oliveira',
    category: ['atores'],
    image: '/images/talents/talent6.jpg',
    age: 40,
    height: '1.78m',
    specialties: ['Teatro', 'Cinema', 'TV'],
    featured: false,
  },
  {
    id: 7,
    name: 'Camila Ferreira',
    category: ['modelos', 'plus-size'],
    image: '/images/talents/talent6.jpg',
    age: 29,
    height: '1.72m',
    specialties: ['Moda Plus Size', 'Editoriais', 'Campanhas'],
    featured: true,
  },
  {
    id: 8,
    name: 'Rafael Souza',
    category: ['atores', 'apresentadores'],
    image: '/images/talents/talent6.jpg',
    age: 38,
    height: '1.80m',
    specialties: ['Eventos', 'TV', 'Publicidade'],
    featured: false,
  },
  {
    id: 9,
    name: 'Sofia Lima',
    category: ['infantil'],
    image: '/images/talents/talent6.jpg',
    age: 10,
    height: '1.40m',
    specialties: ['Comerciais', 'TV', 'Fotografia'],
    featured: true,
  },
  {
    id: 10,
    name: 'Antônio Pereira',
    category: ['atores', 'terceira-idade'],
    image: '/images/talents/talent6.jpg',
    age: 65,
    height: '1.75m',
    specialties: ['Cinema', 'Novelas', 'Comerciais'],
    featured: false,
  },
  {
    id: 11,
    name: 'Isabela Castro',
    category: ['atrizes', 'modelos'],
    image: '/images/talents/talent6.jpg',
    age: 26,
    height: '1.78m',
    specialties: ['Desfiles', 'Editoriais', 'Atuação'],
    featured: false,
  },
  {
    id: 12,
    name: 'Matheus Dias',
    category: ['atores', 'influenciadores'],
    image: '/images/talents/talent6.jpg',
    age: 22,
    height: '1.83m',
    specialties: ['Digital', 'Esportes', 'Lifestyle'],
    featured: true,
  },
  {
    id: 13,
    name: 'Luísa Fernandes',
    category: ['atrizes'],
    image: '/images/talents/talent6.jpg',
    age: 33,
    height: '1.65m',
    specialties: ['Teatro', 'Cinema', 'Séries'],
    featured: false,
  },
  {
    id: 14,
    name: 'Gabriel Martins',
    category: ['modelos'],
    image: '/images/talents/talent6.jpg',
    age: 25,
    height: '1.88m',
    specialties: ['Alta Costura', 'Campanhas', 'Desfiles'],
    featured: true,
  },
  {
    id: 15,
    name: 'Helena Rocha',
    category: ['atrizes', 'terceira-idade'],
    image: '/images/talents/talent6.jpg',
    age: 70,
    height: '1.62m',
    specialties: ['Novelas', 'Cinema', 'Publicidade'],
    featured: false,
  },
  {
    id: 16,
    name: 'Davi Carvalho',
    category: ['infantil'],
    image: '/images/talents/talent6.jpg',
    age: 8,
    height: '1.30m',
    specialties: ['Publicidade', 'TV', 'Dublagem'],
    featured: false,
  },
  {
    id: 17,
    name: 'Bianca Alves',
    category: ['modelos', 'plus-size'],
    image: '/images/talents/talent6.jpg',
    age: 31,
    height: '1.70m',
    specialties: ['Moda Inclusiva', 'Campanhas', 'Editoriais'],
    featured: true,
  },
  {
    id: 18,
    name: 'Rodrigo Nunes',
    category: ['atores'],
    image: '/images/talents/talent6.jpg',
    age: 42,
    height: '1.79m',
    specialties: ['Séries', 'Cinema', 'Publicidade'],
    featured: false,
  },
];

type CastingGridProps = {
  filter: string;
};

const CastingGrid = ({ filter }: CastingGridProps) => {
  const [filteredTalents, setFilteredTalents] = useState<Talent[]>([]);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    // Filtra os talentos com base na categoria selecionada
    if (filter === 'todos') {
      setFilteredTalents(talents);
    } else {
      const filtered = talents.filter(talent => talent.category.includes(filter));
      setFilteredTalents(filtered);
    }
  }, [filter]);

  return (
    <section ref={ref} className="py-10 bg-white dark:bg-black">
      <div className="container-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTalents.length > 0 ? (
              filteredTalents.map((talent, index) => (
                <motion.div
                  key={talent.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group"
                >
                  <Link href={`/casting/${talent.id}`} className="block">
                    <div className="relative overflow-hidden rounded-lg">
                      <div className="relative h-[400px] overflow-hidden">
                        <Image
                          src={talent.image}
                          alt={talent.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                        {talent.featured && (
                          <div className="absolute top-4 right-4 bg-black text-white px-3 py-1 text-sm rounded-full">
                            Destaque
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-xl font-semibold text-white mb-1">{talent.name}</h3>
                          <p className="text-gray-300 text-sm mb-2">
                            {talent.age} anos • {talent.height}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {talent.specialties.map((specialty, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-white/20 text-white px-2 py-1 rounded-full"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h3 className="text-lg font-semibold text-black dark:text-white">{talent.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {talent.category.map(cat => {
                          const category = categories.find(c => c.id === cat);
                          return category ? category.label : cat;
                        }).join(', ')}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Nenhum talento encontrado nesta categoria.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

// Categorias para exibição
const categories = [
  { id: 'atores', label: 'Ator' },
  { id: 'atrizes', label: 'Atriz' },
  { id: 'modelos', label: 'Modelo' },
  { id: 'influenciadores', label: 'Influenciador' },
  { id: 'apresentadores', label: 'Apresentador' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'plus-size', label: 'Plus Size' },
  { id: 'terceira-idade', label: 'Terceira Idade' },
];

export default CastingGrid;
