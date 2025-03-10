import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
{
  hostname: 'sumaq-bucket.s3.us-east-2.amazonaws.com',
  protocol: 'https',
}
    ]
  }
  /* config options here */
};

export default nextConfig;
