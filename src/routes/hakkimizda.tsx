import { createFileRoute } from "@tanstack/react-router";
import turtle from "@/assets/turtle.jpg";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hikayemiz — Dragoman Bahçe" },
      { name: "description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
      { property: "og:title", content: "Hikayemiz — Dragoman Bahçe" },
      { property: "og:description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
      ...seoLocaleMeta("tr"),
    ],
    links: seoLinks("/hakkimizda", "tr"),
  }),
  component: AboutPage,
});

export function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="px-5 pt-8">
      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-elegant">
        <img
          src={turtle}
          alt="Kaş"
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-script text-3xl text-gold">{t("about.dragoman")}</p>
          <p className="text-foreground/90 text-sm mt-1">{t("about.dragoman.meaning")}</p>
        </div>
      </div>

      <div className="mb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.24em] text-foreground/55">
          {t("about.section.label")}
        </p>
      </div>

      <div className="space-y-4 text-foreground/85 text-[15px] leading-relaxed">
        <p className="text-lg text-foreground">{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <p>{t("about.p3")}</p>
        <p>{t("about.p4")}</p>
        <p>{t("about.p5")}</p>
        <p>{t("about.p6")}</p>
        <p>{t("about.p7")}</p>
        <p>{t("about.p8")}</p>
        <p>{t("about.p9")}</p>
        <p className="text-foreground">{t("about.p10")}</p>
      </div>
    </div>
  );
}
