import { config, withVarlock } from "@repo/next-config";
import type { NextConfig } from "next";

let nextConfig: NextConfig = {
  ...config,
  serverExternalPackages: ["mongoose"],
};

export default withVarlock(nextConfig);

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
