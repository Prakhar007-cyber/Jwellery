import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow remote luxury photography from Unsplash (optimized by Next/Image).
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
