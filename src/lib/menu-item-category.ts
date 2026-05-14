import type { Database } from "@/integrations/supabase/types";
import { isMenuCategory, type MenuCategory } from "@/lib/menu-categories";

type MenuItem = Database["public"]["Tables"]["menu_items"]["Row"];

export function resolveMenuCategory(item: MenuItem): MenuCategory {
  if (isMenuCategory(item.category)) return item.category;

  const details =
    item.details && typeof item.details === "object" && !Array.isArray(item.details)
      ? item.details
      : null;
  const section = typeof details?.section === "string" ? details.section : null;
  if (section && isMenuCategory(section)) return section;

  switch (item.category) {
    case "biralar":
      return "beers";
    case "soguk_icecekler":
      return "non_alcoholics";
    case "sicak_icecekler":
      return "coffee";
    case "saraplar":
      return "wines";
    case "kokteyller":
      return "cocktails";
    case "atistirmaliklar":
      return "bar_bites";
    default:
      return "cocktails";
  }
}
