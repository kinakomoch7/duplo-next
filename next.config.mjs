/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: [
      "thread-stream",
      "pino",
      "pino-worker",
      "pino-file",
      "pino-pretty",
    ],
  },
  webpack: (config) => {
    // パスエイリアスを追加します
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": ".",
    };

    return config;
  },
};

export default nextConfig;
