/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "impressive-canary-671.convex.cloud",
        pathname: "/api/storage/**",
        port: "",
      },
      {
        protocol: "https",
        hostname: "accurate-avocet-121.convex.cloud",
        pathname: "/api/storage/**",
        port: "",
      },
    ],
  },
};

export default nextConfig;
