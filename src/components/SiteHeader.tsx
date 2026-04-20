import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/logo.png";
import { swapLocaleInPathname, useI18n } from "@/lib/i18n";

export function SiteHeader() {
  const { locale, dictionary } = useI18n();
  const location = useLocation();
  const otherLocale = locale === "tr" ? "en" : "tr";

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="px-5 flex h-16 items-center justify-between">
        <Link to="/$locale" params={{ locale }} className="flex items-center gap-2">
          <img src={logo} alt="Dragoman Bahce" className="h-9 w-auto" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={swapLocaleInPathname(location.pathname, otherLocale)}
            className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] rounded-full border border-border/50 text-foreground/60"
          >
            {dictionary.switcher[otherLocale]}
          </Link>
          <Link
            to="/$locale/auth"
            params={{ locale }}
            className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] rounded-full border border-gold/40 text-gold"
          >
            {dictionary.nav.staffOnly}
          </Link>
        </div>
      </div>
    </header>
  );
}
