'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import AnimatedSection from '@/components/shared/AnimatedSection';
import AnimatedText from '@/components/shared/AnimatedText';
import CtaBanner from '@/components/shared/CtaBanner';

// Tipo para as perguntas frequentes
type FaqItem = {
  question: string;
  answer: string;
  category: string;
};

// Dados simulados de perguntas frequentes
const faqData: FaqItem[] = [
  {
    question: 'Como funciona o processo de casting?',
    answer: 'O processo de casting começa com a análise do perfil solicitado pelo cliente. Em seguida, selecionamos talentos que correspondam às características desejadas e enviamos suas fotos e informações para aprovação. Após a pré-seleção, organizamos testes presenciais ou por vídeo, dependendo da necessidade do projeto.',
    category: 'casting',
  },
  {
    question: 'Quais tipos de talentos vocês representam?',
    answer: 'Representamos uma ampla variedade de talentos, incluindo atores, atrizes, modelos, influenciadores, apresentadores, e talentos infantis. Nossa agência também trabalha com perfis plus-size e da terceira idade, garantindo diversidade para todos os tipos de projetos.',
    category: 'casting',
  },
  {
    question: 'Quanto tempo leva para receber os perfis após a solicitação?',
    answer: 'Normalmente, enviamos uma seleção inicial de perfis em até 48 horas após a solicitação formal. Para projetos urgentes, podemos acelerar esse processo e fornecer opções em 24 horas, dependendo da complexidade e especificidade do casting solicitado.',
    category: 'prazos',
  },
  {
    question: 'Vocês trabalham com projetos internacionais?',
    answer: 'Sim, temos experiência em projetos internacionais e parcerias com agências em diversos países. Podemos facilitar a contratação de talentos brasileiros para produções estrangeiras, bem como auxiliar em questões de visto, logística e requisitos legais para trabalhos internacionais.',
    category: 'projetos',
  },
  {
    question: 'Como são definidos os valores para contratação de talentos?',
    answer: 'Os valores são definidos com base em diversos fatores, incluindo o tipo de mídia (TV, cinema, internet), abrangência (local, nacional, internacional), tempo de veiculação, exclusividade e a experiência do talento. Trabalhamos com tabelas de referência do mercado e podemos fornecer orçamentos detalhados para cada projeto.',
    category: 'valores',
  },
  {
    question: 'Vocês oferecem serviços de produção além do casting?',
    answer: 'Sim, além do casting, oferecemos serviços complementares como produção de figurino, maquiagem, locação de espaços para testes e gravações, transporte de talentos e coordenação de elenco durante as produções. Nosso objetivo é facilitar todo o processo para nossos clientes.',
    category: 'servicos',
  },
  {
    question: 'Como faço para me cadastrar como talento na agência?',
    answer: 'Para se cadastrar como talento, você pode preencher o formulário em nossa página de contato, especificando seu interesse em fazer parte do nosso casting. Solicitamos fotos recentes (rosto e corpo inteiro), informações básicas como idade, altura e experiência prévia. Após análise, nossa equipe entrará em contato caso seu perfil se adeque ao nosso banco de talentos.',
    category: 'cadastro',
  },
  {
    question: 'Quais são os prazos médios para um projeto completo?',
    answer: 'Os prazos variam conforme a complexidade do projeto. Em média, um processo completo de casting, desde a solicitação até a finalização da contratação, leva de 1 a 3 semanas. Para campanhas maiores ou projetos audiovisuais mais complexos, recomendamos iniciar o processo com pelo menos um mês de antecedência.',
    category: 'prazos',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'casting', label: 'Casting' },
    { id: 'valores', label: 'Valores' },
    { id: 'prazos', label: 'Prazos' },
    { id: 'servicos', label: 'Serviços' },
    { id: 'projetos', label: 'Projetos' },
    { id: 'cadastro', label: 'Cadastro' },
  ];

  const filteredFaqs = activeCategory === 'todos' 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index) 
        : [...prev, index]
    );
  };

  return (
    <div className="bg-white dark:bg-black min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-100 dark:bg-gray-900 py-20 md:py-28">
        <div className="container-section">
          <AnimatedText 
            text="Perguntas Frequentes" 
            className="heading-primary text-center text-black dark:text-white mb-6"
          />
          <AnimatedText 
            text="Encontre respostas para as dúvidas mais comuns sobre nossos serviços"
            className="text-xl text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            delay={0.2}
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-section py-16">
        {/* Filtros por categoria */}
        <AnimatedSection className="mb-12" direction="up">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-black dark:bg-white text-white dark:text-black'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Lista de FAQs */}
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.map((faq, index) => (
            <AnimatedSection
              key={index}
              className="mb-4"
              direction="up"
              delay={index * 0.1}
            >
              <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex justify-between items-center p-5 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <h3 className="text-lg font-medium text-black dark:text-white">{faq.question}</h3>
                  <span className="ml-4 flex-shrink-0">
                    {openItems.includes(index) ? (
                      <FiChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <FiChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </span>
                </button>
                
                <AnimatePresence>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mensagem se não houver FAQs na categoria */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">Nenhuma pergunta encontrada nesta categoria.</p>
          </div>
        )}
      </div>

      {/* Seção de contato */}
      <AnimatedSection className="bg-gray-100 dark:bg-gray-900 py-16" direction="up">
        <div className="container-section text-center">
          <h2 className="heading-secondary text-black dark:text-white mb-4">Não encontrou o que procurava?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Entre em contato conosco diretamente e nossa equipe terá prazer em responder a todas as suas perguntas sobre nossos serviços.
          </p>
          <a href="/contato" className="btn-primary">
            Fale Conosco
          </a>
        </div>
      </AnimatedSection>

      {/* CTA Banner */}
      <CtaBanner 
        title="Pronto para iniciar seu projeto?"
        description="Encontre os melhores talentos para sua produção com a Galharufa."
        buttonText="Solicitar Casting"
        buttonLink="/contato"
        bgColor="black"
      />
    </div>
  );
}
