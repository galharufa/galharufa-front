// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string | {
    template: string;
    default: string;
  };
  description?: string;
  keywords?: string[];
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    type?: string;
  };
}

// Definição estática de metadados para evitar erros durante o build
export const metadata: MetadataBase = {
  title: 'Agência Galharufa | Agenciamento Artístico',
  description: 'Escritório de agenciamento artístico',
  keywords: ['agência de atores', 'casting', 'elenco', 'talentos', 'influencer', 'criativos', 'apresentadores', 'Galharufa'],
  openGraph: {
    title: 'Agência Galharufa | Agenciamento Artístico',
    description: 'Escritório de agenciamento artístico de atores, talentos, influencers, comunicadores e criativos.',
    url: 'https://www.galharufa.com.br',
    siteName: 'Agência Galharufa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Galharufa - Agência de Talentos',
      },
    ],
    type: 'website',
  },
};
