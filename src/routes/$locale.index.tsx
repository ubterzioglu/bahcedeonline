import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassWater, Beer, Sparkles, ChevronRight } from "lucide-react";
import hero from "@/assets/hero-bahce.jpg";
import turtle from "@/assets/turtle.jpg";
import { NowPlayingWidget } from "@/components/NowPlayingWidget";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));

    return {
      meta: [
        { title: dictionary.home.title },
        { name: "description", content: dictionary.home.description },
        { property: "og:title", content: dictionary.home.title },
        { property: "og:description", content: dictionary.home.description },
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { locale, dictionary } = useI18n();
  const cards = [
    { icon: GlassWater, ...dictionary.home.cards[0] },
    { icon: Beer, ...dictionary.home.cards[1] },
    { icon: Sparkles, ...dictionary.home.cards[2] },
  ];

  return (
    <>
      <section className="relative min-h-[72svh] overflow-hidden md:min-h-[78vh]">
        <img
          src={hero}
          alt={dictionary.brand.name}
          className="absolute inset-0 h-full w-full object-cover"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background" />

        <div className="relative flex min-h-[72svh] flex-col px-4 pb-8 pt-10 sm:px-6 md:min-h-[78vh] md:pt-12">
          <p className="font-script text-2xl text-gradient-gold">{dictionary.nav.sinceSea}</p>
          <h1 className="mt-2 max-w-[10ch] text-[42px] leading-[1.02] text-foreground sm:text-[44px] md:max-w-none md:text-[52px]">
            {dictionary.home.heroTitleTop}
            <br />
            <span className="text-gradient-sea">{dictionary.home.heroTitleBottom}</span>
          </h1>

          <div className="mt-auto space-y-3.5">
            <p className="max-w-[34ch] text-[15px] leading-relaxed text-foreground/85">
              {dictionary.home.heroBody}
            </p>
            <Link
              to="/$locale/menu"
              params={{ locale }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-medium text-gold-foreground shadow-gold transition active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              {dictionary.home.ctaMenu}
            </Link>
            <Link
              to="/$locale/sarki-oner"
              params={{ locale }}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-foreground/25 bg-glass px-6 py-3.5 text-sm text-foreground transition active:scale-[0.98]"
            >
              {dictionary.home.ctaSong}
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 px-4 sm:px-5">
        <NowPlayingWidget />
      </section>

      <section className="px-4 pt-12 sm:px-5">
        <div className="mb-6 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[0.4em] text-gold">
            {dictionary.home.highlightsEyebrow}
          </p>
          <h2 className="font-display text-3xl leading-tight text-foreground">
            {dictionary.home.highlightsTitleTop}
            <br />
            <span className="text-gradient-gold">{dictionary.home.highlightsTitleBottom}</span>
          </h2>
        </div>

        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="glass-card flex items-center gap-4 rounded-2xl p-4 sm:p-5"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sea">
                <card.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-2 pt-12 sm:px-5">
        <div className="relative overflow-hidden rounded-3xl shadow-elegant">
          <img
            src={turtle}
            alt="Caretta caretta"
            className="aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="mb-1 font-script text-2xl text-gradient-gold">
              {dictionary.nav.ourStory}
            </p>
            <h2 className="mb-3 font-display text-3xl text-foreground">
              {dictionary.home.storyTitle}
            </h2>
            <p className="mb-4 text-sm leading-relaxed text-foreground/85">
              {dictionary.home.storyBody}
            </p>
            <Link
              to="/$locale/hakkimizda"
              params={{ locale }}
              className="inline-flex items-center gap-1.5 border-b border-gold/40 pb-1 text-sm text-gold"
            >
              {dictionary.home.readMore}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
