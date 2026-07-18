import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Save, Upload, X } from "lucide-react";
import { adminApi, type WeeklyScheduleEntry } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/program")({
  component: AdminProgram,
});

const DAY_LABELS = [
  "Pazar",
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
];

type EditState = {
  id?: string;
  day_of_week: number;
  title: string;
  title_en: string;
  image_url: string;
  is_active: boolean;
};

function AdminProgram() {
  const [entries, setEntries] = useState<WeeklyScheduleEntry[]>([]);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setEntries(await adminApi.listWeeklySchedule());
  };
  useEffect(() => {
    load();
  }, []);

  const byDay = new Map(entries.map((e) => [e.day_of_week, e]));

  const openEdit = (day: number) => {
    const existing = byDay.get(day);
    setEditing({
      id: existing?.id,
      day_of_week: day,
      title: existing?.title ?? "",
      title_en: existing?.title_en ?? "",
      image_url: existing?.image_url ?? "",
      is_active: existing?.is_active ?? true,
    });
  };

  const onUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    try {
      const { publicUrl } = await adminApi.uploadWeeklyScheduleImage(file);
      setEditing({ ...editing, image_url: publicUrl });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Yükleme başarısız.");
    }
    setUploading(false);
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      day_of_week: editing.day_of_week,
      title: editing.title,
      title_en: editing.title_en || null,
      image_url: editing.image_url || null,
      is_active: editing.is_active,
    };
    if (editing.id) {
      await adminApi.updateWeeklyScheduleEntry(editing.id, payload);
    } else {
      await adminApi.createWeeklyScheduleEntry(payload);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const clear = async (day: number) => {
    const existing = byDay.get(day);
    if (!existing) return;
    if (!confirm("Bu günün programını silmek istediğinden emin misin?")) return;
    await adminApi.deleteWeeklyScheduleEntry(existing.id);
    load();
  };

  return (
    <div className="pb-4">
      <div className="mb-4">
        <h1 className="font-display text-3xl text-foreground">Haftalık Program</h1>
        <p className="text-xs text-muted-foreground">Canlı Müzik Programı — gün bazlı içerik.</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {DAY_LABELS.map((label, day) => {
          const entry = byDay.get(day);
          return (
            <div key={day} className="glass-card rounded-2xl p-4 flex items-center gap-3">
              {entry?.image_url ? (
                <img
                  src={entry.image_url}
                  alt=""
                  className="h-12 w-12 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-xl bg-sea shrink-0" />
              )}
              <div className="w-24 shrink-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gold">{label}</p>
              </div>
              <div className="flex-1 min-w-0">
                {entry ? (
                  <div className="flex items-center gap-2">
                    <p className="font-display text-base text-foreground truncate">
                      {entry.title}
                    </p>
                    {!entry.is_active && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-destructive/20 text-destructive shrink-0">
                        Pasif
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Program tanımlanmadı</p>
                )}
              </div>
              <button
                onClick={() => openEdit(day)}
                className="p-2 text-foreground/70 active:text-gold"
              >
                <Pencil className="h-4 w-4" />
              </button>
              {entry && (
                <button
                  onClick={() => clear(day)}
                  className="p-2 text-foreground/70 active:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/95 overflow-y-auto">
          <div className="max-w-lg mx-auto p-5 pb-32">
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-background/90 backdrop-blur py-3 -mx-5 px-5 border-b border-border/40">
              <h2 className="font-display text-xl">{DAY_LABELS[editing.day_of_week]}</h2>
              <button onClick={() => setEditing(null)} className="p-2">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Program (TR) *"
                value={editing.title}
                onChange={(v) => setEditing({ ...editing, title: v })}
              />
              <Input
                label="Program (EN)"
                value={editing.title_en}
                onChange={(v) => setEditing({ ...editing, title_en: v })}
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
                  checked={editing.is_active}
                  onChange={(e) => setEditing({ ...editing, is_active: e.target.checked })}
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
                  disabled={!editing.title || saving}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-gold text-gold-foreground text-sm shadow-gold disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-input/60 border border-border rounded-full px-4 py-3 text-sm focus:border-gold focus:outline-none"
      />
    </div>
  );
}
