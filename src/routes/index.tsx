import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import hero from "@/assets/hero-bahce.jpg";
import beachVideo from "@/assets/beach-waves.mp4";
import { Sparkles, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { pick } from "@/lib/i18n/resolveContent";
import { LanguageToggle } from "@/components/LanguageToggle";

type HomeCard = Database["public"]["Tables"]["home_cards"]["Row"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dragoman Bahçe — Kaş'ta Akdeniz Bahçesi" },
      {
        name: "description",
        content: "Beer · Snacks · Cocktails. Kaş'ın kalbinde, mum ışığında bir bahçe.",
      },
      { property: "og:title", content: "Dragoman Bahçe — Kaş" },
      { property: "og:description", content: "Beer · Snacks · Cocktails." },
    ],
  }),
  component: Home,
});

export function Home() {
  const { t, locale, localize } = useTranslation();
  const [cards, setCards] = useState<HomeCard[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("home_cards")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true });
      setCards(data ?? []);
    })();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative h-[78vh] min-h-[560px] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={hero}
        >
          <source src={beachVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-background/90" />

        <div className="relative px-6 pt-12 pb-8 h-full flex flex-col">
          <p className="font-script text-2xl text-white/80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            {t("home.welcome")}
          </p>
          <h1 className="font-display mt-2 text-[44px] font-semibold leading-[0.98] tracking-[-0.02em] text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.3)]">
            {t("home.hero.line1")}
            <br />
            <span className="text-white">{t("home.hero.line2")}</span>
          </h1>

          <div className="mt-auto space-y-4">
            <LanguageToggle variant="hero" />
            <Link
              to={localize("/menu")}
              className="hero-cta flex items-center justify-center gap-2.5 rounded-full border border-white/18 px-8 py-5 text-lg font-semibold tracking-[0.01em] text-white active:scale-[0.985] transition duration-300"
            >
              <Sparkles className="h-5 w-5" /> {t("home.cta.menu")}
            </Link>
          </div>
        </div>
      </section>

      {/* CARDS */}
      <section className="px-5 pt-12 space-y-6">
        {cards.map((card) => (
          <HomeCardTile key={card.id} card={card} locale={locale} localize={localize} />
        ))}
      </section>
    </>
  );
}

function HomeCardTile({
  card,
  locale,
  localize,
}: {
  card: HomeCard;
  locale: "tr" | "en";
  localize: (path: string) => string;
}) {
  const title = pick(card, "title", locale);
  const body = pick(card, "body", locale);
  const script = pick(card, "script_label", locale);
  const cta = pick(card, "cta_label", locale);

  const content = (
    <div className="glass-card rounded-3xl p-3 shadow-elegant sm:p-3.5">
      <div className="flex items-start gap-3 sm:items-stretch sm:gap-4">
        <div className="w-[98px] shrink-0 overflow-hidden rounded-2xl sm:w-[132px]">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={title}
              className="aspect-square h-auto w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="aspect-square h-auto w-full bg-sea" />
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5 pr-0.5 sm:py-1 sm:pr-1">
          {script && (
            <p className="mb-1 text-lg font-script leading-none text-gradient-gold sm:text-xl">
              {script}
            </p>
          )}
          <h2 className="mb-2 font-display text-[1.05rem] leading-tight text-foreground sm:text-xl">
            {title}
          </h2>
          <p className="mb-3 text-[13px] leading-relaxed text-foreground/85 sm:text-sm">{body}</p>
          <span className="inline-flex items-center gap-1.5 border-b border-gold/40 pb-1 text-sm text-gold">
            {cta} <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );

  if (card.link_type === "external") {
    return (
      <a href={card.link_to} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link to={localize(card.link_to)} className="block">
      {content}
    </Link>
  );
}
