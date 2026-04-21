import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "./menu";

export const Route = createFileRoute("/en/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Dragoman Bahçe" },
      {
        name: "description",
        content: "Beers, cocktails, wines, hot and cold drinks, and bites.",
      },
      { property: "og:title", content: "Menu — Dragoman Bahçe" },
      { property: "og:description", content: "Cocktails, beers, wines and more." },
    ],
  }),
  component: MenuPage,
});
