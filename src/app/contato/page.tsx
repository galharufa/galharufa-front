import React from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';

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
    <>
      <ContactHero />
      <ContactInfo />
    </>
  );
}
