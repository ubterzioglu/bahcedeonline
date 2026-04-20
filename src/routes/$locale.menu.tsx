import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/menu")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));

    return {
      meta: [
        { title: dictionary.menuPage.title },
        { name: "description", content: dictionary.menuPage.description },
        { property: "og:title", content: dictionary.menuPage.title },
        { property: "og:description", content: dictionary.menuPage.description },
      ],
    };
  },
  component: MenuPage,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Enums"]["menu_category"];

const CATEGORY_ORDER: Category[] = [
  "kokteyller",
  "biralar",
  "saraplar",
  "soguk_icecekler",
  "sicak_icecekler",
  "atistirmaliklar",
];

function MenuPage() {
  const { dictionary } = useI18n();
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

  const filtered = items.filter((item) => item.category === active);

  return (
    <div className="px-4 pt-8 sm:px-5">
      <div className="mb-6 text-center">
        <p className="mb-1 font-script text-2xl text-gradient-gold">
          {dictionary.menuPage.eyebrow}
        </p>
        <h1 className="font-display text-4xl text-foreground">{dictionary.menuPage.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dictionary.menuPage.subheading}</p>
      </div>

      <div className="-mx-4 mb-6 overflow-x-auto px-4 scrollbar-none sm:-mx-5 sm:px-5">
        <div className="flex min-w-max gap-2 pb-2">
          {CATEGORY_ORDER.map((category) => (
            <button
              key={category}
              onClick={() => setActive(category)}
              className={`rounded-full border px-4 py-2 text-xs tracking-wide whitespace-nowrap transition ${
                active === category
                  ? "border-transparent bg-gold text-gold-foreground shadow-gold"
                  : "border-border/50 bg-glass text-foreground/80"
              }`}
            >
              {dictionary.categories[category]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {dictionary.menuPage.loading}
        </p>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl py-12 text-center">
          <p className="font-display text-xl text-foreground/80">{dictionary.menuPage.empty}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <article key={item.id} className="glass-card overflow-hidden rounded-2xl">
              {item.image_url && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  {item.tags && item.tags.length > 0 && (
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gold/90 px-2 py-1 text-[9px] uppercase tracking-widest text-gold-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="p-5">
                <div className="mb-1.5 flex items-start justify-between gap-3">
                  <h3 className="flex-1 font-display text-xl leading-tight text-foreground">
                    {item.name}
                  </h3>
                  <span className="font-display text-xl whitespace-nowrap text-gold">
                    TL{Number(item.price).toFixed(0)}
                  </span>
                </div>
                {item.description && (
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {!item.image_url && item.tags && item.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gold/15 px-2 py-1 text-[9px] uppercase tracking-widest text-gold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {item.details && Object.keys(item.details as object).length > 0 && (
                  <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-border/40 pt-3 text-xs">
                    {Object.entries(item.details as Record<string, string>).map(([key, value]) => (
                      <div key={key}>
                        <dt className="inline text-[9px] uppercase tracking-wider text-muted-foreground">
                          {key}:{" "}
                        </dt>
                        <dd className="inline text-foreground/90">{value}</dd>
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
