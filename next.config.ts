import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-8c10d2756d3f4a05ba9f58ca24b83a11.r2.dev',
      },
    ],
  },
  allowedDevOrigins: ['labcode.hit.dev.br'],
  // Configura o Next.js para usar o Turbopack para otimização dos SVGS em tempo de desenvolvimento
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  // Configura o Next.js para usar o SVGR para converter os SVGS em componentes React em tempo de compilação
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    })

    return config
  },
}

export default nextConfig
