import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@remcostoeten/dev-widget"],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
