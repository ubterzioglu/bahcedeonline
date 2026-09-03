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

const DAY_KEYS = [
  "program.day.0",
  "program.day.1",
  "program.day.2",
  "program.day.3",
  "program.day.4",
  "program.day.5",
  "program.day.6",
] as const;

// The panel is intentionally Monday-first, matching how visitors plan a week
// even though the database stores Sunday as day 0.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

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

  const orderedEntries = [...entries].sort(
    (left, right) => WEEK_ORDER.indexOf(left.day_of_week) - WEEK_ORDER.indexOf(right.day_of_week),
  );

  return (
    <div className="program-page px-4 pt-6 pb-12 sm:px-5">
      <div className="program-heading">
        <Music2 aria-hidden="true" className="program-heading-note" strokeWidth={1.7} />
        <div className="program-heading-copy">
          <p className="program-eyebrow">{t("program.script")}</p>
          <h1>{t("program.title")}</h1>
        </div>
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("menu.loading")}</p>
      ) : entries.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">{t("program.empty")}</p>
      ) : (
        <div className="program-lineup" aria-label={t("program.title")}>
          {orderedEntries.map((entry) => (
            <article key={entry.id} className="program-lineup-item">
              <span className="program-day-badge">{t(DAY_KEYS[entry.day_of_week])}</span>
              <p className="program-act">
                {locale === "en" && entry.title_en ? entry.title_en : entry.title}
              </p>
              {entry.image_url ? (
                <img
                  src={entry.image_url}
                  alt=""
                  className="program-act-image"
                  loading="lazy"
                />
              ) : (
                <div aria-hidden="true" className="program-act-art">
                  <Music2 strokeWidth={1.35} />
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="program-note">
        <Music2 className="h-5 w-5 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <p>{t("song.notice.body")}</p>
        </div>
      </div>
    </div>
  );
}
