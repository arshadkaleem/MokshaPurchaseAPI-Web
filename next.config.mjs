/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable useEslintrc option during build (removed in ESLint 9+)
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
