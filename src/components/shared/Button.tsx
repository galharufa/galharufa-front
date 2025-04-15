'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  external?: boolean;
}

const Button = ({
  children,
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  icon,
  iconPosition = 'left',
  disabled = false,
  type = 'button',
  ariaLabel,
  external = false,
}: ButtonProps) => {
  // Estilos base para todos os botões
  const baseClasses =
    'inline-flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white';

  // Estilos específicos para cada variante
  const variantClasses = {
    primary:
      'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200',
    secondary:
      'bg-white dark:bg-black text-black dark:text-white border border-black dark:border-white hover:bg-gray-100 dark:hover:bg-gray-900',
    outline:
      'bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black',
    text: 'bg-transparent text-black dark:text-white hover:underline',
  };

  // Estilos específicos para cada tamanho
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  };

  // Estilos para botão desabilitado
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  // Estilos para largura total
  const widthClasses = fullWidth ? 'w-full' : '';

  // Combinando todas as classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;

  // Conteúdo do botão com ícone
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </>
  );

  // Animação do botão
  const buttonAnimation = {
    whileHover: { scale: disabled ? 1 : 1.02 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 },
  };

  // Renderiza um link se href for fornecido, caso contrário, renderiza um botão
  if (href) {
    if (external) {
      return (
        <motion.a
          href={href}
          className={buttonClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={ariaLabel}
          {...buttonAnimation}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <Link href={href} passHref>
        <motion.span
          className={buttonClasses}
          aria-label={ariaLabel}
          {...buttonAnimation}
        >
          {content}
        </motion.span>
      </Link>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
      aria-label={ariaLabel}
      {...buttonAnimation}
    >
      {content}
    </motion.button>
  );
};

export default Button;
