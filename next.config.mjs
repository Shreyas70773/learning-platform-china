/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lint is run separately; do not block production builds on it.
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    // Import .md files as raw strings (Vite's `?raw` equivalent).
    config.module.rules.push({
      test: /\.md$/,
      type: 'asset/source',
    });
    return config;
  },
};

export default nextConfig;
