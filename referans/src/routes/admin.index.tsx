import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UtensilsCrossed, Music, Radio } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const [stats, setStats] = useState({ menu: 0, pending: 0 });
  const [now, setNow] = useState<{ track_title: string | null; artist: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      const [{ count: menuCount }, { count: pendingCount }, { data: np }] = await Promise.all([
        supabase.from("menu_items").select("*", { count: "exact", head: true }),
        supabase.from("song_requests").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("now_playing").select("track_title, artist").eq("id", 1).maybeSingle(),
      ]);
      setStats({ menu: menuCount ?? 0, pending: pendingCount ?? 0 });
      setNow(np);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-1">Pano</h1>
      <p className="text-xs text-muted-foreground mb-5">Bugünün özeti.</p>

      <div className="grid grid-cols-2 gap-3">
        <Card to="/admin/menu" icon={UtensilsCrossed} label="Menü" value={stats.menu} />
        <Card to="/admin/sarkilar" icon={Music} label="Bekleyen" value={stats.pending} highlight={stats.pending > 0} />
        <Card to="/admin/calan" icon={Radio} label="Şu an çalan" value={now?.track_title ?? "—"} small className="col-span-2" />
      </div>

      <div className="mt-6 glass-card rounded-2xl p-5">
        <h2 className="font-display text-lg mb-2 text-foreground">Hızlı işlemler</h2>
        <div className="space-y-2 text-sm">
          <Link to="/admin/menu" className="flex items-center justify-between py-2 border-b border-border/40 text-foreground/85">Menü ekle/düzenle <span className="text-gold">›</span></Link>
          <Link to="/admin/sarkilar" className="flex items-center justify-between py-2 border-b border-border/40 text-foreground/85">Şarkı isteklerini gör <span className="text-gold">›</span></Link>
          <Link to="/admin/calan" className="flex items-center justify-between py-2 text-foreground/85">Şu an çalanı güncelle <span className="text-gold">›</span></Link>
        </div>
      </div>
    </div>
  );
}

function Card({
  to, icon: Icon, label, value, highlight, small, className = "",
}: { to: string; icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; highlight?: boolean; small?: boolean; className?: string }) {
  return (
    <Link to={to} className={`glass-card rounded-2xl p-4 transition block ${highlight ? "ring-1 ring-gold/50" : ""} ${className}`}>
      <Icon className="h-5 w-5 text-gold mb-2" />
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-foreground ${small ? "text-base truncate" : "text-3xl"}`}>{value}</p>
    </Link>
  );
}
