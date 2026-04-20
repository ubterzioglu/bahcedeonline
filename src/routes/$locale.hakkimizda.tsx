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
    <div className="px-5 pt-8">
      <header className="text-center mb-6">
        <p className="font-script text-2xl text-gradient-gold mb-1">{dictionary.nav.ourStory}</p>
        <h1 className="font-display text-4xl text-foreground">{dictionary.aboutPage.heading}</h1>
      </header>

      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-elegant">
        <img
          src={turtle}
          alt={dictionary.brand.location}
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-script text-3xl text-gold">Dragoman</p>
          <p className="text-foreground/90 text-sm mt-1">{dictionary.aboutPage.bridgeTitle}</p>
        </div>
      </div>

      <div className="space-y-4 text-foreground/85 text-[15px] leading-relaxed">
        <p className="text-lg font-display text-foreground">{dictionary.aboutPage.intro}</p>
        <p>{dictionary.aboutPage.paragraph1}</p>
        <p>{dictionary.aboutPage.paragraph2}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-8">
        {dictionary.aboutPage.badges.map((b) => (
          <div key={b.key} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold">{b.key}</p>
            <p className="font-display text-base mt-1 text-foreground">{b.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
