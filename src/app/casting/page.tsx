'use client';

import { useState } from 'react';
import CastingHero from '@/components/casting/CastingHero';
import CastingFilters from '@/components/casting/CastingFilters';
import CastingGrid from '@/components/casting/CastingGrid';
import CtaBanner from '@/components/shared/CtaBanner';

export default function CastingPage() {
  const [activeFilter, setActiveFilter] = useState('todos');

  return (
    <>
      <CastingHero />
      <CastingFilters activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <CastingGrid filter={activeFilter} />
      <CtaBanner 
        title="Quer fazer parte do nosso casting?"
        description="Estamos sempre em busca de novos talentos. Se você tem interesse em fazer parte da nossa agência, entre em contato conosco."
        buttonText="Cadastre-se"
        buttonLink="/contato"
        bgColor="white"
      />
    </>
  );
}
