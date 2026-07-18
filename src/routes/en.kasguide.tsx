import { createFileRoute } from "@tanstack/react-router";
import { KasguidePage } from "./kasguide";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/kasguide")({
  head: () => ({
    meta: [
      { title: "Kasguide.de — Kaş Guide | Dragoman Bahçe" },
      {
        name: "description",
        content: "The most comprehensive guide to Kaş. Soon on Kasguide.de.",
      },
      { property: "og:title", content: "Kasguide.de — Kaş Guide" },
      {
        property: "og:description",
        content: "The most comprehensive guide to Kaş. Soon on Kasguide.de.",
      },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/kasguide", "en"),
  }),
  component: KasguidePage,
});
