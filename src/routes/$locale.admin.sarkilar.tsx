import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { Check, Play, Trash2, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/sarkilar")({
  component: AdminSongs,
});

type Req = Database["public"]["Tables"]["song_requests"]["Row"];
type Status = Database["public"]["Enums"]["request_status"];

function AdminSongs() {
  const { dictionary } = useI18n();
  const { isAdmin } = useAuth();
  const [list, setList] = useState<Req[]>([]);
  const [filter, setFilter] = useState<Status | "all">("pending");

  const load = async () => {
    const { data } = await supabase
      .from("song_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setList(data ?? []);
  };
  useEffect(() => {
    load();
    const ch = supabase
      .channel("song-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "song_requests" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const setStatus = async (id: string, status: Status) => {
    await supabase.from("song_requests").update({ status }).eq("id", id);
  };
  const del = async (id: string) => {
    if (!confirm(dictionary.adminSongsPage.confirmDelete)) return;
    await supabase.from("song_requests").delete().eq("id", id);
  };

  const filtered = filter === "all" ? list : list.filter((r) => r.status === filter);

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-1">
        {dictionary.adminSongsPage.heading}
      </h1>
      <p className="text-xs text-muted-foreground mb-4">{dictionary.adminSongsPage.subheading}</p>

      <div className="-mx-5 px-5 overflow-x-auto scrollbar-none mb-4">
        <div className="flex gap-2 min-w-max pb-2">
          {(["pending", "approved", "played", "rejected", "all"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap border ${filter === s ? "bg-gold text-gold-foreground border-transparent" : "border-border"}`}
            >
              {s === "all" ? dictionary.common.all : dictionary.statuses[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {dictionary.adminSongsPage.empty}
          </div>
        )}
        {filtered.map((r) => (
          <div key={r.id} className="glass-card rounded-2xl p-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg text-foreground truncate">{r.song_title}</h3>
                {r.artist && <p className="text-xs text-muted-foreground">— {r.artist}</p>}
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.guest_name && <p className="text-[11px] text-gold">{r.guest_name}</p>}
            {r.message && <p className="text-xs text-foreground/80 mt-1.5 italic">"{r.message}"</p>}
            <p className="text-[10px] text-muted-foreground mt-2">
              {new Date(r.created_at).toLocaleString()}
            </p>

            <div className="flex items-center gap-1.5 flex-wrap mt-3 pt-3 border-t border-border/40">
              {r.status !== "approved" && (
                <ActionBtn onClick={() => setStatus(r.id, "approved")} icon={Check}>
                  {dictionary.adminSongsPage.approve}
                </ActionBtn>
              )}
              {r.status !== "played" && (
                <ActionBtn onClick={() => setStatus(r.id, "played")} icon={Play}>
                  {dictionary.adminSongsPage.played}
                </ActionBtn>
              )}
              {r.status !== "rejected" && (
                <ActionBtn onClick={() => setStatus(r.id, "rejected")} icon={X}>
                  {dictionary.adminSongsPage.reject}
                </ActionBtn>
              )}
              {isAdmin && (
                <ActionBtn onClick={() => del(r.id)} icon={Trash2} danger>
                  {dictionary.adminSongsPage.delete}
                </ActionBtn>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const { dictionary } = useI18n();
  const map: Record<Status, string> = {
    pending: "bg-gold/20 text-gold",
    approved: "bg-primary/20 text-primary",
    played: "bg-secondary/30 text-secondary-foreground",
    rejected: "bg-destructive/20 text-destructive",
  };
  return (
    <span
      className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap ${map[status]}`}
    >
      {dictionary.statuses[status]}
    </span>
  );
}

function ActionBtn({
  icon: Icon,
  children,
  onClick,
  danger,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border border-border ${danger ? "active:text-destructive" : "active:text-gold"}`}
    >
      <Icon className="h-3 w-3" /> {children}
    </button>
  );
}
