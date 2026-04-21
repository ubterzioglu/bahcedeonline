import { createFileRoute } from "@tanstack/react-router";
import { KasguidePage } from "./kasguide";

export const Route = createFileRoute("/en/kasguide")({
  head: () => ({
    meta: [
      { title: "Kasguide.de — Kaş Guide | Dragoman Bahçe" },
      {
        name: "description",
        content: "The most comprehensive guide to Kaş. Soon on Kasguide.de.",
      },
    ],
  }),
  component: KasguidePage,
});
