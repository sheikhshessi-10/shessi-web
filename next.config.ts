import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The LGS product moved to its own home (2026-08-28): /lgs now forwards to
  // looksgreatservices.shessi.dev. The old static SPA copy in public/lgs is
  // retired behind this redirect (files left in place, unreachable).
  // Temporary (307), not permanent, so browsers don't cache it forever if the
  // path is ever repurposed.
  async redirects() {
    return [
      { source: "/lgs", destination: "https://looksgreatservices.shessi.dev", permanent: false },
      { source: "/lgs/:path*", destination: "https://looksgreatservices.shessi.dev", permanent: false },
    ];
  },
};

export default nextConfig;
