// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightThemeFlexoki from "starlight-theme-flexoki";
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
        ThemeProvider: "./src/components/ThemeProvider.astro",
        ThemeSelect: "./src/components/ToggleTheme.astro",
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
        starlightImageZoom(),
        starlightThemeFlexoki({
          accentColor: "blue",
        }),
      ],
    }),
  ],
});
