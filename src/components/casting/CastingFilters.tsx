'use client';

import { motion } from 'framer-motion';

type FilterProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

// Categorias de casting
const categories = [
  { id: 'todos', label: 'Todos' },
  { id: 'atores', label: 'Atores' },
  { id: 'atrizes', label: 'Atrizes' },
  { id: 'modelos', label: 'Modelos' },
  { id: 'influenciadores', label: 'Influenciadores' },
  { id: 'apresentadores', label: 'Apresentadores' },
  { id: 'infantil', label: 'Infantil' },
  { id: 'plus-size', label: 'Plus Size' },
  { id: 'terceira-idade', label: 'Terceira Idade' },
];

const CastingFilters = ({ activeFilter, setActiveFilter }: FilterProps) => {
  return (
    <div className="py-10 bg-white dark:bg-black">
      <div className="container-section">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">Filtrar por Categoria</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`relative px-6 py-2 rounded-full transition-all duration-300 ${
                  activeFilter === category.id
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
                {activeFilter === category.id && (
                  <motion.span
                    layoutId="activeFilterIndicator"
                    className="absolute inset-0 rounded-full bg-black dark:bg-white -z-10"
                    initial={false}
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastingFilters;
