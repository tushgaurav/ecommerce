import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "owlwebassets.s3.ap-south-1.amazonaws.com",
      "via.placeholder.com",
    ],
  },
};

export default nextConfig;
