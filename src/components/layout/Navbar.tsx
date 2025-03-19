'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogIn } from 'react-icons/fi';
import Image from 'next/image';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { useTheme } from 'next-themes';
import './hover-link.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Controla o estado de scroll da página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu mobile quando uma rota é alterada
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/casting', label: 'Casting' },
    { href: '/contato', label: 'Contato' },
  ];

  // Determina a cor do texto com base no scroll, pathname e tema
  const getTextColor = () => {
    if (scrolled) {
      return 'text-black dark:text-white';
    }
    
    if (pathname === '/') {
      return 'text-white';
    }
    
    return isDark ? 'text-white' : 'text-black';
  };

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md' 
          : pathname === '/' 
            ? 'bg-transparent' 
            : 'bg-white/90 dark:bg-black/90 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <div className="flex items-center">
              {scrolled || pathname !== '/' ? (
                <div className="relative w-auto">
                  <Image 
                    src={isDark ? "/images/logo_horizontal_black.jpg" : "/images/logo_horizontal_white.jpg"} 
                    alt="Galharufa Logo" 
                    width={140}
                    height={28}
                    className="object-contain w-auto"
                  />
                </div>
              ) : (
                <div className="relative w-auto">
                  <Image 
                    src="/images/logo_horizontal_black.jpg" 
                    alt="Galharufa Logo" 
                    width={140}
                    height={28}
                    className="object-contain w-auto"
                  />
                </div>
              )}
            </div>
          </Link>

          {/* Links de navegação para desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`hover-link ${getTextColor()} ${
                  pathname === link.href ? 'font-medium' : 'font-normal'
                } ${
                  !scrolled && pathname === '/' ? 'hover-link-light' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Área direita com botão de tema e menu mobile */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
              {/* <Link href="/admin/login" className={`hover-link ${getTextColor()}`}>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <FiLogIn className="h-4 w-4" />
                  <span className="hidden md:inline">Admin</span>
                </div>
              </Link> */}
            {/* Botão do menu mobile */}
            <button
              className="md:hidden relative z-10 p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {isOpen ? (
                <FiX className={`h-6 w-6 ${getTextColor()}`} />
              ) : (
                <FiMenu className={`h-6 w-6 ${getTextColor()}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-black"
          >
            <div className="container mx-auto px-4 py-8">
              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className={`text-xl hover-link text-black dark:text-white ${
                      pathname === link.href ? 'font-medium' : 'font-normal'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* <Link 
                  href="/admin/login"
                  className="text-xl hover-link text-black dark:text-white flex items-center"
                >
                  <FiLogIn className="mr-2" />
                  Login
                </Link> */}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
