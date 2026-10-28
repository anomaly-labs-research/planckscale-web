/** @type {import('next').NextConfig} */

// Static export: Cloudflare serves ./out as Workers static assets, no server runtime.
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Needed because (site) and (mev) are separate root layouts with no shared app/layout.
  experimental: { globalNotFound: true },
};

export default nextConfig;
