/** @type {import('next').NextConfig} */
const nextConfig = {
   //output: 'export',
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
        pathname: '/**', // Разрешает доступ ко всем путям
      },
      
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**',
      },
     
    ],
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
