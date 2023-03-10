import { defineConfig } from "astro/config";

// https://astro.build/config
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  outDir: "./docs",
  integrations: [
    svelte(),
    tailwind({
      config: { path: "./tailwind.config.cjs" },
    }),
  ],
});
