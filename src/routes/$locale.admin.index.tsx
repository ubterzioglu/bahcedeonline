import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UtensilsCrossed, Music, Radio } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const { locale, dictionary } = useI18n();
  const [stats, setStats] = useState({ menu: 0, pending: 0 });
  const [now, setNow] = useState<{ track_title: string | null; artist: string | null } | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const [{ count: menuCount }, { count: pendingCount }, { data: np }] = await Promise.all([
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase
          .from("song_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("now_playing").select("track_title, artist").eq("id", 1).maybeSingle(),
      ]);
      setStats({ menu: menuCount ?? 0, pending: pendingCount ?? 0 });
      setNow(np);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-1">
        {dictionary.adminPage.dashboard}
      </h1>
      <p className="text-xs text-muted-foreground mb-5">{dictionary.adminPage.summary}</p>

      <div className="grid grid-cols-2 gap-3">
        <Card
          to="/$locale/admin/menu"
          locale={locale}
          icon={UtensilsCrossed}
          label={dictionary.adminPage.menu}
          value={stats.menu}
        />
        <Card
          to="/$locale/admin/sarkilar"
          locale={locale}
          icon={Music}
          label={dictionary.adminPage.songs}
          value={stats.pending}
          highlight={stats.pending > 0}
        />
        <Card
          to="/$locale/admin/calan"
          locale={locale}
          icon={Radio}
          label={dictionary.adminPage.nowPlaying}
          value={now?.track_title ?? "—"}
          small
          className="col-span-2"
        />
      </div>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <h2 className="font-display text-lg mb-2 text-foreground">
          {dictionary.adminPage.quickActions}
        </h2>
        <div className="space-y-2 text-sm">
          <Link
            to="/$locale/admin/menu"
            params={{ locale }}
            className="flex items-center justify-between py-2 border-b border-border/40 text-foreground/85"
          >
            {dictionary.adminPage.updateMenu} <span className="text-gold">›</span>
          </Link>
          <Link
            to="/$locale/admin/sarkilar"
            params={{ locale }}
            className="flex items-center justify-between py-2 border-b border-border/40 text-foreground/85"
          >
            {dictionary.adminPage.viewSongs} <span className="text-gold">›</span>
          </Link>
          <Link
            to="/$locale/admin/calan"
            params={{ locale }}
            className="flex items-center justify-between py-2 text-foreground/85"
          >
            {dictionary.adminPage.updateNowPlaying} <span className="text-gold">›</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function Card({
  to,
  locale,
  icon: Icon,
  label,
  value,
  highlight,
  small,
  className = "",
}: {
  to: string;
  locale: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  highlight?: boolean;
  small?: boolean;
  className?: string;
}) {
  return (
    <Link
      to={to}
      params={{ locale }}
      className={`glass-card rounded-2xl p-4 transition block ${highlight ? "ring-1 ring-gold/50" : ""} ${className}`}
    >
      <Icon className="h-5 w-5 text-gold mb-2" />
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-display text-foreground ${small ? "text-base truncate" : "text-3xl"}`}
      >
        {value}
      </p>
    </Link>
  );
}
