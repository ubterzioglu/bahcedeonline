import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-bahce.jpg";
import beachVideo from "@/assets/beach-waves.mp4";
import turtle from "@/assets/turtle.jpg";
import { Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dragoman Bahçe — Kaş'ta Akdeniz Bahçesi" },
      {
        name: "description",
        content: "Beer · Snacks · Cocktails. Kaş'ın kalbinde, mum ışığında bir bahçe.",
      },
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
          <p className="font-script text-2xl text-white/80 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
            Hoş geldiniz!
          </p>
          <h1 className="font-display mt-2 text-[44px] font-semibold leading-[0.98] tracking-[-0.02em] text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.3)]">
            Kaş'ın kalbinde
            <br />
            <span className="text-white">bir Akdeniz bahçesi.</span>
          </h1>

          <div className="mt-auto space-y-4">
            <Link
              to="/menu"
              className="hero-cta flex items-center justify-center gap-2.5 rounded-full border border-white/18 px-8 py-5 text-lg font-semibold tracking-[0.01em] text-white active:scale-[0.985] transition duration-300"
            >
              <Sparkles className="h-5 w-5" /> Menüyü Keşfet
            </Link>
          </div>
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
              <h2 className="font-display text-xl leading-none text-foreground mb-2 whitespace-nowrap">
                Bahçede bir ömür yaz
              </h2>
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

        <div className="pt-6">
          <Link to="/kasguide">
            <div className="glass-card rounded-3xl p-3 shadow-elegant">
              <div className="flex items-stretch gap-4">
                <div className="w-[112px] shrink-0 overflow-hidden rounded-2xl sm:w-[132px]">
                  <img
                    src="https://placehold.co/400x400?text=Kasguide"
                    alt="Kasguide.de"
                    className="h-full w-full aspect-square object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1 py-1 pr-1">
                  <p className="font-script text-xl text-gradient-gold mb-1">kaş rehberi</p>
                  <h2 className="font-display text-xl leading-none text-foreground mb-2 whitespace-nowrap">
                    Kasguide.de
                  </h2>
                  <p className="text-sm text-foreground/85 leading-relaxed mb-3">
                    Kaş&apos;ın en kapsamlı rehberi. Restoranlar, plajlar, aktiviteler ve daha
                    fazlası.
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-gold text-sm border-b border-gold/40 pb-1">
                    Keşfet <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
