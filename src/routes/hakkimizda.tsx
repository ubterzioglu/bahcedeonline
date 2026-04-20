import { createFileRoute } from "@tanstack/react-router";
import turtle from "@/assets/turtle.jpg";

export const Route = createFileRoute("/hakkimizda")({
  head: () => ({
    meta: [
      { title: "Hakkımızda — Dragoman Bahçe" },
      { name: "description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
      { property: "og:title", content: "Hakkımızda — Dragoman Bahçe" },
      { property: "og:description", content: "Kaş'ta küçük bir Akdeniz bahçesi." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="px-5 pt-8">
      <header className="text-center mb-6">
        <p className="font-script text-2xl text-gradient-gold mb-1">our story</p>
        <h1 className="font-display text-4xl text-foreground">Hakkımızda</h1>
      </header>

      <div className="relative rounded-2xl overflow-hidden mb-6 shadow-elegant">
        <img src={turtle} alt="Kaş kıyıları" className="w-full aspect-[4/5] object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute bottom-5 left-5 right-5">
          <p className="font-script text-3xl text-gold">Dragoman</p>
          <p className="text-foreground/90 text-sm mt-1">
            "Tercüman" demek — iki dünya arasında köprü kuran.
          </p>
        </div>
      </div>

      <div className="space-y-4 text-foreground/85 text-[15px] leading-relaxed">
        <p className="text-lg font-display text-foreground">
          Dragoman Bahçe, Kaş'ta küçük ama sahici bir mola noktası.
        </p>
        <p>
          Sabahları dalış, öğleden sonra Akdeniz'in en mavi suları; geceleri ise serin
          bir bahçede mum ışığında bir kadeh. Burada pub gibi ağır yemek yok —
          özenle hazırlanmış kokteyller, soğuk biralar, şaraplar ve hafif atıştırmalıklar var.
        </p>
        <p>
          Misafirlerimizi caretta carettalar, palmiye gölgeleri ve hep bir ezgi karşılar.
          Müziği siz seçin: aklınızdaki şarkıyı "Şarkı Öner" sayfasından bize gönderin.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-8">
        {[
          { k: "Konum", v: "Kaş" },
          { k: "Sezon", v: "Nis–Kas" },
          { k: "Konsept", v: "Bahçe" },
        ].map((b) => (
          <div key={b.k} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-[9px] uppercase tracking-[0.25em] text-gold">{b.k}</p>
            <p className="font-display text-base mt-1 text-foreground">{b.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
