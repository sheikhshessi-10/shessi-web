import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The LGS Bid Dashboard (PortalPro) is a static Vite SPA living in public/lgs.
  // Real files (public/lgs/assets/*) serve directly; afterFiles runs only when no
  // file matches, so client-side routes like /lgs/all fall back to the SPA shell.
  async rewrites() {
    return {
      afterFiles: [
        { source: "/lgs", destination: "/lgs/index.html" },
        { source: "/lgs/:path*", destination: "/lgs/index.html" },
      ],
      beforeFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
