'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface AnimatedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  once?: boolean;
  delay?: number;
  fill?: boolean;
}

const AnimatedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  once = true,
  delay = 0,
  fill = false,
}: AnimatedImageProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        fill={fill}
        className={`object-cover transition-transform duration-700 hover:scale-105 ${fill ? 'w-full h-full' : ''}`}
      />
    </motion.div>
  );
};

export default AnimatedImage;
