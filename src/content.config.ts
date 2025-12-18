import { defineCollection } from "astro:content";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";
import { Zoom } from "starlight-image-zoom/components";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};

declare module "starlight-image-zoom/components" {
  // We use 'any' here because we just want the error to go away
  // and we know the component works at runtime.
  export const Zoom: any;
}
