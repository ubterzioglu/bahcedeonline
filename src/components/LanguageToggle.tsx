import { useTranslation } from "@/lib/i18n/useTranslation";
import type { Locale } from "@/lib/i18n/types";

type Variant = "hero" | "footer";

const variants: Record<Variant, { container: string; base: string; active: string; inactive: string }> = {
  hero: {
    container: "flex justify-center gap-2",
    base: "rounded-full border border-white/18 px-5 py-2 text-sm font-medium tracking-[0.1em] transition active:scale-[0.96]",
    active: "bg-white/15 text-white border-white/40",
    inactive: "text-white/70 hover:text-white hover:border-white/30",
  },
  footer: {
    container: "flex justify-center gap-2",
    base: "rounded-full border border-border px-4 py-1.5 text-xs font-medium tracking-[0.15em] transition",
    active: "bg-gold text-gold-foreground border-transparent",
    inactive: "text-foreground/70 hover:text-foreground",
  },
};

export function LanguageToggle({ variant = "hero" }: { variant?: Variant }) {
  const { locale, setLocale } = useTranslation();
  const styles = variants[variant];

  return (
    <div className={styles.container}>
      {(["tr", "en"] as Locale[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={`${styles.base} ${locale === l ? styles.active : styles.inactive}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
