import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Music, Radio, UtensilsCrossed } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { locale, dictionary } = useI18n();
  const [stats, setStats] = useState({ menu: 0, pending: 0 });
  const [now, setNow] = useState<{ track_title: string | null; artist: string | null } | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const [{ count: menuCount }, { count: pendingCount }, { data: current }] = await Promise.all([
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase
          .from("song_requests")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("now_playing").select("track_title, artist").eq("id", 1).maybeSingle(),
      ]);

      setStats({ menu: menuCount ?? 0, pending: pendingCount ?? 0 });
      setNow(current);
    })();
  }, []);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl text-foreground">
        {dictionary.adminPage.dashboard}
      </h1>
      <p className="mb-5 text-xs text-muted-foreground">{dictionary.adminPage.summary}</p>

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
          value={now?.track_title ?? "-"}
          small
          className="col-span-2"
        />
      </div>

      <div className="glass-card mt-6 rounded-2xl p-5">
        <h2 className="mb-2 font-display text-lg text-foreground">
          {dictionary.adminPage.quickActions}
        </h2>
        <div className="space-y-2 text-sm">
          <QuickLink
            to="/$locale/admin/menu"
            locale={locale}
            label={dictionary.adminPage.updateMenu}
          />
          <QuickLink
            to="/$locale/admin/sarkilar"
            locale={locale}
            label={dictionary.adminPage.viewSongs}
          />
          <QuickLink
            to="/$locale/admin/calan"
            locale={locale}
            label={dictionary.adminPage.updateNowPlaying}
            last
          />
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  to,
  locale,
  label,
  last,
}: {
  to: string;
  locale: "tr" | "en";
  label: string;
  last?: boolean;
}) {
  return (
    <Link
      to={to}
      params={{ locale }}
      className={`flex items-center justify-between py-2 text-foreground/85 ${last ? "" : "border-b border-border/40"}`}
    >
      {label}
      <span className="text-gold">›</span>
    </Link>
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
  locale: "tr" | "en";
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
      className={`glass-card block rounded-2xl p-4 transition ${highlight ? "ring-1 ring-gold/50" : ""} ${className}`}
    >
      <Icon className="mb-2 h-5 w-5 text-gold" />
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-display text-foreground ${small ? "truncate text-base" : "text-3xl"}`}
      >
        {value}
      </p>
    </Link>
  );
}
