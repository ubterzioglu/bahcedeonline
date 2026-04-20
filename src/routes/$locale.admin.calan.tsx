import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/calan")({
  component: AdminNowPlaying,
});

function AdminNowPlaying() {
  const { dictionary } = useI18n();
  const [form, setForm] = useState({ track_title: "", artist: "", cover_url: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("now_playing").select("*").eq("id", 1).maybeSingle();
      if (data)
        setForm({
          track_title: data.track_title ?? "",
          artist: data.artist ?? "",
          cover_url: data.cover_url ?? "",
        });
    })();
  }, []);

  const save = async () => {
    setSaved(false);
    await supabase
      .from("now_playing")
      .update({
        track_title: form.track_title || null,
        artist: form.artist || null,
        cover_url: form.cover_url || null,
      })
      .eq("id", 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clear = async () => {
    setForm({ track_title: "", artist: "", cover_url: "" });
    await supabase
      .from("now_playing")
      .update({ track_title: null, artist: null, cover_url: null })
      .eq("id", 1);
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-1">
        {dictionary.adminNowPlayingPage.heading}
      </h1>
      <p className="text-xs text-muted-foreground mb-5">
        {dictionary.adminNowPlayingPage.subheading}
      </p>

      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            {dictionary.adminNowPlayingPage.fields.track}
          </label>
          <input
            value={form.track_title}
            onChange={(e) => setForm({ ...form, track_title: e.target.value })}
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            {dictionary.adminNowPlayingPage.fields.artist}
          </label>
          <input
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            {dictionary.adminNowPlayingPage.fields.cover}
          </label>
          <input
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            placeholder="https://…"
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <button
          onClick={save}
          className="w-full inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded-full py-3.5 text-sm shadow-gold"
        >
          <Save className="h-4 w-4" /> {dictionary.common.save}
        </button>
        <button onClick={clear} className="w-full text-xs text-muted-foreground">
          {dictionary.common.clear}
        </button>
        {saved && (
          <p className="text-center text-sm text-primary">
            {dictionary.adminNowPlayingPage.saved} ✓
          </p>
        )}
      </div>
    </div>
  );
}
