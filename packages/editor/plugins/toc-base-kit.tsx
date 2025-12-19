import { BaseTocPlugin } from "@platejs/toc";

import { TocElementStatic } from "../components/toc-node-static";

export const BaseTocKit = [BaseTocPlugin.withComponent(TocElementStatic)];
