'use client';

import { useState, useEffect } from 'react';
import { Box, Center, Loader, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

interface VideoPreviewProps {
  url: string;
  height?: number | string;
}

// Função para extrair ID do YouTube
const extractYoutubeId = (url: string): string | null => {
  if (!url) return null;

  // Padrões de URL do YouTube
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/i,
    /youtube\.com\/watch\?.*v=([^&]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

// Função para extrair ID do Vimeo
const extractVimeoId = (url: string): string | null => {
  if (!url) return null;

  // Padrões de URL do Vimeo
  const patterns = [
    /vimeo\.com\/([0-9]+)/i,
    /vimeo\.com\/channels\/.*\/([0-9]+)/i,
    /vimeo\.com\/groups\/.*\/videos\/([0-9]+)/i,
    /player\.vimeo\.com\/video\/([0-9]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

const VideoPreview: React.FC<VideoPreviewProps> = ({ url, height = 250 }) => {
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState<'youtube' | 'vimeo' | null>(null);

  useEffect(() => {
    if (!url) {
      setEmbedUrl(null);
      setError(null);
      setProvider(null);
      return;
    }

    // Verifica se é YouTube
    const youtubeId = extractYoutubeId(url);
    if (youtubeId) {
      setEmbedUrl(`https://www.youtube.com/embed/${youtubeId}`);
      setProvider('youtube');
      setError(null);
      return;
    }

    // Verifica se é Vimeo
    const vimeoId = extractVimeoId(url);
    if (vimeoId) {
      setEmbedUrl(`https://player.vimeo.com/video/${vimeoId}`);
      setProvider('vimeo');
      setError(null);
      return;
    }

    // Não é uma URL válida
    setEmbedUrl(null);
    setProvider(null);
    if (url) {
      setError('URL não reconhecida como YouTube ou Vimeo');
    } else {
      setError(null);
    }
  }, [url]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  if (!url) {
    return null;
  }

  return (
    <Box mt={10} mb={20}>
      {embedUrl ? (
        <Box style={{ position: 'relative', width: '100%', height }}>
          {loading && (
            <Center
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            >
              <Loader color={provider === 'youtube' ? 'red' : 'blue'} />
            </Center>
          )}
          <iframe
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, borderRadius: '4px' }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        </Box>
      ) : error ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          color="yellow"
          title="URL inválida"
          variant="light"
        >
          {error}
        </Alert>
      ) : null}
    </Box>
  );
};

export default VideoPreview;
