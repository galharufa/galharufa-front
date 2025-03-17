'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';

interface CtaBannerProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: 'black' | 'white' | 'gray';
}

const CtaBanner = ({
  title,
  description,
  buttonText,
  buttonLink,
  bgColor = 'black'
}: CtaBannerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const getBgColor = () => {
    switch (bgColor) {
      case 'white':
        return 'bg-white dark:bg-black';
      case 'gray':
        return 'bg-gray-100 dark:bg-gray-900';
      case 'black':
      default:
        return 'bg-black dark:bg-gray-900 text-white';
    }
  };

  const getTextColor = () => {
    return bgColor === 'black' ? 'text-white' : 'text-black dark:text-white';
  };

  const getButtonClass = () => {
    return bgColor === 'black'
      ? 'bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black dark:hover:bg-gray-200'
      : 'bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200';
  };

  return (
    <section ref={ref} className={`py-16 ${getBgColor()}`}>
      <div className="container-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${getTextColor()}`}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`mb-8 ${
              bgColor === 'black' ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href={buttonLink}
              className={`inline-block px-8 py-3 rounded-lg font-medium transition-colors ${getButtonClass()}`}
            >
              {buttonText}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner;
