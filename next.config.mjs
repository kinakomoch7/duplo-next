/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true, // 静的ファイルを Next.js の画像最適化なしで提供
  },
};

export default nextConfig;
