import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/calan")({
  component: AdminNowPlayingPage,
});

function AdminNowPlayingPage() {
  const { dictionary } = useI18n();
  const [form, setForm] = useState({ track_title: "", artist: "", cover_url: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("now_playing").select("*").eq("id", 1).maybeSingle();
      if (data) {
        setForm({
          track_title: data.track_title ?? "",
          artist: data.artist ?? "",
          cover_url: data.cover_url ?? "",
        });
      }
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
      <h1 className="mb-1 font-display text-3xl text-foreground">
        {dictionary.adminNowPlayingPage.heading}
      </h1>
      <p className="mb-5 text-xs text-muted-foreground">
        {dictionary.adminNowPlayingPage.subheading}
      </p>

      <div className="glass-card space-y-4 rounded-2xl p-5">
        <Field
          label={dictionary.adminNowPlayingPage.fields.track}
          value={form.track_title}
          onChange={(value) => setForm({ ...form, track_title: value })}
        />
        <Field
          label={dictionary.adminNowPlayingPage.fields.artist}
          value={form.artist}
          onChange={(value) => setForm({ ...form, artist: value })}
        />
        <Field
          label={dictionary.adminNowPlayingPage.fields.cover}
          value={form.cover_url}
          onChange={(value) => setForm({ ...form, cover_url: value })}
          placeholder="https://..."
        />
        <button
          onClick={save}
          className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold py-3.5 text-sm text-gold-foreground shadow-gold"
        >
          <Save className="h-4 w-4" />
          {dictionary.common.save}
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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-input/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
