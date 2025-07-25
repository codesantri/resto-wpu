import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit:'10mb',
    },
  },
  devIndicators: false,
  images: {
    domains:["https://knqmniyqnquddnagousb.supabase.co"],
    remotePatterns: [
      {
        protocol:'https',
        hostname:'knqmniyqnquddnagousb.supabase.co',
        port: '',
        pathname:'/**'
      }
    ]
  }
};

export default nextConfig;
