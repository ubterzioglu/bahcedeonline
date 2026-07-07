import { createFileRoute } from "@tanstack/react-router";
import { SongRequest } from "./sarki-oner";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/sarki-oner")({
  head: () => ({
    meta: [
      { title: "Request a Song — Dragoman Bahçe" },
      { name: "description", content: "Send us the song you'd like to hear in the garden." },
      { property: "og:title", content: "Request a Song — Dragoman Bahçe" },
      { property: "og:description", content: "Let the next track come from you." },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/sarki-oner", "en"),
  }),
  component: SongRequest,
});
