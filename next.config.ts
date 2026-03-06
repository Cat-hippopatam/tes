import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Редирект с www на без www (или наоборот)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.economikus.ru',
          },
        ],
        destination: 'https://economikus.ru/:path*',
        permanent: true,
      },
      // Редирект с HTTP на HTTPS
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'http://economikus.ru',
          },
        ],
        destination: 'https://economikus.ru/:path*',
        permanent: true,
      },
    ];
  },
  
  // Настройки изображений
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
