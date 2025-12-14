/** biome-ignore-all lint/performance/noNamespaceImport: Need to import all to Drizzle recoganize */
import * as auth from "./auth";
import * as page from "./pages";

export const schemas = {
  ...auth,
  ...page,
};
