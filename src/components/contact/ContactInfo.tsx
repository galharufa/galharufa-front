'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPhone, FaEnvelope, FaClock, FaFileUpload, FaInstagram, FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';
import './contact-hover.css';

const ContactInfo = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const contactItems = [
    {
      icon: <FaPhone className="h-6 w-6" />,
      title: 'Telefone',
      details: [
        '(11) 98709-0824'
      ]
    },
    {
      icon: <FaEnvelope className="h-6 w-6" />,
      title: 'E-mail',
      details: [
        'atendimento@agenciagalharufa.com.br',
      ]
    },
    {
      icon: <FaClock className="h-6 w-6" />,
      title: 'Horário de Funcionamento',
      details: [
        'Segunda a Sexta: 10h às 19h',
      ]
    },
    // {
    //   icon: <FaFileUpload className="h-6 w-6" />,
    //   title: 'Envio de Material',
    //   details: [
    //     'Listinha com itens, atualizar',
    //   ]
    // }
  ];

  const socialLinks = [
    { icon: <FaInstagram className="h-6 w-6" />, href: 'https://www.instagram.com/aggalharufa/', label: 'Instagram' },
    { icon: <FaFacebook className="h-6 w-6" />, href: 'https://www.facebook.com/galharufa', label: 'Facebook' },
    { icon: <FaLinkedin className="h-6 w-6" />, href: 'https://www.linkedin.com/company/agencia-galharufa/', label: 'LinkedIn' },
    { icon: <FaWhatsapp className="h-6 w-6" />, href: 'https://wa.me/5511987654321', label: 'WhatsApp' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section ref={ref} className="py-24 bg-white dark:bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4"
          >
            Entre em Contato
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Estamos à disposição para atender suas necessidades. Entre em contato através de qualquer um dos canais abaixo.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {contactItems.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 text-white mb-4 mx-auto">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white text-center mb-4">{item.title}</h3>
              <div className="text-gray-600 dark:text-gray-300 text-center">
                {item.details.map((detail, i) => (
                  <p key={i} className="mb-1">{detail}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-md">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-semibold text-black dark:text-white text-center mb-8"
          >
            Junte-se a Nós!
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {socialLinks.map((social, index) => (
              <Link 
                key={index} 
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-hover-link flex flex-col items-center"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm mb-2">
                  {social.icon}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{social.label}</span>
              </Link>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center mt-10 mb-10 max-w-2xl mx-auto"
          >
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Prefere uma resposta rápida? Entre em contato diretamente pelo WhatsApp ou envie um e-mail para nossa equipe.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/5511987090824?text=Oie!%20Vim%20pelo%20site%20da%20Ag%C3%AAncia!" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-hover-link px-6 py-3 bg-green-500 text-white font-medium rounded-md inline-flex items-center justify-center gap-2 hover:bg-green-600 transition-all duration-300"
              >
                <FaWhatsapp className="h-5 w-5" />
                Falar pelo WhatsApp
              </a>
              <a 
                href="mailto:atendimento@galharufa.com.br" 
                className="contact-hover-link px-6 py-3 bg-gray-500 text-white font-medium rounded-md inline-flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-300"
              >
                <FaEnvelope className="h-5 w-5" />
                Enviar E-mail
              </a>
            </div>
          </motion.div>
          <hr />
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-2xl font-semibold text-black dark:text-white text-center mt-8 mb-4"
          >
            Envio de Material
          </motion.h3>

          <motion.div  
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}        
            className='text-gray-600 dark:text-gray-300 flex flex-col items-center'   
          >
            <p className='mb-4 text-center'>
              Estamos muito felizes com seu interesse em integrar nosso casting, para que possamos lhe conhecer melhor, por gentileza, encaminhar para análise seu material contendo:
            </p>
            <ul className="list-disc list-outside mb-4 ms-8 text-left ">
              <li>4 fotos produzidas ou fotos caseiras</li>
              <li>DRT (caso possua)</li>  
              <li>Link de trabalho ou monólogo</li>
              <li>Vídeo de apresentação</li>
              <li>Link de Instagram</li> 
            </ul>

            <p className='mb-4 text-center'>
              Entraremos em contato, caso seu perfil seja aprovado.
              <br/>
              Muito obrigada!
            </p>
            <a 
                href="mailto:atendimento@galharufa.com.br" 
                className="contact-hover-link px-6 py-3 bg-gray-500 text-white font-medium rounded-md inline-flex items-center justify-center gap-2 hover:bg-gray-700 transition-all duration-300"
              >
                <FaEnvelope className="h-5 w-5" />
                Enviar Material
              </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
