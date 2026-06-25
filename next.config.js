/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // produces a minimal self-contained server for Docker
  reactStrictMode: true,
};

export default nextConfig;
