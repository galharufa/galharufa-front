'use client';

import { useRef, ReactNode } from 'react';
import { motion, useInView } from 'framer-motion';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  once?: boolean;
}

const AnimatedSection = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: AnimatedSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  // Definir valores iniciais com base na direção
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 50 };
      case 'down':
        return { opacity: 0, y: -50 };
      case 'left':
        return { opacity: 0, x: 50 };
      case 'right':
        return { opacity: 0, x: -50 };
      case 'none':
        return { opacity: 0 };
      default:
        return { opacity: 0, y: 50 };
    }
  };

  // Definir valores finais com base na direção
  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 };
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 };
      case 'none':
        return { opacity: 1 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitialPosition()}
      animate={isInView ? getFinalPosition() : getInitialPosition()}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;
