import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Music2, Send } from "lucide-react";
import { z } from "zod";
import { NowPlayingWidget } from "@/components/NowPlayingWidget";
import { supabase } from "@/integrations/supabase/client";
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
  component: SongRequestPage,
});

function SongRequestPage() {
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

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? dictionary.songPage.errors.generic);
      return;
    }

    setSending(true);
    const { error: insertError } = await supabase.from("song_requests").insert({
      guest_name: parsed.data.guest_name || null,
      song_title: parsed.data.song_title,
      artist: parsed.data.artist || null,
      message: parsed.data.message || null,
    });
    setSending(false);

    if (insertError) {
      setError(dictionary.songPage.errors.generic);
      return;
    }

    setDone(true);
    setForm({ guest_name: "", song_title: "", artist: "", message: "" });
  };

  return (
    <div className="space-y-5 px-4 pt-8 sm:px-5">
      <div className="text-center">
        <p className="mb-1 font-script text-2xl text-gradient-gold">{dictionary.nav.nextSong}</p>
        <h1 className="font-display text-4xl text-foreground">{dictionary.songPage.heading}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{dictionary.songPage.subheading}</p>
      </div>

      <NowPlayingWidget />

      <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-5">
        {done ? (
          <div className="py-6 text-center">
            <div className="mb-3 text-5xl">🎶</div>
            <h2 className="mb-1 font-display text-2xl text-gold">
              {dictionary.songPage.successTitle}
            </h2>
            <p className="text-sm text-muted-foreground">{dictionary.songPage.successBody}</p>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="mt-5 border-b border-gold/40 text-sm text-gold"
            >
              {dictionary.songPage.submitAnother}
            </button>
          </div>
        ) : (
          <>
            <Field
              label={dictionary.songPage.guestName}
              value={form.guest_name}
              onChange={(value) => setForm({ ...form, guest_name: value })}
              placeholder={dictionary.songPage.placeholders.guestName}
            />
            <Field
              label={dictionary.songPage.songTitle}
              value={form.song_title}
              onChange={(value) => setForm({ ...form, song_title: value })}
              placeholder={dictionary.songPage.placeholders.songTitle}
              required
            />
            <Field
              label={dictionary.songPage.artist}
              value={form.artist}
              onChange={(value) => setForm({ ...form, artist: value })}
              placeholder={dictionary.songPage.placeholders.artist}
            />
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {dictionary.songPage.note}
              </label>
              <textarea
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                rows={3}
                maxLength={280}
                placeholder={dictionary.songPage.notePlaceholder}
                className="w-full rounded-2xl border border-border bg-input/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-gold focus:outline-none"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={sending}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold py-4 text-sm font-medium text-gold-foreground shadow-gold transition active:scale-[0.98] disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {sending ? dictionary.songPage.sending : dictionary.songPage.submit}
            </button>
          </>
        )}
      </form>

      <div className="glass-card flex gap-3 rounded-2xl p-5">
        <Music2 className="mt-0.5 h-6 w-6 shrink-0 text-gold" />
        <p className="text-xs leading-relaxed text-muted-foreground">
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
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
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
        required={required}
        maxLength={120}
        className="w-full rounded-full border border-border bg-input/60 px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition focus:border-gold focus:outline-none"
      />
    </div>
  );
}
