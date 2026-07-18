import { createFileRoute } from "@tanstack/react-router";
import { ProgramPage } from "./program";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/program")({
  head: () => ({
    meta: [
      { title: "Live Music Program — Dragoman Bahçe" },
      {
        name: "description",
        content: "Who's playing which night? Follow the weekly live music program.",
      },
      { property: "og:title", content: "Live Music Program — Dragoman Bahçe" },
      { property: "og:description", content: "A story every evening in the garden." },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/program", "en"),
  }),
  component: ProgramPage,
});
