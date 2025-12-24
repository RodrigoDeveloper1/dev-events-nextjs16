import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // Support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  // Rewrites for PostHog ingestion endpoints
  rewrites: async () => [
    {
      source: "/ingest/static/:path*",
      destination: "https://eu-assets.i.posthog.com/static/:path*",
    },
    {
      source: "/ingest/:path*",
      destination: "https://eu.i.posthog.com/:path*",
    },
  ],
};

export default nextConfig;
