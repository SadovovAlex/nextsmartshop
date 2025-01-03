/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ryazantvorog.ru',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'xn-----6kccstfpfjmicbdprf7c7cl0k6bjc.xn--p1ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Включение подробных сообщений об ошибках в режиме разработки
  onDemandEntries: {
    // Период ожидания (в миллисекундах), прежде чем страница будет удалена из буфера
    maxInactiveAge: 25 * 1000,
    // Количество страниц, которые должны быть в буфере одновременно
    pagesBufferLength: 2,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
