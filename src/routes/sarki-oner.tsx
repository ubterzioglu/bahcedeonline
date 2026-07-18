import { createFileRoute } from "@tanstack/react-router";
import { Music2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { seoLinks, seoLocaleMeta } from "@/lib/seo";

export const Route = createFileRoute("/sarki-oner")({
  head: () => ({
    meta: [
      { title: "Şarkı Öner — Dragoman Bahçe" },
      { name: "description", content: "Bahçede çalmasını istediğiniz şarkıyı bize gönderin." },
      { property: "og:title", content: "Şarkı Öner — Dragoman Bahçe" },
      { property: "og:description", content: "Sıradaki parça sizden gelsin." },
      ...seoLocaleMeta("tr"),
    ],
    links: seoLinks("/sarki-oner", "tr"),
  }),
  component: SongRequest,
});

export function SongRequest() {
  const { t } = useTranslation();

  return (
    <div className="px-5 pt-8 space-y-5">
      <div className="text-center">
        <p className="font-script text-2xl text-gradient-gold mb-1">{t("song.script")}</p>
        <h1 className="font-display text-4xl text-foreground">{t("song.title")}</h1>
      </div>

      <div className="glass-card rounded-2xl p-10 text-center space-y-3">
        <Music2 className="h-10 w-10 text-gold mx-auto" />
        <p className="font-display text-2xl text-gold">{t("song.comingSoon")}</p>
        <p className="text-sm text-muted-foreground">{t("song.comingSoon.desc")}</p>
      </div>
    </div>
  );
}
