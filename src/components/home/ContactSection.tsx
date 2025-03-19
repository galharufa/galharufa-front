'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-black">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">Entre em Contato</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para atender às suas necessidades. Entre em contato conosco para saber mais sobre nossos serviços ou para agendar uma reunião.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Endereço */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white dark:bg-black p-8 rounded-lg shadow-md text-center"
          >
            <div className="flex justify-center mb-4">
              <FaMapMarkerAlt className="text-3xl text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Endereço</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Av. Paulista, 1000
              <br />
              São Paulo, SP
              <br />
              CEP: 01310-100
            </p>
          </motion.div>

          {/* Email */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-black p-8 rounded-lg shadow-md text-center"
          >
            <div className="flex justify-center mb-4">
              <FaEnvelope className="text-3xl text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Email</h3>
            <p className="text-gray-600 dark:text-gray-400">
              contato@galharufa.com.br
              <br />
              casting@galharufa.com.br
            </p>
          </motion.div>

          {/* Telefone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-black p-8 rounded-lg shadow-md text-center"
          >
            <div className="flex justify-center mb-4">
              <FaPhone className="text-3xl text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-black dark:text-white">Telefone</h3>
            <p className="text-gray-600 dark:text-gray-400">
              (11) 3456-7890
              <br />
              (11) 98765-4321
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Link href="/contato">
            <button className="btn-primary dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Fale Conosco
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
