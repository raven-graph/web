import type { NextConfig } from "next";

// Retired routes (partnership, graph explorer, dashboard). Source lives in
// git history; old links land on the homepage with a 301.
const RETIRED = ["/partnership", "/graph", "/dashboard"];

const nextConfig: NextConfig = {
  async redirects() {
    return RETIRED.map((path) => ({
      source: `${path}/:rest*`,
      destination: "/",
      statusCode: 301,
    }));
  },
};

export default nextConfig;
