import { Link } from "@tanstack/react-router";
import { Home, UtensilsCrossed, Music, Info } from "lucide-react";
import { useI18n } from "@/lib/i18n";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

export function BottomNav() {
  const { locale, dictionary } = useI18n();
  const items: NavItem[] = [
    { to: "/$locale", label: dictionary.common.home, icon: Home, exact: true },
    { to: "/$locale/menu", label: dictionary.common.menu, icon: UtensilsCrossed },
    { to: "/$locale/sarki-oner", label: dictionary.common.songs, icon: Music },
    { to: "/$locale/hakkimizda", label: dictionary.common.about, icon: Info },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="grid grid-cols-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            params={{ locale }}
            activeOptions={{ exact: it.exact }}
            className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 py-2.5 text-foreground/60 transition active:scale-95"
            activeProps={{ className: "text-gold" }}
          >
            <it.icon className="h-5 w-5" />
            <span className="text-center text-[10px] tracking-wide">{it.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
