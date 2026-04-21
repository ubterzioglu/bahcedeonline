import { createFileRoute } from "@tanstack/react-router";
import { SongRequest } from "./sarki-oner";

export const Route = createFileRoute("/en/sarki-oner")({
  head: () => ({
    meta: [
      { title: "Request a Song — Dragoman Bahçe" },
      { name: "description", content: "Send us the song you'd like to hear in the garden." },
      { property: "og:title", content: "Request a Song — Dragoman Bahçe" },
      { property: "og:description", content: "Let the next track come from you." },
    ],
  }),
  component: SongRequest,
});
