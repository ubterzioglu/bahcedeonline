import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/useAuth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin/menu")({
  component: AdminMenuPage,
});

type Item = Database["public"]["Tables"]["menu_items"]["Row"];
type Category = Database["public"]["Enums"]["menu_category"];

const emptyItem = {
  name: "",
  description: "",
  price: 0,
  category: "kokteyller" as Category,
  image_url: "" as string | null,
  tags: [] as string[],
  details: {} as Record<string, string>,
  is_available: true,
  sort_order: 0,
};

function AdminMenuPage() {
  const { dictionary } = useI18n();
  const { isAdmin } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [editing, setEditing] = useState<(typeof emptyItem & { id?: string }) | null>(null);
  const [filter, setFilter] = useState<Category | "all">("all");
  const [uploading, setUploading] = useState(false);

  const categories: { value: Category; label: string }[] = [
    { value: "kokteyller", label: dictionary.categories.kokteyller },
    { value: "biralar", label: dictionary.categories.biralar },
    { value: "saraplar", label: dictionary.categories.saraplar },
    { value: "soguk_icecekler", label: dictionary.categories.soguk_icecekler },
    { value: "sicak_icecekler", label: dictionary.categories.sicak_icecekler },
    { value: "atistirmaliklar", label: dictionary.categories.atistirmaliklar },
  ];

  const load = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .order("category")
      .order("sort_order");
    setItems(data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = filter === "all" ? items : items.filter((item) => item.category === filter);

  const save = async () => {
    if (!editing) return;

    const payload = {
      name: editing.name,
      description: editing.description || null,
      price: Number(editing.price),
      category: editing.category,
      image_url: editing.image_url || null,
      tags: editing.tags,
      details: editing.details,
      is_available: editing.is_available,
      sort_order: editing.sort_order,
    };

    if (editing.id) {
      await supabase.from("menu_items").update(payload).eq("id", editing.id);
    } else {
      await supabase.from("menu_items").insert(payload);
    }

    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm(dictionary.adminMenuPage.confirmDelete)) return;
    await supabase.from("menu_items").delete().eq("id", id);
    load();
  };

  const onUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from("menu-images")
      .upload(path, file, { upsert: false });

    if (!error) {
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setEditing({ ...editing, image_url: data.publicUrl });
    } else {
      alert(`${dictionary.adminMenuPage.uploadFailed}: ${error.message}`);
    }

    setUploading(false);
  };

  return (
    <div className="pb-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-foreground">
            {dictionary.adminMenuPage.heading}
          </h1>
          <p className="text-xs text-muted-foreground">{dictionary.adminMenuPage.subheading}</p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyItem })}
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-xs text-gold-foreground shadow-gold"
        >
          <Plus className="h-3.5 w-3.5" />
          {dictionary.adminMenuPage.newItem}
        </button>
      </div>

      <div className="-mx-4 mb-4 overflow-x-auto px-4 scrollbar-none sm:-mx-5 sm:px-5">
        <div className="flex min-w-max gap-2 pb-2">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            {dictionary.common.all}
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category.value}
              active={filter === category.value}
              onClick={() => setFilter(category.value)}
            >
              {category.label}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center text-sm text-muted-foreground">
            {dictionary.adminMenuPage.noItems}
          </div>
        )}
        {filtered.map((item) => (
          <div key={item.id} className="glass-card flex items-center gap-3 rounded-2xl p-3">
            {item.image_url ? (
              <img
                src={item.image_url}
                alt=""
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="h-14 w-14 shrink-0 rounded-xl bg-sea" />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-base text-foreground">{item.name}</h3>
                {!item.is_available && (
                  <span className="rounded-full bg-destructive/20 px-1.5 py-0.5 text-[9px] text-destructive">
                    {dictionary.common.inactive}
                  </span>
                )}
              </div>
              <p className="truncate text-[11px] text-muted-foreground">
                {dictionary.categories[item.category]} · TL{Number(item.price).toFixed(0)}
              </p>
            </div>
            <button
              onClick={() =>
                setEditing({
                  ...emptyItem,
                  ...item,
                  description: item.description ?? "",
                  image_url: item.image_url,
                  tags: item.tags ?? [],
                  details: (item.details as Record<string, string>) ?? {},
                })
              }
              className="p-2 text-foreground/70 active:text-gold"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {isAdmin && (
              <button
                onClick={() => remove(item.id)}
                className="p-2 text-foreground/70 active:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-background/95">
          <div className="mx-auto max-w-screen-sm p-4 pb-32 sm:p-5 sm:pb-32">
            <div className="sticky top-0 -mx-4 mb-5 flex items-center justify-between border-b border-border/40 bg-background/90 px-4 py-3 backdrop-blur sm:-mx-5 sm:px-5">
              <h2 className="font-display text-xl">
                {editing.id
                  ? dictionary.adminMenuPage.editProduct
                  : dictionary.adminMenuPage.newProduct}
              </h2>
              <button onClick={() => setEditing(null)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label={dictionary.adminMenuPage.fields.name}
                value={editing.name}
                onChange={(value) => setEditing({ ...editing, name: value })}
              />
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {dictionary.adminMenuPage.fields.category}
                </label>
                <select
                  value={editing.category}
                  onChange={(event) =>
                    setEditing({ ...editing, category: event.target.value as Category })
                  }
                  className="w-full rounded-full border border-border bg-input/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input
                  label={dictionary.adminMenuPage.fields.price}
                  type="number"
                  value={String(editing.price)}
                  onChange={(value) => setEditing({ ...editing, price: Number(value) })}
                />
                <Input
                  label={dictionary.adminMenuPage.fields.order}
                  type="number"
                  value={String(editing.sort_order)}
                  onChange={(value) => setEditing({ ...editing, sort_order: Number(value) })}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {dictionary.adminMenuPage.fields.description}
                </label>
                <textarea
                  value={editing.description}
                  onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                  rows={3}
                  className="w-full rounded-2xl border border-border bg-input/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <Input
                label={dictionary.adminMenuPage.fields.tags}
                value={editing.tags.join(", ")}
                onChange={(value) =>
                  setEditing({
                    ...editing,
                    tags: value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
              />
              <Input
                label={dictionary.adminMenuPage.fields.details}
                value={Object.entries(editing.details)
                  .map(([key, value]) => `${key}:${value}`)
                  .join(", ")}
                onChange={(value) => {
                  const details: Record<string, string> = {};
                  value.split(",").forEach((pair) => {
                    const [key, detail] = pair.split(":").map((part) => part?.trim());
                    if (key && detail) details[key] = detail;
                  });
                  setEditing({ ...editing, details });
                }}
              />

              <div>
                <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {dictionary.adminMenuPage.fields.image}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {editing.image_url && (
                    <img
                      src={editing.image_url}
                      alt=""
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2.5 text-xs">
                    <Upload className="h-3.5 w-3.5" />
                    {uploading
                      ? dictionary.adminMenuPage.uploading
                      : dictionary.adminMenuPage.upload}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) =>
                        event.target.files?.[0] && onUpload(event.target.files[0])
                      }
                    />
                  </label>
                  {editing.image_url && (
                    <button
                      onClick={() => setEditing({ ...editing, image_url: "" })}
                      className="text-xs text-destructive"
                    >
                      {dictionary.common.remove}
                    </button>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_available}
                  onChange={(event) =>
                    setEditing({ ...editing, is_available: event.target.checked })
                  }
                  className="h-4 w-4 accent-[oklch(0.82_0.13_85)]"
                />
                {dictionary.adminMenuPage.fields.active}
              </label>
            </div>

            <div className="fixed bottom-0 left-0 right-0 border-t border-border/40 bg-background/95 p-4 backdrop-blur">
              <div className="mx-auto flex max-w-screen-sm gap-3">
                <button
                  onClick={() => setEditing(null)}
                  className="flex-1 rounded-full border border-border px-5 py-3 text-sm"
                >
                  {dictionary.common.cancel}
                </button>
                <button
                  onClick={save}
                  disabled={!editing.name}
                  className="flex-1 rounded-full bg-gold px-5 py-3 text-sm text-gold-foreground shadow-gold disabled:opacity-50"
                >
                  {dictionary.common.save}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterButton({
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
      className={`rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-wider whitespace-nowrap ${active ? "border-transparent bg-gold text-gold-foreground" : "border-border"}`}
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
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-full border border-border bg-input/60 px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
