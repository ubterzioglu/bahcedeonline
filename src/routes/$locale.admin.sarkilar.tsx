import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Play, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/sarkilar")({
  component: AdminSongsPage,
});

type RequestRow = Database["public"]["Tables"]["song_requests"]["Row"];
type Status = Database["public"]["Enums"]["request_status"];

function AdminSongsPage() {
  const { dictionary } = useI18n();
  const { isAdmin } = useAuth();
  const [list, setList] = useState<RequestRow[]>([]);
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
    const channel = supabase
      .channel("song-requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "song_requests" }, load)
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const setStatus = async (id: string, status: Status) => {
    await supabase.from("song_requests").update({ status }).eq("id", id);
  };

  const remove = async (id: string) => {
    if (!confirm(dictionary.adminSongsPage.confirmDelete)) return;
    await supabase.from("song_requests").delete().eq("id", id);
  };

  const filtered = filter === "all" ? list : list.filter((request) => request.status === filter);

  return (
    <div>
      <h1 className="mb-1 font-display text-3xl text-foreground">
        {dictionary.adminSongsPage.heading}
      </h1>
      <p className="mb-4 text-xs text-muted-foreground">{dictionary.adminSongsPage.subheading}</p>

      <div className="-mx-4 mb-4 overflow-x-auto px-4 scrollbar-none sm:-mx-5 sm:px-5">
        <div className="flex min-w-max gap-2 pb-2">
          {(["pending", "approved", "played", "rejected", "all"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap ${
                filter === status
                  ? "border-transparent bg-gold text-gold-foreground"
                  : "border-border"
              }`}
            >
              {status === "all" ? dictionary.common.all : dictionary.statuses[status]}
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

        {filtered.map((request) => (
          <div key={request.id} className="glass-card rounded-2xl p-4">
            <div className="mb-2 flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-display text-lg text-foreground">
                  {request.song_title}
                </h3>
                {request.artist && (
                  <p className="text-xs text-muted-foreground">- {request.artist}</p>
                )}
              </div>
              <StatusBadge status={request.status} />
            </div>
            {request.guest_name && <p className="text-[11px] text-gold">{request.guest_name}</p>}
            {request.message && (
              <p className="mt-1.5 text-xs italic text-foreground/80">"{request.message}"</p>
            )}
            <p className="mt-2 text-[10px] text-muted-foreground">
              {new Date(request.created_at).toLocaleString()}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-3">
              {request.status !== "approved" && (
                <ActionButton onClick={() => setStatus(request.id, "approved")} icon={Check}>
                  {dictionary.adminSongsPage.approve}
                </ActionButton>
              )}
              {request.status !== "played" && (
                <ActionButton onClick={() => setStatus(request.id, "played")} icon={Play}>
                  {dictionary.adminSongsPage.played}
                </ActionButton>
              )}
              {request.status !== "rejected" && (
                <ActionButton onClick={() => setStatus(request.id, "rejected")} icon={X}>
                  {dictionary.adminSongsPage.reject}
                </ActionButton>
              )}
              {isAdmin && (
                <ActionButton onClick={() => remove(request.id)} icon={Trash2} danger>
                  {dictionary.adminSongsPage.delete}
                </ActionButton>
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
      className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-widest whitespace-nowrap ${map[status]}`}
    >
      {dictionary.statuses[status]}
    </span>
  );
}

function ActionButton({
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
      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] ${danger ? "active:text-destructive" : "active:text-gold"}`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </button>
  );
}
