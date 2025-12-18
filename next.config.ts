/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'api.agenciagalharufa.com.br',
      },
    ],
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