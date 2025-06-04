import React, { ChangeEvent } from 'react';
import { TextInput, TextInputProps } from '@mantine/core';

interface MaskedInputProps extends Omit<TextInputProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  mask: (value: string) => string;
  validate?: (value: string) => boolean;
}

/**
 * Componente TextInput com suporte a máscaras
 */
export const MaskedInput: React.FC<MaskedInputProps> = ({
  value,
  onChange,
  mask,
  validate,
  onBlur,
  error,
  ...props
}) => {
  // Handler para aplicar a máscara quando o valor mudar
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const maskedValue = mask(event.target.value);
    onChange(maskedValue);
  };

  // Adiciona validação ao evento onBlur, se necessário
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (validate && value) {
      // A validação é usada apenas para verificar o campo
      // O resultado é tratado pelo sistema de formulário do Mantine
      validate(value);

      // Se houver um onBlur personalizado, chame-o
      if (onBlur) {
        onBlur(event);
      }
    }
    // Se houver um onBlur personalizado e não tiver validação, chame-o
    else if (onBlur) {
      onBlur(event);
    }
  };

  return (
    <TextInput
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      {...props}
      ref={undefined} // Corrigindo o problema de ref no React 19
    />
  );
};

export default MaskedInput;
