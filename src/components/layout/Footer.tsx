'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: '/', label: 'Home' },
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/servicos', label: 'Serviços' },
    { href: '/cast', label: 'Casting' },
    { href: '/contato', label: 'Contato' },
  ];

  const socialLinks = [
    {
      icon: <FaInstagram />,
      href: 'https://www.instagram.com/aggalharufa/',
      label: 'Instagram',
    },
    {
      icon: <FaFacebook />,
      href: 'https://www.facebook.com/galharufa',
      label: 'Facebook',
    },
    {
      icon: <FaLinkedin />,
      href: 'https://www.linkedin.com/company/agencia-galharufa/',
      label: 'LinkedIn',
    },
  ];

  return (
    <footer className="bg-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo e Descrição */}
          <div className="col-span-1">
            <Link href="/">
              <h2 className="text-2xl font-bold mb-4 uppercase">Agência Galharufa</h2>
            </Link>
            <p className="text-gray-400 mb-6">
              Agência de talentos especializada em conectar artistas excepcionais com
              oportunidades transformadoras.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Úteis */}
          <div className="col-span-1">
            {/* <h3 className="text-lg font-semibold mb-4 text-gray-200">Acesso Rápido</h3> */}
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="hover-link hover-link-light text-gray-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4 text-gray-200">Contato</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="mailto:atendimento@agenciagalharufa.com.br">
                  atendimento@agenciagalharufa.com.br
                </a>
              </li>
              <li>São Paulo, SP</li>
            </ul>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Agência Galharufa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
