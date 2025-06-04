// Utilitários para formatação e validação de campos de formulário

// Máscara para CPF: formato 123.456.789-00
export const maskCPF = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 11 dígitos
  const cpf = onlyNumbers.substring(0, 11);

  // Aplica a máscara
  return cpf
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

// Máscara para CNPJ: formato 12.345.678/0001-90
export const maskCNPJ = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 14 dígitos
  const cnpj = onlyNumbers.substring(0, 14);

  // Aplica a máscara
  return cnpj
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
};

// Máscara para telefone: formato (11) 98765-4321 ou (11) 1234-5678
export const maskPhone = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 11 dígitos (com DDD)
  const phone = onlyNumbers.substring(0, 11);

  // Aplica a máscara de acordo com o comprimento (celular ou telefone fixo)
  if (phone.length <= 10) {
    return phone.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }

  return phone.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

// Máscara para CEP: formato 12345-678
export const maskCEP = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 8 dígitos
  const cep = onlyNumbers.substring(0, 8);

  // Aplica a máscara
  return cep.replace(/^(\d{5})(\d)/, '$1-$2');
};

// Máscara para altura: formato 1.75
export const maskHeight = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos (exceto ponto decimal)
  const cleaned = value.replace(/[^\d.]/g, '');

  // Verifica se já tem um ponto decimal
  if (cleaned.includes('.')) {
    const [integerPart, decimalPart] = cleaned.split('.');
    // Limita a parte inteira a 1 dígito e a parte decimal a 2 dígitos
    return `${integerPart.substring(0, 1)}.${decimalPart.substring(0, 2)}`;
  }

  // Se não tem ponto decimal e o valor tem mais de 1 dígito,
  // insere o ponto após o primeiro dígito
  if (cleaned.length > 1) {
    return `${cleaned.substring(0, 1)}.${cleaned.substring(1, 3)}`;
  }

  return cleaned;
};

// Máscara para peso: somente números
export const maskWeight = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  return value.replace(/\D/g, '');
};

// Máscara para RG: somente números, máx 15 caracteres
export const maskRG = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 15 dígitos
  return onlyNumbers.substring(0, 15);
};

// Validador de e-mail
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Máscara para data: formato DD/MM/YYYY
export const maskDate = (value: string): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos
  const onlyNumbers = value.replace(/\D/g, '');
  // Limita a 8 dígitos (DDMMYYYY)
  const date = onlyNumbers.substring(0, 8);

  // Aplica a máscara
  return date
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
};

// Máscara para números bancários (agência/conta): somente números
export const maskBankNumbers = (value: string, maxLength: number = 20): string => {
  if (!value) return '';

  // Remove todos os caracteres não numéricos (exceto hífen para dígito verificador)
  const cleaned = value.replace(/[^\d-]/g, '');

  // Limita ao tamanho máximo
  return cleaned.substring(0, maxLength);
};
