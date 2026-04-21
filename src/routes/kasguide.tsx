import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import kasguideMenu from "@/assets/kasguidemenugorsel.jpg";
import { useTranslation } from "@/lib/i18n/useTranslation";

export const Route = createFileRoute("/kasguide")({
  head: () => ({
    meta: [
      { title: "Kasguide.de — Kaş Rehberi | Dragoman Bahçe" },
      {
        name: "description",
        content: "Kaş'ın en kapsamlı rehberi. Yakında Kasguide.de'da.",
      },
    ],
  }),
  component: KasguidePage,
});

export function KasguidePage() {
  const { t } = useTranslation();
  return (
    <div className="px-5 py-10">
      <div className="glass-card rounded-3xl overflow-hidden shadow-elegant">
        <img src={kasguideMenu} alt="Kasguide.de" className="w-full h-48 object-cover" />
        <div className="p-8 text-center space-y-6">
          <h1 className="font-display text-3xl text-gradient-gold">{t("kasguide.heading")}</h1>
          <p className="text-foreground/85 leading-relaxed">{t("kasguide.sub")}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{t("kasguide.desc")}</p>
          <a
            href="https://kasguide.de"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-gold border-b border-gold/40 pb-1 text-sm"
          >
            kasguide.de <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
