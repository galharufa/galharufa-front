'use client';

import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = '',
}: PaginationProps) => {
  // Calcular range de itens exibidos
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Gerar array de páginas para mostrar
  const getVisiblePages = () => {
    const delta = 2; // Número de páginas antes e depois da atual
    const pages: (number | string)[] = [];

    // Sempre mostrar primeira página
    if (totalPages > 1) {
      pages.push(1);
    }

    // Adicionar páginas ao redor da atual
    const start = Math.max(2, currentPage - delta);
    const end = Math.min(totalPages - 1, currentPage + delta);

    // Adicionar "..." se necessário
    if (start > 2) {
      pages.push('...');
    }

    // Adicionar páginas do meio
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    // Adicionar "..." se necessário
    if (end < totalPages - 1) {
      pages.push('...');
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  if (totalPages <= 1) return null;

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Info de resultados */}
      <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Mostrando{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{startItem}</span>{' '}
        a <span className="font-medium text-gray-900 dark:text-gray-100">{endItem}</span>{' '}
        de{' '}
        <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>{' '}
        resultados
      </div>

      {/* Controles de paginação */}
      <div className="flex items-center space-x-2">
        {/* Botão Anterior */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
            ${
              currentPage === 1
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }
          `}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </motion.button>

        {/* Números das páginas */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500 dark:text-gray-400">...</span>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page as number)}
                  className={`
                    w-10 h-10 rounded-lg border transition-all duration-200 font-medium
                    ${
                      currentPage === page
                        ? 'border-primary bg-primary text-white shadow-lg'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {page}
                </motion.button>
              )}
            </div>
          ))}
        </div>

        {/* Botão Próximo */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-200
            ${
              currentPage === totalPages
                ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
            }
          `}
        >
          <ChevronRightIcon className="w-5 h-5" />{' '}
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;
