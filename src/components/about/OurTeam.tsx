'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { FaLinkedin, FaInstagram, FaEnvelope } from 'react-icons/fa';

// Dados simulados da equipe
const teamMembers = [
  {
    id: 1,
    name: 'Ricardo Galha',
    role: 'Diretor Executivo & Co-Fundador',
    image: '/images/team-1.jpg',
    bio: 'Com mais de 20 anos de experiência no mercado artístico, Ricardo é responsável pela visão estratégica da Galharufa.',
    social: {
      linkedin: 'https://linkedin.com/in/ricardogalha',
      instagram: 'https://instagram.com/ricardogalha',
      email: 'ricardo@galharufa.com.br',
    },
  },
  {
    id: 2,
    name: 'Rúbia Rufa',
    role: 'Diretora Criativa & Co-Fundadora',
    image: '/images/team-2.jpg',
    bio: 'Ex-modelo e produtora, Rúbia traz sua experiência para identificar e desenvolver novos talentos com um olhar único.',
    social: {
      linkedin: 'https://linkedin.com/in/rubiarufa',
      instagram: 'https://instagram.com/rubiarufa',
      email: 'rubia@galharufa.com.br',
    },
  },
  {
    id: 3,
    name: 'Marcelo Santos',
    role: 'Diretor de Casting',
    image: '/images/team-3.jpg',
    bio: 'Especialista em casting para cinema e TV, Marcelo tem um talento natural para encontrar o artista perfeito para cada projeto.',
    social: {
      linkedin: 'https://linkedin.com/in/marcelosantos',
      instagram: 'https://instagram.com/marcelosantos',
      email: 'marcelo@galharufa.com.br',
    },
  }
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
          <h2 className="heading-secondary text-black dark:text-white">
            Nossa Equipe
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Conheça os profissionais apaixonados que fazem da Galharufa uma agência de excelência.
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
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-black dark:text-white">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{member.role}</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{member.bio}</p>
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
