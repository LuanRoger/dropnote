// biome-ignore lint/performance/noBarrelFile: Export posthog from here since they are not installed in other packages
export { posthog as product } from "posthog-js";
export { parseError } from "./error";
