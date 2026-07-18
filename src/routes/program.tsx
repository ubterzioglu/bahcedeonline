import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Music2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/program")({
  head: () => ({
    meta: [
      { title: "Canlı Müzik Programı — Dragoman Bahçe" },
      {
        name: "description",
        content: "Bahçede hangi gün kim çalıyor? Haftalık canlı müzik programı.",
      },
      { property: "og:title", content: "Canlı Müzik Programı — Dragoman Bahçe" },
      { property: "og:description", content: "Bahçede her akşam bir hikâye var." },
      ...seoLocaleMeta("tr"),
    ],
    links: seoLinks("/program", "tr"),
  }),
  component: ProgramPage,
});

type Entry = Database["public"]["Tables"]["weekly_schedule"]["Row"];

const DAY_COLORS = [
  "bg-rose-400",
  "bg-amber-400",
  "bg-sky-400",
  "bg-pink-400",
  "bg-lime-500",
  "bg-cyan-500",
  "bg-orange-400",
];

const DAY_KEYS = [
  "program.day.0",
  "program.day.1",
  "program.day.2",
  "program.day.3",
  "program.day.4",
  "program.day.5",
  "program.day.6",
] as const;

export function ProgramPage() {
  const { t, locale } = useTranslation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("weekly_schedule")
        .select("*")
        .eq("is_active", true)
        .order("day_of_week", { ascending: true });
      setEntries(data ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="px-5 pt-8 pb-16">
      <div className="text-center mb-8">
        <p className="font-script text-2xl text-gradient-gold mb-1">{t("program.script")}</p>
        <h1 className="font-display text-4xl text-foreground">{t("program.title")}</h1>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("menu.loading")}</p>
      ) : entries.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("program.empty")}</p>
      ) : (
        <div className="glass-card rounded-3xl p-4 space-y-2.5">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3">
              <span
                className={`shrink-0 w-28 rounded-full px-4 py-1.5 text-center text-xs font-semibold text-black/80 ${DAY_COLORS[entry.day_of_week]}`}
              >
                {t(DAY_KEYS[entry.day_of_week])}
              </span>
              <p className="font-display text-base text-foreground">
                {locale === "en" && entry.title_en ? entry.title_en : entry.title}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="glass-card rounded-2xl p-5 mt-6 flex gap-3">
        <Music2 className="h-6 w-6 text-gold shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground leading-relaxed">
          <p>{t("song.notice.body")}</p>
        </div>
      </div>
    </div>
  );
}
