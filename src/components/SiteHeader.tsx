import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { localizePath, swapLocaleInPathname, useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const location = useLocation();
  const { locale, dictionary } = useI18n();
  const isAdmin = location.pathname.includes("/admin");
  const nextLocale = locale === "tr" ? "en" : "tr";

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-5">
        <Link to="/$locale" params={{ locale }} className="flex min-w-0 items-center gap-3">
          <img src={logo} alt={dictionary.brand.name} className="h-10 w-auto shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-[11px] uppercase tracking-[0.28em] text-gold">
              {dictionary.brand.name}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {dictionary.brand.location}
            </p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={swapLocaleInPathname(location.pathname, nextLocale)}
            className="inline-flex h-9 items-center justify-center rounded-full border border-border/60 px-3 text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/80"
          >
            {dictionary.switcher[nextLocale]}
          </a>
          {!isAdmin && (
            <Link
              to="/$locale/auth"
              params={{ locale }}
              className="inline-flex h-9 items-center justify-center rounded-full border border-gold/40 px-3 text-[10px] uppercase tracking-[0.2em] text-gold"
            >
              {dictionary.common.admin}
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
