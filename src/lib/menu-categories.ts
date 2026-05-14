import type { LucideIcon } from "lucide-react";
import {
  Beer,
  Coffee,
  CupSoda,
  Martini,
  Sparkles,
  UtensilsCrossed,
  Wine,
  Grape,
  GlassWater,
  Flame,
  Drumstick,
} from "lucide-react";

export type MenuCategory =
  | "beers"
  | "non_alcoholics"
  | "coffee"
  | "wines"
  | "signatures"
  | "cocktails"
  | "spritzes"
  | "spirits"
  | "shots"
  | "bar_bites"
  | "house_specials";

export type MenuCategoryMeta = {
  value: MenuCategory;
  labelTr: string;
  labelEn: string;
  blurbTr: string;
  blurbEn: string;
  icon: LucideIcon;
};

export const MENU_CATEGORIES: MenuCategoryMeta[] = [
  {
    value: "beers",
    labelTr: "Biralar",
    labelEn: "Beers",
    blurbTr: "Fıçı ve şişe seçenekleriyle serin, sade ve bahçeye yakışan bira bölümü.",
    blurbEn: "Draft and bottled beer picks made for a slow, easy garden pour.",
    icon: Beer,
  },
  {
    value: "non_alcoholics",
    labelTr: "Alkolsüzler",
    labelEn: "Non Alcoholics",
    blurbTr: "Gazlı içecekler, taze meyve suları ve ev yapımı ferahlatıcılar.",
    blurbEn: "Sodas, juices, and homemade refreshers for lighter moments.",
    icon: CupSoda,
  },
  {
    value: "coffee",
    labelTr: "Kahve",
    labelEn: "Coffee",
    blurbTr: "Günün ritmini düşüren espresso bazlı kahveler ve klasik sıcak fincanlar.",
    blurbEn: "Espresso-based pours and warm classics for a slower tempo.",
    icon: Coffee,
  },
  {
    value: "wines",
    labelTr: "Şaraplar",
    labelEn: "Wines",
    blurbTr: "Beyaz, roze ve kırmızı seçeneklerle akşamı uzatan dengeli şaraplar.",
    blurbEn: "White, rose, and red bottles that stretch the evening gracefully.",
    icon: Grape,
  },
  {
    value: "signatures",
    labelTr: "İmza Kokteyller",
    labelEn: "Signatures",
    blurbTr: "Mekânın karakterini taşıyan özel reçeteler ve özgün karışımlar.",
    blurbEn: "House signatures with a more distinct point of view.",
    icon: Sparkles,
  },
  {
    value: "cocktails",
    labelTr: "Kokteyller",
    labelEn: "Cocktails",
    blurbTr: "Klasiklerden favorilere, dengeli ve güçlü kokteyl seçkisi.",
    blurbEn: "A classic-led cocktail list with familiar favorites and strong staples.",
    icon: Martini,
  },
  {
    value: "spritzes",
    labelTr: "Spritzler",
    labelEn: "Spritzes",
    blurbTr: "Daha hafif, daha köpüklü ve gün batımına yakın bardaklar.",
    blurbEn: "Lighter, brighter spritzes built for sunset hours.",
    icon: Wine,
  },
  {
    value: "spirits",
    labelTr: "Spiritler",
    labelEn: "Spirits",
    blurbTr: "Gin, votka, rom, tekila ve viski gibi sek ya da mixer ile servis edilen içkiler.",
    blurbEn: "Gin, vodka, rum, tequila, and whisky served neat or with a mixer.",
    icon: GlassWater,
  },
  {
    value: "shots",
    labelTr: "Shotlar",
    labelEn: "Shots",
    blurbTr: "Kısa, hızlı ve yüksek tempolu seçimler.",
    blurbEn: "Short, punchy pours for a higher-energy round.",
    icon: Flame,
  },
  {
    value: "bar_bites",
    labelTr: "Bar Atıştırmalıkları",
    labelEn: "Bar Bites",
    blurbTr: "İçeceğin yanına iyi giden, paylaşması kolay mutfak ürünleri.",
    blurbEn: "Shareable kitchen bites that sit well next to a drink.",
    icon: UtensilsCrossed,
  },
  {
    value: "house_specials",
    labelTr: "Ev Spesiyalleri",
    labelEn: "House Specials",
    blurbTr: "Daha doyurucu, ana ürüne yaklaşan güçlü tabaklar.",
    blurbEn: "More substantial house plates for guests who want something bigger.",
    icon: Drumstick,
  },
];

export const MENU_CATEGORY_VALUES = MENU_CATEGORIES.map((category) => category.value);
const MENU_CATEGORY_SET = new Set<string>(MENU_CATEGORY_VALUES);

export const MENU_CATEGORY_META = Object.fromEntries(
  MENU_CATEGORIES.map((category) => [category.value, category]),
) as Record<MenuCategory, MenuCategoryMeta>;

export function isMenuCategory(value: string): value is MenuCategory {
  return MENU_CATEGORY_SET.has(value);
}
