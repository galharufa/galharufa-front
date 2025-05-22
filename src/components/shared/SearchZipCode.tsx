import { useEffect } from 'react';
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
  useEffect(() => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length === 8) {
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
            alert('CEP não encontrado.');
          }
        } catch (error) {
          onResult({});
          errorToast('Erro ao consultar o CEP.');
        } finally {
          onLoading(false);
        }
      };

      fetchEndereco();
    }
  }, [cep, onLoading, onResult]);

  return null;
};
