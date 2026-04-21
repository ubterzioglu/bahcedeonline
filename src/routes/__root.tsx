import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomNav } from "@/components/BottomNav";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center glass-card rounded-3xl p-10">
        <h1 className="text-7xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">Bu sayfa kayıp</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Aradığın sayfa mevcut değil ya da taşınmış olabilir.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90 transition"
          >
            Anasayfaya dön
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dragoman Bahçe — Beer · Snacks · Cocktails | Kaş" },
      {
        name: "description",
        content:
          "Kaş'ın kalbinde, deniz esintisinde bir bahçe. Özenle hazırlanmış kokteyller, soğuk biralar ve atıştırmalıklar.",
      },
      { name: "author", content: "Dragoman Bahçe" },
      { property: "og:title", content: "Dragoman Bahçe — Kaş" },
      {
        property: "og:description",
        content: "Beer · Snacks · Cocktails. Kaş'ta bir Akdeniz bahçesi.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Great+Vibes&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background relative shadow-[0_0_40px_-30px_rgba(15,23,42,0.2)]">
      <SiteHeader />
      <main className="pb-24">
        <Outlet />
      </main>
      <div className="pb-20">
        <SiteFooter />
      </div>
      <BottomNav />
    </div>
  );
}
