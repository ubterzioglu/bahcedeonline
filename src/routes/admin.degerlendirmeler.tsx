import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Save } from "lucide-react";
import { adminApi } from "@/lib/admin-api";
import type { SiteRatings } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/degerlendirmeler")({
  component: RatingsPage,
});

type FormState = {
  google_rating: string;
  google_review_count: string;
  tripadvisor_rating: string;
  tripadvisor_review_count: string;
};

function toFormState(ratings: SiteRatings | null): FormState {
  return {
    google_rating: ratings?.google_rating?.toString() ?? "",
    google_review_count: ratings?.google_review_count?.toString() ?? "",
    tripadvisor_rating: ratings?.tripadvisor_rating?.toString() ?? "",
    tripadvisor_review_count: ratings?.tripadvisor_review_count?.toString() ?? "",
  };
}

function RatingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<"google" | "tripadvisor" | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(toFormState(null));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await adminApi.getSiteRatings();
        setForm(toFormState(data));
        setUpdatedAt(data?.updated_at ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Veriler yüklenemedi.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    await save("google", {
      google_rating: form.google_rating ? Number(form.google_rating) : null,
      google_review_count: form.google_review_count ? Number(form.google_review_count) : null,
    });
  };

  const saveTripadvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    await save("tripadvisor", {
      tripadvisor_rating: form.tripadvisor_rating ? Number(form.tripadvisor_rating) : null,
      tripadvisor_review_count: form.tripadvisor_review_count
        ? Number(form.tripadvisor_review_count)
        : null,
    });
  };

  const save = async (source: "google" | "tripadvisor", payload: Partial<SiteRatings>) => {
    setError(null);
    setMessage(null);
    setSaving(source);
    try {
      const data = await adminApi.updateSiteRatings(payload);
      setForm(toFormState(data));
      setUpdatedAt(data.updated_at);
      setMessage(source === "google" ? "Google verileri güncellendi." : "Tripadvisor verileri güncellendi.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Güncelleme başarısız.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <p className="text-sm text-muted-foreground">Yükleniyor…</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground mb-1">Değerlendirmeler</h1>
      <p className="text-xs text-muted-foreground mb-5">
        Google ve Tripadvisor puanlarını elle güncelleyin. Bu değerler ana sayfa JSON-LD'sinde
        (arama motoru / AI asistan sonuçlarında) kullanılır.
      </p>

      {message && <p className="mb-4 text-sm text-gold">{message}</p>}
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {updatedAt && (
        <p className="mb-4 text-[11px] text-muted-foreground">
          Son güncelleme: {new Date(updatedAt).toLocaleString("tr-TR")}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <form onSubmit={saveGoogle} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Star className="h-4 w-4 text-gold" />
            <h2 className="font-display text-lg">Google verilerini güncelle</h2>
          </div>
          <Field
            label="Puan (0-5)"
            value={form.google_rating}
            onChange={(v) => setForm((f) => ({ ...f, google_rating: v }))}
            step="0.1"
            min="0"
            max="5"
          />
          <Field
            label="Yorum sayısı"
            value={form.google_review_count}
            onChange={(v) => setForm((f) => ({ ...f, google_review_count: v }))}
            step="1"
            min="0"
          />
          <button
            type="submit"
            disabled={saving === "google"}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded-full py-3 text-sm font-medium shadow-gold disabled:opacity-50 active:scale-[0.98] transition"
          >
            <Save className="h-4 w-4" />
            {saving === "google" ? "Kaydediliyor…" : "Google verilerini güncelle"}
          </button>
        </form>

        <form onSubmit={saveTripadvisor} className="glass-card rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground">
            <Star className="h-4 w-4 text-gold" />
            <h2 className="font-display text-lg">Tripadvisor verilerini güncelle</h2>
          </div>
          <Field
            label="Puan (0-5)"
            value={form.tripadvisor_rating}
            onChange={(v) => setForm((f) => ({ ...f, tripadvisor_rating: v }))}
            step="0.1"
            min="0"
            max="5"
          />
          <Field
            label="Yorum sayısı"
            value={form.tripadvisor_review_count}
            onChange={(v) => setForm((f) => ({ ...f, tripadvisor_review_count: v }))}
            step="1"
            min="0"
          />
          <button
            type="submit"
            disabled={saving === "tripadvisor"}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded-full py-3 text-sm font-medium shadow-gold disabled:opacity-50 active:scale-[0.98] transition"
          >
            <Save className="h-4 w-4" />
            {saving === "tripadvisor" ? "Kaydediliyor…" : "Tripadvisor verilerini güncelle"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  step,
  min,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
  min?: string;
  max?: string;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="w-full bg-input/60 border border-border rounded-full px-5 py-3 text-sm text-foreground focus:border-gold focus:outline-none transition"
      />
    </div>
  );
}
