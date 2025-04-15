'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle = ({ className = '' }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita problemas de hidratação
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white ${className}`}
      aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <motion.div
          initial={false}
          animate={{
            y: theme === 'dark' ? 0 : -30,
            opacity: theme === 'dark' ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center text-black dark:text-white"
        >
          <FiSun className="w-5 h-5" />
        </motion.div>

        <motion.div
          initial={false}
          animate={{
            y: theme === 'dark' ? 30 : 0,
            opacity: theme === 'dark' ? 0 : 1,
          }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center text-black dark:text-white"
        >
          <FiMoon className="w-5 h-5" />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default ThemeToggle;
