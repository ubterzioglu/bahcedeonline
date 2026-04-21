import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menü — Dragoman Bahçe" },
      { name: "description", content: "Biralar, kokteyller, şaraplar, sıcak ve soğuk içecekler ile atıştırmalıklar." },
      { property: "og:title", content: "Menü — Dragoman Bahçe" },
      { property: "og:description", content: "Kokteyller, biralar, şaraplar ve daha fazlası." },
    ],
  }),
  component: MenuPage,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Enums"]["menu_category"];

const CATEGORY_LABELS: Record<Category, string> = {
  kokteyller: "Kokteyller",
  biralar: "Biralar",
  saraplar: "Şaraplar",
  soguk_icecekler: "Soğuk İçecekler",
  sicak_icecekler: "Sıcak İçecekler",
  atistirmaliklar: "Atıştırmalıklar",
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
  const [active, setActive] = useState<Category>("kokteyller");
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

  const filtered = items.filter((i) => i.category === active);

  return (
    <div className="px-5 pt-8">
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl text-foreground">Menü</h1>
      </div>

      {/* Category scrollable tabs */}
      <div className="-mx-5 px-5 overflow-x-auto scrollbar-none mb-6">
        <div className="flex gap-2 min-w-max pb-2">
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap tracking-wide transition border ${
                active === cat
                  ? "bg-gold text-gold-foreground border-transparent shadow-gold"
                  : "bg-glass border-border/50 text-foreground/80"
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-12 text-sm">Yükleniyor…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 glass-card rounded-2xl">
          <p className="font-display text-xl text-foreground/80">Bu kategoride henüz ürün yok.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="glass-card rounded-2xl overflow-hidden">
              {item.image_url && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={item.image_url} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => (
                        <span key={t} className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full bg-gold/90 text-gold-foreground">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="font-display text-xl text-foreground leading-tight flex-1">{item.name}</h3>
                  <span className="text-gold font-display text-xl whitespace-nowrap">
                    ₺{Number(item.price).toFixed(0)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{item.description}</p>
                )}
                {!item.image_url && item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[9px] uppercase tracking-widest px-2 py-1 rounded-full bg-gold/15 text-gold">{t}</span>
                    ))}
                  </div>
                )}
                {item.details && Object.keys(item.details as object).length > 0 && (
                  <dl className="mt-3 pt-3 border-t border-border/40 flex flex-wrap gap-x-5 gap-y-1.5 text-xs">
                    {Object.entries(item.details as Record<string, string>).map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-muted-foreground uppercase tracking-wider text-[9px] inline">{k}: </dt>
                        <dd className="text-foreground/90 inline">{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
