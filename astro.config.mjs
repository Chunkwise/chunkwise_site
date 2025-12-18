// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import catppuccin from "@catppuccin/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://Chunkwise.github.io",
  integrations: [
    starlight({
      title: "Chunkwise",
      favicon: "/favicon.ico",
      logo: {
        src: "./src/assets/logo.svg",
      },
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/chunkwise",
        },
      ],
      components: {
        Header: "./src/components/CustomHeader.astro",
      },
      sidebar: [
        {
          label: "Case Study",
          autogenerate: { directory: "case_study" },
        },
      ],
      plugins: [],
    }),
  ],
});
