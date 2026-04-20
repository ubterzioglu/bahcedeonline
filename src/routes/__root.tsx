import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { DEFAULT_LOCALE, getDictionary, getLocaleFromPathname } from "@/lib/i18n";

function NotFoundComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = getLocaleFromPathname(pathname);
  const dictionary = getDictionary(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center glass-card rounded-3xl p-8 sm:p-10">
        <h1 className="text-7xl font-display text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-display text-foreground">
          {dictionary.common.notFoundTitle}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{dictionary.common.notFoundBody}</p>
        <div className="mt-6">
          <Link
            to="/$locale"
            params={{ locale }}
            className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-gold-foreground hover:opacity-90 transition"
          >
            {dictionary.common.goHome}
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
      { title: "Dragoman Bahce" },
      { name: "description", content: "Mediterranean garden in Kas." },
      { name: "author", content: "Dragoman Bahce" },
      { property: "og:title", content: "Dragoman Bahce" },
      { property: "og:description", content: "Beer · Snacks · Cocktails in Kas." },
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
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const locale = getLocaleFromPathname(pathname || `/${DEFAULT_LOCALE}`);

  return (
    <html lang={locale}>
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
  return <Outlet />;
}
