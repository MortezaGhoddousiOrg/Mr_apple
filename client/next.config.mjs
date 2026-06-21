console.log("NEXT CONFIG LOADED");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;