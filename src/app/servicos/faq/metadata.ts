// Define um tipo básico para o metadata
interface MetadataBase {
  title?: string;
  description?: string;
  keywords?: string[];
}

export const metadata: MetadataBase = {
  title: 'Perguntas Frequentes | Serviços',
  description: 'Encontre respostas para as dúvidas mais comuns sobre os serviços oferecidos pela Agência Galharufa.',
  keywords: ['FAQ', 'perguntas frequentes', 'dúvidas', 'casting', 'agência', 'talentos', 'Galharufa'],
};
