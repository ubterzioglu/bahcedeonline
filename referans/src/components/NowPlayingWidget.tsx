import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music2 } from "lucide-react";

export function NowPlayingWidget() {
  const [data, setData] = useState<{ track_title: string | null; artist: string | null; cover_url: string | null } | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase.from("now_playing").select("track_title, artist, cover_url").eq("id", 1).maybeSingle();
      if (active) setData(data ?? null);
    };
    load();
    const channel = supabase
      .channel("now-playing")
      .on("postgres_changes", { event: "*", schema: "public", table: "now_playing" }, () => load())
      .subscribe();
    return () => { active = false; supabase.removeChannel(channel); };
  }, []);

  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
      <div className="relative">
        {data?.cover_url ? (
          <img src={data.cover_url} alt="" className="h-16 w-16 rounded-xl object-cover shadow-glow" />
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
        <p className="font-display text-lg truncate text-foreground">{data?.track_title || "Sessizliğin müziği"}</p>
        <p className="text-xs text-muted-foreground truncate">{data?.artist || "Bir şeyler hazırlanıyor…"}</p>
      </div>
    </div>
  );
}
