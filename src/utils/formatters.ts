/* eslint-disable no-console */

/**
 * Formata uma data no formato YYYY-MM-DD para DD/MM/YYYY
 * @param dataString String de data no formato YYYY-MM-DD
 * @returns Data formatada como DD/MM/YYYY
 */
export function formatarData(dataString: string): string {
  if (!dataString) return 'N/A';

  try {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return dataString;
  }
}

/**
 * Formata um número para moeda brasileira
 * @param valor Número a ser formatado
 * @returns Valor formatado como moeda brasileira
 */
export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export const validateEmail = (email?: string) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email ?? '');
};

export const validateUserName = (userName?: string) => {
  return /^[a-zA-Z0-9@.+_-]{1,100}$/.test(userName ?? '');
};

export const validateOnlyNumbers = (value?: string) => {
  return /^[0-9]{1,}$/.test(value ?? '');
};
