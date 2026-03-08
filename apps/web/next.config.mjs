/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    externalDir: true
  },
  transpilePackages: ["@mockroom/shared"]
};

export default nextConfig;
