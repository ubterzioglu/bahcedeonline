import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Film, ImageIcon, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { adminApi, type SocialArchiveEntry } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/sosyal-medya")({
  component: AdminSocialArchive,
});

type EditState = {
  id?: string;
  title: string;
  subtitle: string;
  comment: string;
  media_path: string;
  media_type: "image" | "video";
  sort_order: number;
};

const empty: EditState = {
  title: "",
  subtitle: "",
  comment: "",
  media_path: "",
  media_type: "image",
  sort_order: 0,
};

function AdminSocialArchive() {
  const [entries, setEntries] = useState<SocialArchiveEntry[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setEntries(await adminApi.listSocialArchive());
  };
  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing({ ...empty });
    setPreviewUrl(null);
  };

  const openEdit = (entry: SocialArchiveEntry) => {
    setEditing({
      id: entry.id,
      title: entry.title,
      subtitle: entry.subtitle ?? "",
      comment: entry.comment ?? "",
      media_path: entry.media_path,
      media_type: entry.media_type as "image" | "video",
      sort_order: entry.sort_order,
    });
    setPreviewUrl(entry.media_url);
  };

  const onUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const { mediaPath, mediaType } = await adminApi.uploadSocialArchiveMedia(file);
      setEditing({ ...editing, media_path: mediaPath, media_type: mediaType });
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Yükleme başarısız.");
    }
    setUploading(false);
  };

  const save = async () => {
    if (!editing || !editing.media_path) return;
    setSaving(true);
    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || null,
      comment: editing.comment || null,
      media_path: editing.media_path,
      media_type: editing.media_type,
      sort_order: editing.sort_order,
    };
    if (editing.id) {
      await adminApi.updateSocialArchiveEntry(editing.id, payload);
    } else {
      await adminApi.createSocialArchiveEntry(payload);
    }
    setSaving(false);
    setEditing(null);
    setPreviewUrl(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Bu içeriği silmek istediğinden emin misin?")) return;
    await adminApi.deleteSocialArchiveEntry(id);
    load();
  };

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="font-display text-3xl text-foreground">Sosyal Medya Deposu</h1>
          <p className="text-xs text-muted-foreground">
            Yalnızca admin ekibi görebilir. Görsel ve video arşivi.
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 bg-gold text-gold-foreground rounded-full px-4 py-2 text-xs shadow-gold shrink-0"
        >
          <Plus className="h-3.5 w-3.5" /> Yeni
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {entries.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Henüz içerik yok.
          </div>
        )}
        {entries.map((entry) => (
          <div key={entry.id} className="glass-card rounded-2xl p-3 flex items-center gap-3">
            {entry.media_url ? (
              entry.media_type === "video" ? (
                <video
                  src={entry.media_url}
                  className="h-14 w-14 rounded-xl object-cover shrink-0 bg-black"
                  muted
                />
              ) : (
                <img
                  src={entry.media_url}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                />
              )
            ) : (
              <div className="h-14 w-14 rounded-xl bg-sea shrink-0 flex items-center justify-center">
                {entry.media_type === "video" ? (
                  <Film className="h-5 w-5 text-foreground/50" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-foreground/50" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-base text-foreground truncate">{entry.title}</h3>
              {entry.subtitle && (
                <p className="text-[11px] text-gold truncate">{entry.subtitle}</p>
              )}
              {entry.comment && (
                <p className="text-[11px] text-muted-foreground truncate italic">
                  "{entry.comment}"
                </p>
              )}
            </div>
            <button
              onClick={() => openEdit(entry)}
              className="p-2 text-foreground/70 active:text-gold"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => del(entry.id)}
              className="p-2 text-foreground/70 active:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
          <div className="max-w-lg mx-auto p-5 pb-32">
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-background/90 backdrop-blur py-3 -mx-5 px-5 border-b border-border/40">
              <h2 className="font-display text-xl">{editing.id ? "Düzenle" : "Yeni İçerik"}</h2>
              <button
                onClick={() => {
                  setEditing(null);
                  setPreviewUrl(null);
                }}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Dosya
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {previewUrl &&
                    (editing.media_type === "video" ? (
                      <video src={previewUrl} className="h-20 w-20 rounded-xl object-cover" muted />
                    ) : (
                      <img
                        src={previewUrl}
                        alt=""
                        className="h-20 w-20 rounded-xl object-cover"
                      />
                    ))}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Yükleniyor…" : "Yükle"}
                    <input
                      type="file"
                      accept="image/*,video/*"
                      hidden
                      onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                    />
                  </label>
                </div>
              </div>

              <Input
                label="Başlık *"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
              />
              <Input
                label="Alt başlık"
                value={editing.subtitle}
                onChange={(v) => setEditing({ ...editing, subtitle: v })}
              />
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Yorum
                </label>
                <textarea
                  value={editing.comment}
                  onChange={(e) => setEditing({ ...editing, comment: e.target.value })}
                  rows={3}
                  className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <Input
                label="Sıra"
                type="number"
                value={String(editing.sort_order)}
                onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })}
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border/40 lg:left-64">
              <div className="max-w-lg mx-auto flex gap-3">
                <button
                  onClick={() => {
                    setEditing(null);
                    setPreviewUrl(null);
                  }}
                  className="flex-1 px-5 py-3 rounded-full border border-border text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={save}
                  disabled={!editing.title || !editing.media_path || saving}
                  className="flex-1 px-5 py-3 rounded-full bg-gold text-gold-foreground text-sm shadow-gold disabled:opacity-50"
                >
                  {saving ? "Kaydediliyor…" : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
