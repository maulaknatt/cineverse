import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/popular",
        destination: "/movies?sort=popularity.desc",
        permanent: true,
      },
      {
        source: "/top-rated",
        destination: "/movies?sort=vote_average.desc",
        permanent: true,
      },
      {
        source: "/watchlist",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/collections",
        destination: "/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
