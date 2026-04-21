import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/kasguide")({
  head: () => ({
    meta: [
      { title: "Kasguide.de — Kaş Rehberi | Dragoman Bahçe" },
      {
        name: "description",
        content: "Kaş'ın en kapsamlı rehberi. Yakında Kasguide.de'de.",
      },
    ],
  }),
  component: KasguidePage,
});

function KasguidePage() {
  return (
    <div className="px-5 py-10">
      <div className="glass-card rounded-3xl p-8 shadow-elegant text-center space-y-6">
        <h1 className="font-display text-3xl text-gradient-gold">Kasguide.de</h1>
        <p className="text-foreground/85 leading-relaxed">
          Kaş&apos;ın en kapsamlı rehberi yakında burada.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Restoranlar, plajlar, aktiviteler ve daha fazlası — tüm Kaş tek bir platformda.
        </p>
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
  );
}
