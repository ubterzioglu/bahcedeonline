import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music2, Send } from "lucide-react";
import { z } from "zod";
import { NowPlayingWidget } from "@/components/NowPlayingWidget";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/sarki-oner")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));
    return {
      meta: [
        { title: dictionary.songPage.title },
        { name: "description", content: dictionary.songPage.description },
        { property: "og:title", content: dictionary.songPage.title },
        { property: "og:description", content: dictionary.songPage.description },
      ],
    };
  },
  component: SongRequest,
});

function SongRequest() {
  const { dictionary } = useI18n();
  const schema = z.object({
    guest_name: z.string().trim().max(50).optional(),
    song_title: z.string().trim().min(1, dictionary.songPage.errors.songRequired).max(120),
    artist: z.string().trim().max(80).optional(),
    message: z.string().trim().max(280).optional(),
  });

  const [form, setForm] = useState({ guest_name: "", song_title: "", artist: "", message: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? dictionary.songPage.errors.generic);
      return;
    }
    setSending(true);
    const { error } = await supabase.from("song_requests").insert({
      guest_name: parsed.data.guest_name || null,
      song_title: parsed.data.song_title,
      artist: parsed.data.artist || null,
      message: parsed.data.message || null,
    });
    setSending(false);
    if (error) {
      setError(dictionary.songPage.errors.generic);
      return;
    }
    setDone(true);
    setForm({ guest_name: "", song_title: "", artist: "", message: "" });
  };

  return (
    <div className="px-5 pt-8 space-y-5">
      <div className="text-center">
        <p className="font-script text-2xl text-gradient-gold mb-1">{dictionary.nav.nextSong}</p>
        <h1 className="font-display text-4xl text-foreground">{dictionary.songPage.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dictionary.songPage.subheading}</p>
      </div>

      <NowPlayingWidget />

      <form onSubmit={submit} className="glass-card rounded-2xl p-5 space-y-4">
        {done ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">🎶</div>
            <h2 className="font-display text-2xl text-gold mb-1">
              {dictionary.songPage.successTitle}
            </h2>
            <p className="text-muted-foreground text-sm">{dictionary.songPage.successBody}</p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-5 text-sm text-gold border-b border-gold/40"
            >
              {dictionary.songPage.submitAnother}
            </button>
          </div>
        ) : (
          <>
            <Field
              label={dictionary.songPage.guestName}
              value={form.guest_name}
              onChange={(v) => setForm({ ...form, guest_name: v })}
              placeholder={dictionary.songPage.placeholders.guestName}
            />
            <Field
              label={dictionary.songPage.songTitle}
              value={form.song_title}
              onChange={(v) => setForm({ ...form, song_title: v })}
              placeholder={dictionary.songPage.placeholders.songTitle}
              required
            />
            <Field
              label={dictionary.songPage.artist}
              value={form.artist}
              onChange={(v) => setForm({ ...form, artist: v })}
              placeholder={dictionary.songPage.placeholders.artist}
            />
            <div>
              <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
                {dictionary.songPage.note}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                maxLength={280}
                placeholder={dictionary.songPage.notePlaceholder}
                className="w-full bg-input/60 border border-border rounded-2xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none transition"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 bg-gold text-gold-foreground rounded-full py-4 text-sm font-medium shadow-gold disabled:opacity-50 active:scale-[0.98] transition"
            >
              <Send className="h-4 w-4" />
              {sending ? dictionary.songPage.sending : dictionary.songPage.submit}
            </button>
          </>
        )}
      </form>

      <div className="glass-card rounded-2xl p-5 flex gap-3">
        <Music2 className="h-6 w-6 text-gold shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          {dictionary.songPage.helper}
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5 block">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        maxLength={120}
        className="w-full bg-input/60 border border-border rounded-full px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-gold focus:outline-none transition"
      />
    </div>
  );
}
