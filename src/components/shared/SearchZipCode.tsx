import { useEffect, useRef } from 'react';
import { errorToast } from '../../utils';

interface SearchZipCodeProps {
  cep: string;
  onResult: (endereco: {
    logradouro?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    ibge?: string;
  }) => void;
  onLoading: (loading: boolean) => void;
}

export const SearchZipCode = ({ cep, onResult, onLoading }: SearchZipCodeProps) => {
  // Usar uma ref para controlar qual CEP já foi buscado
  const lastCepRef = useRef<string>('');

  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');

    // Se o CEP já foi buscado anteriormente, não busca novamente
    if (cepLimpo.length === 8 && lastCepRef.current !== cepLimpo) {
      // Armazena o CEP atual para evitar buscas repetidas
      lastCepRef.current = cepLimpo;

      const fetchEndereco = async () => {
        onLoading(true);
        try {
          const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
          const data = await res.json();

          if (!data.erro) {
            onResult({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              estado: data.uf,
              ibge: data.ibge,
            });
          } else {
            onResult({});
            errorToast('CEP não encontrado.');
          }
        } catch {
          onResult({});
          errorToast('Erro ao consultar o CEP.');
        } finally {
          onLoading(false);
        }
      };

      fetchEndereco();
    }
  }, [cep, onResult, onLoading]);

  return null;
};
