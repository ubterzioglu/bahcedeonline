import { createFileRoute } from "@tanstack/react-router";
import { MenuPage } from "./menu";
import { seoLinks, seoLocaleMeta, menuSchema } from "@/lib/seo";
import { MENU_CATEGORIES } from "@/lib/menu-categories";

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
      ...seoLocaleMeta("en"),
    ],
    links: seoLinks("/menu", "en"),
    scripts: [
      menuSchema(
        "en",
        MENU_CATEGORIES.map((c) => ({ name: c.labelEn, description: c.blurbEn })),
      ),
    ],
  }),
  component: MenuPage,
});
