'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Dados simulados da equipe
const teamMembers = [
  {
    id: 1,
    name: 'Juliana Azevedo',
    role: 'Diretora Executivo & Co-Fundador',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: 'https://linkedin.com/in/ricardogalha',
      instagram: 'https://instagram.com/ricardogalha',
      email: 'juliana@agenciagalharufa.com.br',
    },
  },
  {
    id: 2,
    name: 'Alexandre Sean',
    role: 'Diretor Artístico & Co-Fundador',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: 'https://linkedin.com/in/rubiarufa',
      instagram: 'https://instagram.com/rubiarufa',
      email: 'rubia@galharufa.com.br',
    },
  },
  {
    id: 3,
    name: 'Elen Coutinho',
    role: 'Assistente de Booker',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'elen@galharufa.com.br',
    },
  },
  {
    id: 4,
    name: 'Fabio Brum',
    role: 'Jurídico',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'fabio@galharufa.com.br',
    },
  },
  {
    id: 5,
    name: 'Isabel Bertolino',
    role: 'Contabilidade',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'isabel@galharufa.com.br',
    },
  },
  {
    id: 6,
    name: 'Gislaine Marconato',
    role: 'Assistente comercial departamento infantil',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'gislaine@galharufa.com.br',
    },
  },
  {
    id: 7,
    name: 'Pamella Gaiguer',
    role: 'Tech Lead',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'pamella@galharufa.com.br',
    },
  },
  {
    id: 8,
    name: 'Tom Gomes',
    role: 'Fiscal de Set',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'tom@galharufa.com.br',
    },
  },
  {
    id: 9,
    name: 'Leo Zaccur',
    role: 'Diretor de Arte',
    backgroundImage: '/images/BackgroundTeamMembers.jpg',
    image: '',
    social: {
      linkedin: '',
      instagram: '',
      email: 'leo@galharufa.com.br',
    },
  },
];

const OurTeam = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container-section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-secondary text-black dark:text-white">Nossa Equipe</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Conheça os profissionais apaixonados que fazem da Galharufa uma agência de
            excelência.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-black rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div
                className="relative h-80 flex items-center justify-center bg-gray-200 dark:bg-gray-800"
                style={{
                  backgroundImage:
                    !member.image && member.backgroundImage
                      ? `url(${member.backgroundImage})`
                      : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-black/60 flex items-center justify-center text-white text-3xl font-bold shadow-md z-10">
                    {getInitials(member.name)}
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-black dark:text-white">
                  {member.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{member.role}</p>
                <div className="flex space-x-4">
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                    aria-label={`LinkedIn de ${member.name}`}
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                    aria-label={`Instagram de ${member.name}`}
                  >
                    <FaInstagram className="text-xl" />
                  </a>
                  <a
                    href={`mailto:${member.social.email}`}
                    className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-300"
                    aria-label={`Email de ${member.name}`}
                  >
                    <FaEnvelope className="text-xl" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
