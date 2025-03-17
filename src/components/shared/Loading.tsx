'use client';

import React from 'react';
import { Loader } from '@mantine/core';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6">
      <Loader size="md" color="gray" className="mb-4" />
      <p className="text-gray-600 dark:text-gray-300 font-medium text-center">{message}</p>
    </div>
  );
};

export default Loading;
