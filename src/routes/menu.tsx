import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import kokteyllerImage from "@/assets/menu-categories/kokteyller.jpg";
import biralarImage from "@/assets/menu-categories/biralar.jpg";
import saraplarImage from "@/assets/menu-categories/saraplar.jpg";
import sogukIceceklerImage from "@/assets/menu-categories/soguk-icecekler.jpg";
import sicakIceceklerImage from "@/assets/menu-categories/sicak-icecekler.jpg";
import atistirmaliklarImage from "@/assets/menu-categories/atistirmaliklar.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

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
    label: string;
    image: string;
    blurb: string;
  }
> = {
  kokteyller: {
    label: "Kokteyller",
    image: kokteyllerImage,
    blurb: "İmza karışımlar, uzun gecelere eşlik eden dengeli tatlar.",
  },
  biralar: {
    label: "Biralar",
    image: biralarImage,
    blurb: "Serin, ferah ve bahçede yavaş içmek için seçilen şişeler.",
  },
  saraplar: {
    label: "Şaraplar",
    image: saraplarImage,
    blurb: "Akşam masasına yakışan, keyfi uzatan zarif seçimler.",
  },
  soguk_icecekler: {
    label: "Soğuk İçecekler",
    image: sogukIceceklerImage,
    blurb: "Gün batımına kadar eşlik eden hafif ve canlandırıcı seçenekler.",
  },
  sicak_icecekler: {
    label: "Sıcak İçecekler",
    image: sicakIceceklerImage,
    blurb: "Kahve ve sıcak dokunuşlar için sade ama özenli bir bölüm.",
  },
  atistirmaliklar: {
    label: "Atıştırmalıklar",
    image: atistirmaliklarImage,
    blurb: "Paylaşımlık tabaklar ve içkinin yanına iyi giden küçük eşlikçiler.",
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

function MenuPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

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
        <h1 className="font-display text-4xl text-foreground">Menü</h1>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">Yükleniyor…</p>
      ) : (
        <Accordion type="single" collapsible defaultValue="kokteyller" className="space-y-4">
          {CATEGORY_ORDER.map((category) => {
            const meta = CATEGORY_META[category];
            const categoryItems = itemsByCategory[category];

            return (
              <AccordionItem
                key={category}
                value={category}
                className="glass-card overflow-hidden rounded-[28px] border border-white/10 bg-card/95 shadow-[0_24px_60px_rgba(0,0,0,0.22)]"
              >
                <AccordionTrigger className="group px-0 py-0 hover:no-underline [&>svg]:hidden">
                  <div className="flex min-h-[96px] w-full items-stretch text-left">
                    <div className="relative w-[30%] min-w-[86px] overflow-hidden">
                      <img
                        src={meta.image}
                        alt={meta.label}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/35" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-2 px-4 py-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.22em] text-gold/90">
                              Kategori
                            </span>
                            <h2 className="mt-2 font-display text-[1.45rem] leading-[0.95] text-foreground">
                              {meta.label}
                            </h2>
                          </div>
                          <span className="mt-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground/65">
                            {categoryItems.length} ürün
                          </span>
                        </div>
                        <p className="max-w-[24ch] text-[12px] leading-relaxed text-muted-foreground">
                          {meta.blurb}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.22em] text-foreground/55">
                        <span>Listeyi aç</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gold/85 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 pb-4 pt-0">
                  {categoryItems.length === 0 ? (
                    <div className="rounded-[24px] border border-dashed border-white/10 bg-black/10 px-5 py-6 text-center text-sm text-muted-foreground">
                      Bu kategoride henüz ürün yok.
                    </div>
                  ) : (
                    <div className="space-y-3 rounded-[24px] border border-white/8 bg-black/10 p-3">
                      {categoryItems.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-[22px] border border-white/8 bg-card/80 px-4 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.14)]"
                        >
                          <div className="mb-2 flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="font-display text-xl leading-tight text-foreground">
                                {item.name}
                              </h3>
                              {item.description && (
                                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                            </div>
                            <span className="whitespace-nowrap font-display text-xl text-gold">
                              ₺{Number(item.price).toFixed(0)}
                            </span>
                          </div>

                          {item.tags && item.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {item.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-gold/15 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-gold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {item.details && Object.keys(item.details as object).length > 0 && (
                            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border/40 pt-3 text-xs">
                              {Object.entries(item.details as Record<string, string>).map(
                                ([key, value]) => (
                                  <div key={key}>
                                    <dt className="inline text-[9px] uppercase tracking-wider text-muted-foreground">
                                      {key}:
                                    </dt>{" "}
                                    <dd className="inline text-foreground/90">{value}</dd>
                                  </div>
                                ),
                              )}
                            </dl>
                          )}
                        </article>
                      ))}
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
