import { Link, useLocation } from "@tanstack/react-router";
import { Home, UtensilsCrossed, Music, CalendarDays, Info } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";

type NavItem = {
  to: string;
  labelKey: "nav.home" | "nav.menu" | "nav.song" | "nav.program" | "nav.about";
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const items: NavItem[] = [
  { to: "/", labelKey: "nav.home", icon: Home, exact: true },
  { to: "/menu", labelKey: "nav.menu", icon: UtensilsCrossed },
  { to: "/sarki-oner", labelKey: "nav.song", icon: Music },
  { to: "/program", labelKey: "nav.program", icon: CalendarDays },
  { to: "/hakkimizda", labelKey: "nav.about", icon: Info },
];

export function BottomNav() {
  const { t, localize, stripLocale } = useTranslation();
  const location = useLocation();
  const currentBase = stripLocale(location.pathname);

  return (
    <nav className="pointer-events-none fixed bottom-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-md px-0">
        <div className="pointer-events-auto border-t border-border/50 bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_-24px_rgba(0,0,0,0.18)]">
          <div className="grid grid-cols-5">
            {items.map((it) => {
              const active = it.exact ? currentBase === it.to : currentBase.startsWith(it.to);
              return (
                <Link
                  key={it.to}
                  to={localize(it.to)}
                  className={`flex flex-col items-center justify-center gap-1 py-2.5 transition active:scale-95 ${active ? "text-gold" : "text-foreground/60"}`}
                >
                  <it.icon className="h-4.5 w-4.5" />
                  <span className="text-[9px] tracking-wide">{t(it.labelKey)}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
