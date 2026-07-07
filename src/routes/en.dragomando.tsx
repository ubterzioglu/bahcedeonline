import { createFileRoute } from "@tanstack/react-router";
import { DragomandoPage } from "./dragomando";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/en/dragomando")({
  head: () => ({
    meta: [
      { title: "Dragoman Diving & Outdoor — Kaş" },
      {
        name: "description",
        content: "Diving, kayaking, trekking and outdoor experiences in Kaş.",
      },
      { property: "og:title", content: "Dragoman Diving & Outdoor" },
      { property: "og:description", content: "Diving and outdoor experiences in Kaş." },
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/dragomando", "en"),
  }),
  component: DragomandoPage,
});
