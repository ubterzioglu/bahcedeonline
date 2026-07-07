import { createFileRoute } from "@tanstack/react-router";
import { Home } from "./index";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/")({
  head: () => ({
    meta: [
      { title: "Dragoman Bahçe — A Mediterranean Garden in Kaş" },
      {
        name: "description",
        content: "Beer · Snacks · Cocktails. A candlelit garden in the heart of Kaş.",
      },
      { property: "og:title", content: "Dragoman Bahçe — Kaş" },
      { property: "og:description", content: "Beer · Snacks · Cocktails." },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/", "en"),
  }),
  component: Home,
});
