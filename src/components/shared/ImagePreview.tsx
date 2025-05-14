'use client';

import { useEffect, useState } from 'react';
import { Box, Center, Image, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface ImagePreviewProps {
  file?: File | null;
  height?: number | string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, height = 200 }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setError(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('O arquivo selecionado não é uma imagem válida.');
      setPreviewUrl(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setLoading(false);
    };
    reader.onerror = () => {
      setError('Erro ao carregar a imagem.');
      setPreviewUrl(null);
      setLoading(false);
    };

    setLoading(true);
    reader.readAsDataURL(file);

    return () => {
      setPreviewUrl(null);
    };
  }, [file]);

  if (!file) return null;

  return (
    <Box mt={10} mb={20}>
      {error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="red"
          title="Erro"
          variant="light"
        >
          {error}
        </Alert>
      ) : previewUrl ? (
        <Box style={{ position: 'relative', width: '100%', height }}>
          {loading && (
            <Center
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <Loader color="violet" />
            </Center>
          )}
          <Image
            src={previewUrl}
            alt="Pré-visualização"
            radius="md"
            height={height}
            fit="contain"
            style={{ objectFit: 'cover', width: '100%' }}
            onLoad={() => setLoading(false)}
          />
        </Box>
      ) : null}
    </Box>
  );
};

export default ImagePreview;
