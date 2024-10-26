/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "larbreapains.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.larbreapains.fr",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
