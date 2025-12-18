import { defineRouteMiddleware } from "@astrojs/starlight/route-data";

export const onRequest = defineRouteMiddleware((context) => {
  // Get the current page's title
  const pageTitle = context.locals.starlightRoute.entry.data.title;

  // Access the Table of Contents (TOC)
  const toc = context.locals.starlightRoute.toc;

  // Update the first item (the "Overview" link) to match the page title
  if (toc && toc.items.length > 0) {
    toc.items[0].text = pageTitle;
  }
});
