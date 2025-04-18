/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'api.agenciagalharufa.com.br'],
  },
  // Ignorar erros de URL durante a geração estática
  experimental: {
    appDocumentPreloading: false,
  },
  // Otimização para evitar warnings de preload de CSS
  compiler: {
    styledComponents: true,
  },
  // Configuração para contornar CORS em desenvolvimento
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.agenciagalharufa.com.br/api/:path*',
      },
    ];
  },
};

export default nextConfig;
