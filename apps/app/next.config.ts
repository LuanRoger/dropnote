import { config, withAnalyzer } from "@repo/next-config";
import type { NextConfig } from "next";
import { env } from "./env";

let nextConfig: NextConfig = {
  ...config,
  serverExternalPackages: ["mongoose", "@takumi-rs/image-response"],
};

if (env.ANALYZE === "true") {
  nextConfig = withAnalyzer(nextConfig);
}

export default nextConfig;
