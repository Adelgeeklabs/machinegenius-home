// import { withNextVideo } from "next-video/process";
/**
 * @type {import('next').NextConfig}
 *
 */
const nextConfig = {
  // images: { unoptimized: true },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**", // Match any hostname
        pathname: "**", // Match any path
      },
      {
        protocol: "https",
        hostname: "**", // Match any hostname
        pathname: "**", // Match any path
      },
      {
        protocol: "https",
        hostname: "machine-genius.s3.us-east-1.amazonaws.com",
        pathname: "/**", // Allows all paths in this bucket
      },
    ],
  },
  reactStrictMode: false,
  transpilePackages: ["@mui/x-date-pickers"],
};

export default nextConfig;
