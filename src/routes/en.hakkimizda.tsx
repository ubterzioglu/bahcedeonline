import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "./hakkimizda";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Our Story — Dragoman Bahçe" },
      { name: "description", content: "A small Mediterranean garden in Kaş." },
      { property: "og:title", content: "Our Story — Dragoman Bahçe" },
      { property: "og:description", content: "A small Mediterranean garden in Kaş." },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/hakkimizda", "en"),
  }),
  component: AboutPage,
});
