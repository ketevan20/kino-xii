import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      {
        protocol: "https",
        hostname: "api.kinoxii.redberryinternship.ge",
      }
    ],
  },
};

export default nextConfig;
