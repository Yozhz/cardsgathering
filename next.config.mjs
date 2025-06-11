/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Webpack para manejar SVG
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts|jsx|tsx)$/],
      },
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // Configuración de optimización de imágenes para dominios remotos
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'en.onepiece-cardgame.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pokemontcg.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.dbs-cardgame.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'world.digimoncard.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.unionarena-tcg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gundam-gcg.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

// Se usa export default para compatibilidad con módulos ES (ESM)
export default nextConfig;