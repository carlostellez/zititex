import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for S3 deployment
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slashes for better S3 compatibility
  trailingSlash: true,
  
  // Optional: Configure base path if deploying to a subdirectory
  // basePath: '',
  
  // Optional: Configure asset prefix for CDN
  // assetPrefix: 'https://your-cloudfront-domain.cloudfront.net',
};

export default nextConfig;
