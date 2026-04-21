import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-bahce.jpg";
import beachVideo from "@/assets/beach-waves.mp4";
import turtle from "@/assets/turtle.jpg";
import { NowPlayingWidget } from "@/components/NowPlayingWidget";
import { GlassWater, Beer, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dragoman Bahçe — Kaş'ta Akdeniz Bahçesi" },
      { name: "description", content: "Beer · Snacks · Cocktails. Kaş'ın kalbinde, mum ışığında bir bahçe." },
      { property: "og:title", content: "Dragoman Bahçe — Kaş" },
      { property: "og:description", content: "Beer · Snacks · Cocktails." },
    ],
  }),
  component: Home,
});

function Home() {
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
          <h1 className="font-display text-[44px] leading-[1.05] mt-2 text-white drop-shadow-[0_8px_24px_rgba(0,0,0,0.28)]">
            Kaş'ın kalbinde
            <br />
            <span className="text-[oklch(0.92_0.07_190)]">bir Akdeniz bahçesi.</span>
          </h1>

          <div className="mt-auto space-y-4">
            <Link
              to="/menu"
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-sm font-medium text-gold-foreground shadow-gold active:scale-[0.98] transition"
            >
              <Sparkles className="h-4 w-4" /> Menüyü Keşfet
            </Link>
            <Link
              to="/sarki-oner"
              className="flex items-center justify-center gap-2 rounded-full border border-foreground/25 bg-glass px-6 py-3.5 text-sm text-foreground active:scale-[0.98] transition"
            >
              Şarkı Öner
            </Link>
          </div>
        </div>
      </section>

      {/* NOW PLAYING */}
      <section className="px-5 -mt-8 relative z-10">
        <NowPlayingWidget />
      </section>

      {/* HIGHLIGHTS */}
      <section className="px-5 pt-12">
        <div className="text-center mb-6">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">beer · snacks · cocktails</p>
          <h2 className="font-display text-3xl text-foreground leading-tight">
            Üç güzel şey,<br /><span className="text-gradient-gold">üç ayrı zevk</span>
          </h2>
        </div>

        <div className="space-y-3">
          {[
            { icon: GlassWater, title: "Cocktails", desc: "İmza karışımlar; taze otlar ve narenciye." },
            { icon: Beer, title: "Beer", desc: "Buz gibi yerel ve dünya biraları." },
            { icon: Sparkles, title: "Snacks", desc: "Hafif tabaklar, mezeler, paylaşımlık lezzetler." },
          ].map((c) => (
            <div key={c.title} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-sea flex items-center justify-center shrink-0">
                <c.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-xl text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY STRIP */}
      <section className="px-5 pt-12">
        <div className="glass-card rounded-3xl p-3 shadow-elegant">
          <div className="flex items-stretch gap-4">
            <div className="w-[112px] shrink-0 overflow-hidden rounded-2xl sm:w-[132px]">
              <img
                src={turtle}
                alt="Caretta caretta"
                className="h-full w-full aspect-square object-cover"
                loading="lazy"
              />
            </div>
            <div className="min-w-0 flex-1 py-1 pr-1">
              <p className="font-script text-xl text-gradient-gold mb-1">bizim hikâyemiz</p>
              <h2 className="font-display text-2xl leading-tight text-foreground mb-2">Bahçede bir ömür yaz</h2>
              <p className="text-sm text-foreground/85 leading-relaxed mb-3">
                Kaş&apos;ın masmavi suyunu içeride değil, dışarıda yaşıyoruz. Palmiyelerin altında,
                fenerlerin ışığında uzun yaz akşamları kuruyoruz.
              </p>
              <Link
                to="/hakkimizda"
                className="inline-flex items-center gap-1.5 text-gold text-sm border-b border-gold/40 pb-1"
              >
                Devamını oku <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
