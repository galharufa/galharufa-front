import React from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';
import Script from 'next/script';

// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
}

export const metadata: MetadataBase = {
  title: 'Contato',
  description: 'Entre em contato com a Agência Galharufa. Estamos sempre prontos para lhe atender e tirar suas dúvidas.',
};

export default function ContactPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
       {/* Script para otimizar carregamento de CSS */}
       <Script id="optimize-css" strategy="afterInteractive">
         {`
           document.addEventListener('DOMContentLoaded', function() {
             const preloadLinks = document.querySelectorAll('link[rel="preload"][as="style"]');
             preloadLinks.forEach(link => {
               if (link instanceof HTMLLinkElement) {
                 link.setAttribute('rel', 'stylesheet');
                 link.removeAttribute('as');
               }
             });
           });
         `}
       </Script>
      <ContactHero />
      <ContactInfo />
    </div>
  );
}
