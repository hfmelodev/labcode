import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
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
  images: {
    // Significa que a aplicação não vai otimizar as imagens, ou seja, não vai redimensionar as imagens para diferentes tamanhos de tela.
    // Isso é útil para imagens que não precisam ser otimizadas, como imagens que já estão em um tamanho adequado.
    // No futuro, quando tivermos problemas com o tamanho das imagens, podemos remover essa opção.
    unoptimized: true,
  },
}

export default nextConfig
