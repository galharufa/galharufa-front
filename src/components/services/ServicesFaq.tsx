'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';
import AnimatedSection from '../shared/AnimatedSection';
import AnimatedText from '../shared/AnimatedText';

// Dados das perguntas frequentes
const faqs = [
  {
    question: 'Como faço para me tornar um talento da Galharufa?',
    answer: 'Para se tornar um talento da Galharufa, você pode enviar seu material (fotos, vídeos, currículo) através da seção "Contato" do nosso site. Nossa equipe avaliará seu perfil e entrará em contato caso haja interesse em agendar uma entrevista presencial.',
  },
  {
    question: 'Quais são os custos para ser agenciado pela Galharufa?',
    answer: 'A Galharufa não cobra taxas iniciais para agenciamento. Nosso modelo de negócio é baseado em comissão sobre os trabalhos realizados. Após a aprovação no processo seletivo, todos os detalhes financeiros são discutidos durante a assinatura do contrato.',
  },
  {
    question: 'A Galharufa trabalha com talentos de todas as idades?',
    answer: 'Sim, trabalhamos com talentos de todas as idades, desde crianças (representadas por seus responsáveis legais) até a terceira idade. Temos departamentos específicos para cada faixa etária, garantindo um atendimento personalizado para cada perfil.',
  },
  {
    question: 'Como funciona o processo de casting para um projeto específico?',
    answer: 'Quando recebemos uma solicitação de casting, nossa equipe seleciona os perfis que melhor atendem aos requisitos do projeto. Os talentos selecionados são convidados para testes ou têm seu material enviado para aprovação do cliente. Após a escolha final, cuidamos de toda a negociação e logística.',
  },
  {
    question: 'A Galharufa oferece exclusividade para seus talentos?',
    answer: 'Oferecemos diferentes modalidades de contrato, que podem incluir exclusividade total ou parcial, dependendo do perfil e dos objetivos de carreira do talento. Cada caso é analisado individualmente para garantir o melhor resultado para ambas as partes.',
  },
  {
    question: 'Como a agência ajuda no desenvolvimento da carreira dos talentos?',
    answer: 'Além da representação comercial, oferecemos workshops, treinamentos e mentorias para o desenvolvimento contínuo dos nossos talentos. Também realizamos análises periódicas de carreira, estabelecendo metas e estratégias personalizadas para cada perfil.',
  },
  {
    question: 'A Galharufa atua apenas no Brasil ou também internacionalmente?',
    answer: 'Temos atuação nacional e internacional. Mantemos parcerias com agências em diversos países, possibilitando oportunidades globais para nossos talentos. Oferecemos todo o suporte necessário para trabalhos internacionais, desde a preparação até o acompanhamento durante o período no exterior.',
  },
  {
    question: 'Quais tipos de empresas podem contratar os serviços da Galharufa?',
    answer: 'Atendemos diversos segmentos, como produtoras de cinema e TV, agências de publicidade, marcas de moda, empresas de eventos, entre outros. Qualquer empresa que necessite de talentos para suas produções ou campanhas pode contar com nossos serviços de casting e agenciamento.',
  },
];

const ServicesFaq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const ref = useRef(null);

  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section ref={ref} className="py-20 bg-gray-100 dark:bg-gray-900">
      <div className="container-section">
        <AnimatedSection className="text-center mb-16" direction="up">
          <h2 className="heading-secondary text-black dark:text-white">
            <AnimatedText text="Perguntas Frequentes" />
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-black to-gray-500 dark:from-white dark:to-gray-500 mx-auto mt-2 mb-6"></div>
          <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Encontre respostas para as dúvidas mais comuns sobre nossos serviços e processos.
          </p>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <AnimatedSection
              key={index}
              className="mb-4"
              delay={index * 0.1}
              direction="up"
            >
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full text-left p-5 flex justify-between items-center rounded-lg ${
                  activeIndex === index
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'bg-white text-black dark:bg-black dark:text-white'
                } hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors duration-300`}
                aria-expanded={activeIndex === index}
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <FaChevronDown
                  className={`transform transition-transform duration-300 ${
                    activeIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                      <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesFaq;
