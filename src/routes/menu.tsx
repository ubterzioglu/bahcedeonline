import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Beer, Wine, Coffee, CupSoda, UtensilsCrossed, Grape } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { pick, pickArray } from "@/lib/i18n/resolveContent";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menü — Dragoman Bahçe" },
      {
        name: "description",
        content: "Biralar, kokteyller, şaraplar, sıcak ve soğuk içecekler ile atıştırmalıklar.",
      },
      { property: "og:title", content: "Menü — Dragoman Bahçe" },
      { property: "og:description", content: "Kokteyller, biralar, şaraplar ve daha fazlası." },
    ],
  }),
  component: MenuPage,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Enums"]["menu_category"];

const CATEGORY_META: Record<
  Category,
  {
    labelTr: string;
    labelEn: string;
    icon: LucideIcon;
    blurbTr: string;
    blurbEn: string;
  }
> = {
  kokteyller: {
    labelTr: "Kokteyller",
    labelEn: "Cocktails",
    icon: Wine,
    blurbTr: "İmza karışımlar, uzun gecelere eşlik eden dengeli tatlar.",
    blurbEn: "Signature mixes with balanced flavors for long nights.",
  },
  biralar: {
    labelTr: "Biralar",
    labelEn: "Beers",
    icon: Beer,
    blurbTr: "Serin, ferah ve bahçede yavaş içmek için seçilen şişeler.",
    blurbEn: "Cool, refreshing bottles picked for slow garden drinking.",
  },
  saraplar: {
    labelTr: "Şaraplar",
    labelEn: "Wines",
    icon: Grape,
    blurbTr: "Akşam masasına yakışan, keyfi uzatan zarif seçimler.",
    blurbEn: "Elegant picks that suit the evening table and stretch the pleasure.",
  },
  soguk_icecekler: {
    labelTr: "Soğuk İçecekler",
    labelEn: "Cold Drinks",
    icon: CupSoda,
    blurbTr: "Gün batımına kadar eşlik eden hafif ve canlandırıcı seçenekler.",
    blurbEn: "Light, refreshing options that see you through to sunset.",
  },
  sicak_icecekler: {
    labelTr: "Sıcak İçecekler",
    labelEn: "Hot Drinks",
    icon: Coffee,
    blurbTr: "Kahve ve sıcak dokunuşlar için sade ama özenli bir bölüm.",
    blurbEn: "A simple but careful section for coffee and warm touches.",
  },
  atistirmaliklar: {
    labelTr: "Atıştırmalıklar",
    labelEn: "Bites",
    icon: UtensilsCrossed,
    blurbTr: "Paylaşımlık tabaklar ve içkinin yanına iyi giden küçük eşlikçiler.",
    blurbEn: "Sharing plates and small companions that go well with drinks.",
  },
};

const CATEGORY_ORDER: Category[] = [
  "kokteyller",
  "biralar",
  "saraplar",
  "soguk_icecekler",
  "sicak_icecekler",
  "atistirmaliklar",
];

export function MenuPage() {
  const { t, locale } = useTranslation();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategory, setOpenCategory] = useState<string>("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("menu_items")
        .select("*")
        .eq("is_available", true)
        .order("sort_order", { ascending: true });

      setItems(data ?? []);
      setLoading(false);
    })();
  }, []);

  const itemsByCategory = useMemo(
    () =>
      CATEGORY_ORDER.reduce(
        (acc, category) => {
          acc[category] = items.filter((item) => item.category === category);
          return acc;
        },
        {} as Record<Category, Item[]>,
      ),
    [items],
  );

  return (
    <div className="px-5 pt-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-4xl text-foreground">{t("menu.title")}</h1>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("menu.loading")}</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={openCategory}
          onValueChange={setOpenCategory}
          className="space-y-4"
        >
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category];
            const categoryItems = itemsByCategory[category];
            const label = locale === "en" ? meta.labelEn : meta.labelTr;
            const blurb = locale === "en" ? meta.blurbEn : meta.blurbTr;

            return (
              <AccordionItem
                key={category}
                value={category}
                className="glass-card overflow-hidden rounded-[28px] border border-white/10 bg-card/95 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
              >
                <AccordionTrigger className="group px-0 py-0 hover:no-underline [&>svg]:hidden">
                  <div className="flex h-[84px] w-full items-center text-left">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold ml-3">
                      <meta.icon className="h-6 w-6" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 px-4 py-1">
                      <div className="min-w-0">
                        <h2 className="font-display text-lg leading-tight text-foreground">
                          {label}
                        </h2>
                        <p className="max-w-[28ch] text-[12px] leading-relaxed text-muted-foreground">
                          {blurb}
                        </p>
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 text-gold/85 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 pt-0">
                  {categoryItems.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      {t("menu.empty")}
                    </p>
                  ) : (
                    <div className="space-y-0 divide-y divide-white/8">
                      {categoryItems.map((item) => {
                        const name = pick(item, "name", locale);
                        const description = pick(item, "description", locale);
                        const tags = pickArray(item, "tags", locale);
                        return (
                          <div key={item.id} className="px-1 py-3.5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-display text-base leading-tight text-foreground">
                                  {name}
                                </h3>
                                {description && (
                                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                                    {description}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 flex-col items-end gap-1.5">
                                <span className="whitespace-nowrap font-display text-base text-gold">
                                  ₺{Number(item.price).toFixed(0)}
                                </span>
                                {tags.length > 0 && (
                                  <div className="flex flex-col items-end gap-1">
                                    {tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex w-[14ch] items-center justify-center rounded-full bg-gold/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-gold"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
