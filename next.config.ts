import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the chat.z.ai preview panel (and its wildcard subdomain) to fetch
  // /_next/* resources from the dev server without triggering CORS /
  // cross-origin warnings. The chat_id-derived hostname pattern is what the
  // gateway rewrites the preview iframe's source to.
  allowedDevOrigins: [
    "preview-chat-*.space-z.ai",
    "*.space-z.ai",
    "*.z.ai",
  ],
};

export default nextConfig;
