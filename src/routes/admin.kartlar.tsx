import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { adminApi, type HomeCard } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/kartlar")({
  component: AdminKartlar,
});

type EditState = {
  id?: string;
  script_label: string;
  script_label_en: string;
  title: string;
  title_en: string;
  body: string;
  body_en: string;
  image_url: string;
  cta_label: string;
  cta_label_en: string;
  link_to: string;
  link_type: "internal" | "external";
  sort_order: number;
  is_published: boolean;
};

const empty: EditState = {
  script_label: "",
  script_label_en: "",
  title: "",
  title_en: "",
  body: "",
  body_en: "",
  image_url: "",
  cta_label: "Keşfet",
  cta_label_en: "Discover",
  link_to: "/",
  link_type: "internal",
  sort_order: 0,
  is_published: true,
};

function AdminKartlar() {
  const [cards, setCards] = useState<HomeCard[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setCards(await adminApi.listHomeCards());
  };
  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      script_label: editing.script_label,
      script_label_en: editing.script_label_en || null,
      title: editing.title,
      title_en: editing.title_en || null,
      body: editing.body,
      body_en: editing.body_en || null,
      image_url: editing.image_url || null,
      cta_label: editing.cta_label,
      cta_label_en: editing.cta_label_en || null,
      link_to: editing.link_to,
      link_type: editing.link_type,
      sort_order: editing.sort_order,
      is_published: editing.is_published,
    };
    if (editing.id) {
      await adminApi.updateHomeCard(editing.id, payload as Partial<HomeCard>);
    } else {
      await adminApi.createHomeCard(payload as Partial<HomeCard>);
    }
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Bu kartı silmek istediğinden emin misin?")) return;
    await adminApi.deleteHomeCard(id);
    load();
  };

  const onUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const { publicUrl } = await adminApi.uploadHomeCardImage(file);
      setEditing({ ...editing, image_url: publicUrl });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Yükleme başarısız.");
    }
    setUploading(false);
  };

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div>
          <h1 className="font-display text-3xl text-foreground">Kartlar</h1>
          <p className="text-xs text-muted-foreground">Ana sayfa kartlarını yönet.</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-1.5 bg-gold text-gold-foreground rounded-full px-4 py-2 text-xs shadow-gold"
        >
          <Plus className="h-3.5 w-3.5" /> Yeni
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cards.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Henüz kart yok.
          </div>
        )}
        {cards.map((c) => (
          <div key={c.id} className="glass-card rounded-2xl p-3 flex items-center gap-3">
            {c.image_url ? (
              <img
                src={c.image_url}
                alt=""
                className="h-14 w-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-sea shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base text-foreground truncate">{c.title}</h3>
                {!c.is_published && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive">
                    Pasif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                #{c.sort_order} · {c.link_type === "internal" ? "iç" : "dış"} → {c.link_to}
              </p>
            </div>
            <button
              onClick={() =>
                setEditing({
                  id: c.id,
                  script_label: c.script_label,
                  script_label_en: c.script_label_en ?? "",
                  title: c.title,
                  title_en: c.title_en ?? "",
                  body: c.body,
                  body_en: c.body_en ?? "",
                  image_url: c.image_url ?? "",
                  cta_label: c.cta_label,
                  cta_label_en: c.cta_label_en ?? "",
                  link_to: c.link_to,
                  link_type: (c.link_type as "internal" | "external") ?? "internal",
                  sort_order: c.sort_order,
                  is_published: c.is_published,
                })
              }
              className="p-2 text-foreground/70 active:text-gold"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => del(c.id)}
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
              <h2 className="font-display text-xl">{editing.id ? "Düzenle" : "Yeni Kart"}</h2>
              <button onClick={() => setEditing(null)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Üst etiket (TR)"
                  value={editing.script_label}
                  onChange={(v) => setEditing({ ...editing, script_label: v })}
                />
                <Input
                  label="Top label (EN)"
                  value={editing.script_label_en}
                  onChange={(v) => setEditing({ ...editing, script_label_en: v })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Başlık (TR) *"
                  value={editing.title}
                  onChange={(v) => setEditing({ ...editing, title: v })}
                />
                <Input
                  label="Title (EN)"
                  value={editing.title_en}
                  onChange={(v) => setEditing({ ...editing, title_en: v })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                    Metin (TR)
                  </label>
                  <textarea
                    value={editing.body}
                    onChange={(e) => setEditing({ ...editing, body: e.target.value })}
                    rows={4}
                    className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                    Body (EN)
                  </label>
                  <textarea
                    value={editing.body_en}
                    onChange={(e) => setEditing({ ...editing, body_en: e.target.value })}
                    rows={4}
                    className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 text-sm focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="CTA (TR)"
                  value={editing.cta_label}
                  onChange={(v) => setEditing({ ...editing, cta_label: v })}
                />
                <Input
                  label="CTA (EN)"
                  value={editing.cta_label_en}
                  onChange={(v) => setEditing({ ...editing, cta_label_en: v })}
                />
              </div>
              <Input
                label="Sıra"
                type="number"
                value={String(editing.sort_order)}
                onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })}
              />
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Bağlantı tipi
                </label>
                <select
                  value={editing.link_type}
                  onChange={(e) =>
                    setEditing({ ...editing, link_type: e.target.value as "internal" | "external" })
                  }
                  className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="internal">İç sayfa (/route)</option>
                  <option value="external">Dış URL (https://...)</option>
                </select>
              </div>
              <Input
                label={editing.link_type === "internal" ? "Rota (ör. /dragomando)" : "URL"}
                value={editing.link_to}
                onChange={(v) => setEditing({ ...editing, link_to: v })}
              />

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Görsel
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {editing.image_url && (
                    <img
                      src={editing.image_url}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  )}
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-border text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading ? "Yükleniyor…" : "Yükle"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
                    />
                  </label>
                  {editing.image_url && (
                    <button
                      onClick={() => setEditing({ ...editing, image_url: "" })}
                      className="text-xs text-destructive"
                    >
                      Kaldır
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5">
                  Veya URL gir:
                </p>
                <input
                  type="text"
                  value={editing.image_url}
                  onChange={(e) => setEditing({ ...editing, image_url: e.target.value })}
                  placeholder="/turtle.jpg veya https://..."
                  className="mt-1 w-full bg-input/60 border border-border rounded-full px-4 py-2.5 text-xs focus:border-gold focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) => setEditing({ ...editing, is_published: e.target.checked })}
                  className="h-4 w-4 accent-[oklch(0.82_0.13_85)]"
                />
                Yayında
              </label>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t border-border/40 lg:left-64">
              <div className="max-w-lg mx-auto flex gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 px-5 py-3 rounded-full border border-border text-sm"
                >
                  İptal
                </button>
                <button
                  onClick={save}
                  disabled={!editing.title}
                  className="flex-1 px-5 py-3 rounded-full bg-gold text-gold-foreground text-sm shadow-gold disabled:opacity-50"
                >
                  Kaydet
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
