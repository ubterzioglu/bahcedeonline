import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import {
  MENU_CATEGORIES,
  MENU_CATEGORY_META,
  MENU_CATEGORY_VALUES,
  type MenuCategory,
} from "@/lib/menu-categories";
import { resolveMenuCategory } from "@/lib/menu-item-category";
import { pick, pickArray } from "@/lib/i18n/resolveContent";
import { seoLinks, seoLocaleMeta, menuSchema } from "@/lib/seo";

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
      ...seoLocaleMeta("tr"),
    ],
    links: seoLinks("/menu", "tr"),
    scripts: [
      menuSchema(
        "tr",
        MENU_CATEGORIES.map((c) => ({ name: c.labelTr, description: c.blurbTr })),
      ),
    ],
  }),
  component: MenuPage,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];

function getPricePresentation(item: Item) {
  const details =
    item.details && typeof item.details === "object" && !Array.isArray(item.details)
      ? item.details
      : null;
  const priceLabel = typeof details?.priceLabel === "string" ? details.priceLabel : null;

  if (priceLabel) {
    return {
      label: priceLabel,
      multiline: true,
    };
  }

  return {
    label: `₺${Number(item.price).toFixed(0)}`,
    multiline: false,
  };
}

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
      MENU_CATEGORY_VALUES.reduce(
        (acc, category) => {
          acc[category] = items.filter((item) => resolveMenuCategory(item) === category);
          return acc;
        },
        {} as Record<MenuCategory, Item[]>,
      ),
    [items],
  );

  return (
    <div className="px-4 pt-6 sm:px-5 sm:pt-8">
      <div className="mb-6 text-center">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">{t("menu.title")}</h1>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("menu.loading")}</p>
      ) : (
        <Accordion
          type="single"
          collapsible
          value={openCategory}
          onValueChange={setOpenCategory}
          className="space-y-3 sm:space-y-4"
        >
          {MENU_CATEGORIES.map(({ value: category }) => {
            const meta = MENU_CATEGORY_META[category];
            const categoryItems = itemsByCategory[category];
            const label = locale === "en" ? meta.labelEn : meta.labelTr;
            const blurb = locale === "en" ? meta.blurbEn : meta.blurbTr;

            return (
              <AccordionItem
                key={category}
                value={category}
                className="glass-card overflow-hidden rounded-[24px] border border-white/10 bg-card/95 shadow-[0_24px_60px_rgba(0,0,0,0.22)] sm:rounded-[28px]"
              >
                <AccordionTrigger className="group px-0 py-0 hover:no-underline [&>svg]:hidden">
                  <div className="flex min-h-[88px] w-full items-start gap-3 px-3 py-3 text-left sm:items-center sm:gap-0 sm:px-0 sm:py-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold sm:ml-3 sm:h-12 sm:w-12">
                      <meta.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-start justify-between gap-3 py-0.5 pr-1 sm:items-center sm:px-4 sm:py-1">
                      <div className="min-w-0">
                        <h2 className="font-display break-words text-base leading-tight text-foreground sm:text-lg">
                          {label}
                        </h2>
                        <p className="mt-1 max-w-none text-[11px] leading-relaxed text-muted-foreground sm:max-w-[28ch] sm:text-[12px]">
                          {blurb}
                        </p>
                      </div>
                      <ChevronDown className="mt-1 h-4 w-4 shrink-0 text-gold/85 transition-transform duration-200 group-data-[state=open]:rotate-180 sm:mt-0" />
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-3 pb-3 pt-0 sm:px-4 sm:pb-4">
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
                        const price = getPricePresentation(item);
                        return (
                          <div key={item.id} className="px-1 py-3">
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                              <div className="min-w-0 flex-1">
                                <h3 className="font-display break-words text-[15px] leading-tight text-foreground sm:text-base">
                                  {name}
                                </h3>
                                {description && (
                                  <p className="mt-1 break-words text-[12px] leading-relaxed text-muted-foreground">
                                    {description}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-start sm:gap-1.5">
                                <span
                                  className={
                                    price.multiline
                                      ? "max-w-[18ch] text-right font-display text-[11px] leading-tight text-gold sm:max-w-[16ch] sm:text-[12px]"
                                      : "whitespace-nowrap font-display text-[15px] text-gold sm:text-base"
                                  }
                                >
                                  {price.label}
                                </span>
                                {tags.length > 0 && (
                                  <div className="flex flex-wrap justify-end gap-1 sm:max-w-[14ch]">
                                    {tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className="inline-flex max-w-full items-center justify-center rounded-full bg-gold/15 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-gold"
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
