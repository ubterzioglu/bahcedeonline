import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Database } from "@/integrations/supabase/types";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { adminApi, type MenuItem } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenu,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Enums"]["menu_category"];

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "kokteyller", label: "Kokteyller" },
  { value: "biralar", label: "Biralar" },
  { value: "saraplar", label: "Şaraplar" },
  { value: "soguk_icecekler", label: "Soğuk" },
  { value: "sicak_icecekler", label: "Sıcak" },
  { value: "atistirmaliklar", label: "Atıştırmalık" },
];

const empty = {
  name: "",
  description: "",
  price: 0,
  category: "kokteyller" as Category,
  image_url: "" as string | null,
  tags: [] as string[],
  is_available: true,
  sort_order: 0,
};

function AdminMenu() {
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<(typeof empty & { id?: string }) | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setItems(await adminApi.listMenu());
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = filter === "all" ? items : items.filter((i) => i.category === filter);

  const save = async () => {
    if (!editing) return;
    const payload = {
      name: editing.name,
      description: editing.description || null,
      price: Number(editing.price),
      category: editing.category,
      image_url: editing.image_url || null,
      tags: editing.tags,
      is_available: editing.is_available,
      sort_order: editing.sort_order,
    };
    if (editing.id) {
      await adminApi.updateMenuItem(editing.id, payload as Partial<MenuItem>);
    } else {
      await adminApi.createMenuItem(payload as Partial<MenuItem>);
    }
    setEditing(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinden emin misin?")) return;
    await adminApi.deleteMenuItem(id);
    load();
  };

  const onUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const { publicUrl } = await adminApi.uploadMenuImage(file);
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
          <h1 className="font-display text-3xl text-foreground">Menü</h1>
          <p className="text-xs text-muted-foreground">Ürünleri yönet.</p>
        </div>
        <button
          onClick={() => setEditing({ ...empty })}
          className="inline-flex items-center gap-1.5 bg-gold text-gold-foreground rounded-full px-4 py-2 text-xs shadow-gold"
        >
          <Plus className="h-3.5 w-3.5" /> Yeni
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-none mb-4">
        <div className="flex gap-2 pb-2">
          <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
            Tümü
          </FilterBtn>
          {CATEGORIES.map((c) => (
            <FilterBtn key={c.value} active={filter === c.value} onClick={() => setFilter(c.value)}>
              {c.label}
            </FilterBtn>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.length === 0 && (
          <div className="col-span-full glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            Henüz ürün yok.
          </div>
        )}
        {filtered.map((it) => (
          <div key={it.id} className="glass-card rounded-2xl p-3 flex items-center gap-3">
            {it.image_url ? (
              <img
                src={it.image_url}
                alt=""
                className="h-14 w-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-xl bg-sea shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base text-foreground truncate">{it.name}</h3>
                {!it.is_available && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive">
                    Pasif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                {CATEGORIES.find((c) => c.value === it.category)?.label} · ₺
                {Number(it.price).toFixed(0)}
              </p>
            </div>
            <button
              onClick={() =>
                setEditing({
                  ...empty,
                  ...it,
                  description: it.description ?? "",
                  image_url: it.image_url,
                  tags: it.tags ?? [],
                })
              }
              className="p-2 text-foreground/70 active:text-gold"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => del(it.id)}
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
              <h2 className="font-display text-xl">{editing.id ? "Düzenle" : "Yeni Ürün"}</h2>
              <button onClick={() => setEditing(null)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Ad *"
                value={editing.name}
                onChange={(v) => setEditing({ ...editing, name: v })}
              />
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Kategori
                </label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as Category })}
                  className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Fiyat (₺)"
                  type="number"
                  value={String(editing.price)}
                  onChange={(v) => setEditing({ ...editing, price: Number(v) })}
                />
                <Input
                  label="Sıra"
                  type="number"
                  value={String(editing.sort_order)}
                  onChange={(v) => setEditing({ ...editing, sort_order: Number(v) })}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                  Açıklama
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={3}
                  className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <Input
                label="Etiketler (virgülle)"
                value={editing.tags.join(", ")}
                onChange={(v) =>
                  setEditing({
                    ...editing,
                    tags: v
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
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
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_available}
                  onChange={(e) => setEditing({ ...editing, is_available: e.target.checked })}
                  className="h-4 w-4 accent-[oklch(0.82_0.13_85)]"
                />
                Menüde aktif
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
                  disabled={!editing.name}
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

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap border ${active ? "bg-gold text-gold-foreground border-transparent" : "border-border"}`}
    >
      {children}
    </button>
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
