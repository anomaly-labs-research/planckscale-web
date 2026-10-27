/** @type {import('next').NextConfig} */

// Static export: Cloudflare serves ./out as Workers static assets, no server runtime.
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
