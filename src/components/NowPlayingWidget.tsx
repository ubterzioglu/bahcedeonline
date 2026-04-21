import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music2 } from "lucide-react";

export function NowPlayingWidget({
  showSuggestionButton = false,
  variant = "card",
}: {
  showSuggestionButton?: boolean;
  variant?: "card" | "section";
}) {
  const [data, setData] = useState<{
    track_title: string | null;
    artist: string | null;
    cover_url: string | null;
  } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("now_playing")
        .select("track_title, artist, cover_url")
        .eq("id", 1)
        .maybeSingle();
      if (active) setData(data ?? null);
    };
    load();
    const channel = supabase
      .channel("now-playing")
      .on("postgres_changes", { event: "*", schema: "public", table: "now_playing" }, () => load())
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  if (variant === "section") {
    return (
      <div className="space-y-2.5">
        <div className="text-center">
          <p className="text-[11px] font-medium tracking-[0.24em] text-foreground/45 uppercase">
            Şu An Çalıyor
          </p>
        </div>

        <div className="flex items-center gap-3 px-1">
          <div className="relative shrink-0">
            {data?.cover_url ? (
              <img
                src={data.cover_url}
                alt=""
                className="h-16 w-16 rounded-xl object-cover shadow-glow"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-sea shadow-glow">
                <Music2 className="h-7 w-7 text-primary-foreground" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-primary"></span>
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="font-display text-lg truncate text-foreground">
              {data?.track_title || "Sessizliğin müziği"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {data?.artist || "Bir şeyler hazırlanıyor…"}
            </p>
          </div>
        </div>

        {showSuggestionButton ? (
          <Link
            to="/sarki-oner"
            className="inline-flex w-full items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition active:scale-[0.98]"
          >
            Şarkı Öner
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-5 space-y-4 shadow-elegant">
      <div className="flex items-center gap-4">
        <div className="relative">
          {data?.cover_url ? (
            <img
              src={data.cover_url}
              alt=""
              className="h-16 w-16 rounded-xl object-cover shadow-glow"
            />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-sea flex items-center justify-center shadow-glow">
              <Music2 className="h-7 w-7 text-primary-foreground" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.25em] text-gold">Şu an çalıyor</p>
          <p className="font-display text-lg truncate text-foreground">
            {data?.track_title || "Sessizliğin müziği"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {data?.artist || "Bir şeyler hazırlanıyor…"}
          </p>
        </div>
      </div>

      {showSuggestionButton ? (
        <Link
          to="/sarki-oner"
          className="inline-flex w-full items-center justify-center rounded-full border border-gold/35 bg-gold/10 px-4 py-2 text-sm font-medium text-gold transition active:scale-[0.98]"
        >
          Şarkı Öner
        </Link>
      ) : null}
    </div>
  );
}
