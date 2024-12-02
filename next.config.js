/** @type {import('next').NextConfig} */
const nextConfig = {
 //output: 'export',
  images: {
    //unoptimized: true,
    domains: [
      "xn-----6kccstfpfjmicbdprf7c7cl0k6bjc.xn--p1ai",
      "images.pexels.com",
      "img.freepik.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "i.ibb.co",
      "flaticon.com",
    ],
  },
};


const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
