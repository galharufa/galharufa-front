'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CastingService } from '@/services/casting.service';

type FilterProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

const CastingFilters = ({ activeFilter, setActiveFilter }: FilterProps) => {
  const [categories, setCategories] = useState<Array<{id: string, label: string}>>([
    { id: 'todos', label: 'Todos' }
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await CastingService.getCategorias({ ordering: 'nome' });
        
        // Transformar as categorias do banco para o formato esperado pelo componente
        const dbCategories = categoriesData.results.map(cat => ({
          id: cat.id.toString(),
          label: cat.nome
        }));
        
        // Manter a opção "Todos" no início da lista
        setCategories([
          { id: 'todos', label: 'Todos' },
          ...dbCategories
        ]);
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        // Manter apenas a opção 'Todos' quando a API estiver indisponível
        setCategories([{ id: 'todos', label: 'Todos' }]);
      }
    };

    fetchCategories();
  }, []);

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
                className={`relative px-6 py-2 rounded-full transition-all duration-300 ${activeFilter === category.id
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
