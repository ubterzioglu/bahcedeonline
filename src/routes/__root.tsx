import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useLocation,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BottomNav } from "@/components/BottomNav";
import { LocaleProvider } from "@/lib/i18n/LocaleProvider";
import { useTranslation } from "@/lib/i18n/useTranslation";

function NotFoundComponent() {
  return (
    <LocaleProvider>
      <NotFoundInner />
    </LocaleProvider>
  );
}

function NotFoundInner() {
  const { t, localize } = useTranslation();
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center glass-card rounded-3xl p-10">
        <h1 className="text-7xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">{t("notfound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notfound.desc")}</p>
        <div className="mt-6">
          <Link
            to={localize("/")}
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90 transition"
          >
            {t("notfound.cta")}
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
      { property: "og:image", content: "/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og.jpg" },
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
    <LocaleProvider>
      <RootLayout />
    </LocaleProvider>
  );
}

function RootLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Outlet />
      </div>
    );
  }

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
