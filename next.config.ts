import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

};
module.exports = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental : [
    '@prisma/client'
  ]
}
export default nextConfig;
