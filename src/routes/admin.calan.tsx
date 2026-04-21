import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/calan")({
  component: AdminNowPlaying,
});

function AdminNowPlaying() {
  const [form, setForm] = useState({ track_title: "", artist: "", cover_url: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await adminApi.getNowPlaying();
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
    await adminApi.updateNowPlaying({
      track_title: form.track_title || null,
      artist: form.artist || null,
      cover_url: form.cover_url || null,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clear = async () => {
    setForm({ track_title: "", artist: "", cover_url: "" });
    await adminApi.updateNowPlaying({ track_title: null, artist: null, cover_url: null });
  };

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-3xl text-foreground mb-1">Şu An Çalan</h1>
      <p className="text-xs text-muted-foreground mb-5">Misafirlere görünen widget'ı güncelle.</p>

      <div className="glass-card rounded-2xl p-5 space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            Şarkı
          </label>
          <input
            value={form.track_title}
            onChange={(e) => setForm({ ...form, track_title: e.target.value })}
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            Sanatçı
          </label>
          <input
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
            Kapak URL (opsiyonel)
          </label>
          <input
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            placeholder="https://…"
            className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={save}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded-full py-3.5 text-sm shadow-gold"
          >
            <Save className="h-4 w-4" /> Kaydet
          </button>
          <button onClick={clear} className="px-5 rounded-full border border-border text-xs">
            Temizle
          </button>
        </div>
        {saved && <p className="text-center text-sm text-primary">Kaydedildi ✓</p>}
      </div>
    </div>
  );
}
