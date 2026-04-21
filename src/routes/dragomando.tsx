import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

export const Route = createFileRoute("/dragomando")({
  head: () => ({
    meta: [
      { title: "Dragoman Diving & Outdoor — Kaş" },
      {
        name: "description",
        content: "Kaş'ta dalış, kano, trekking ve açık hava deneyimleri — Dragoman Diving & Outdoor.",
      },
      { property: "og:title", content: "Dragoman Diving & Outdoor" },
      { property: "og:description", content: "Kaş'ta dalış ve açık hava deneyimleri." },
    ],
  }),
  component: DragomandoPage,
});

export function DragomandoPage() {
  const { t, localize } = useTranslation();
  return (
    <div className="px-5 pt-8 pb-16">
      <Link
        to={localize("/")}
        className="inline-flex items-center gap-1.5 text-gold text-sm border-b border-gold/40 pb-1 mb-6"
      >
        <ChevronLeft className="h-4 w-4" /> {t("dragomando.back")}
      </Link>

      <div className="mb-6 text-center">
        <p className="font-script text-2xl text-gradient-gold mb-1">{t("dragomando.script")}</p>
        <h1 className="font-display text-4xl text-foreground">{t("dragomando.title")}</h1>
      </div>

      <div className="glass-card rounded-3xl p-5 shadow-elegant">
        <p className="text-sm leading-relaxed text-foreground/85">{t("dragomando.body")}</p>
      </div>
    </div>
  );
}
