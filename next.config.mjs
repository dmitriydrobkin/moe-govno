/** @type {import('next').NextConfig} */
const nextConfig = {
  // Отключаем статику для страниц ошибок, переводим их в Edge
  experimental: {
    runtime: 'edge',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
