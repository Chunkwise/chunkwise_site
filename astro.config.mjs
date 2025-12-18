// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import catppuccin from "@catppuccin/starlight";
import starlightImageZoom from "starlight-image-zoom";

// https://astro.build/config
export default defineConfig({
  site: "https://Chunkwise.github.io",
  vite: {
    assetsInclude: ["**/*.lottie"],
  },
  integrations: [
    starlight({
      title: "Chunkwise",
      favicon: "/favicon.ico",
      logo: {
        src: "/src/assets/logos/logo.svg",
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
      tableOfContents: {
        maxHeadingLevel: 4,
      },
      routeMiddleware: "./src/routeData.ts",
      plugins: [
        catppuccin({
          dark: { flavor: "macchiato", accent: "sapphire" },
          light: { flavor: "latte", accent: "sapphire" },
        }),
        starlightImageZoom(),
      ],
    }),
  ],
});
