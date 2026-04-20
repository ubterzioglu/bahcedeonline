import { createFileRoute } from "@tanstack/react-router";
import turtle from "@/assets/turtle.jpg";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/hakkimizda")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));

    return {
      meta: [
        { title: dictionary.aboutPage.title },
        { name: "description", content: dictionary.aboutPage.description },
        { property: "og:title", content: dictionary.aboutPage.title },
        { property: "og:description", content: dictionary.aboutPage.description },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const { dictionary } = useI18n();

  return (
    <div className="px-4 pt-8 sm:px-5">
      <header className="mb-6 text-center">
        <p className="mb-1 font-script text-2xl text-gradient-gold">{dictionary.nav.ourStory}</p>
        <h1 className="font-display text-4xl text-foreground">{dictionary.aboutPage.heading}</h1>
      </header>

      <div className="relative mb-6 overflow-hidden rounded-2xl shadow-elegant">
        <img
          src={turtle}
          alt={dictionary.brand.location}
          className="aspect-[4/5] w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-script text-3xl text-gold">Dragoman</p>
          <p className="mt-1 text-sm text-foreground/90">{dictionary.aboutPage.bridgeTitle}</p>
        </div>
      </div>

      <div className="space-y-4 text-[15px] leading-relaxed text-foreground/85">
        <p className="font-display text-lg text-foreground">{dictionary.aboutPage.intro}</p>
        <p>{dictionary.aboutPage.paragraph1}</p>
        <p>{dictionary.aboutPage.paragraph2}</p>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-2">
        {dictionary.aboutPage.badges.map((badge) => (
          <div key={badge.key} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold">{badge.key}</p>
            <p className="mt-1 font-display text-base text-foreground">{badge.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
