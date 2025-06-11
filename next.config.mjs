// next.config.mjs  <-- Si lo renombraste a .mjs
// O next.config.js <-- Si sigue siendo .js pero estás en una versión de Node/Next.js que espera ESM

/** @type {import('next').NextConfig} */
const nextConfig = {
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

// CAMBIO AQUÍ: Usar export default en lugar de module.exports
export default nextConfig;