/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1', 'backend.galharufa.com.br'],
  },
  // Ignorar erros de URL durante a geração estática
  experimental: {
    appDocumentPreloading: false,
  },
}

export default nextConfig;
