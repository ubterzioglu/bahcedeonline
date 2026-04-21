import { Link } from "@tanstack/react-router";
import { Home, UtensilsCrossed, Music, Info } from "lucide-react";

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean };
const items: NavItem[] = [
  { to: "/", label: "Anasayfa", icon: Home, exact: true },
  { to: "/menu", label: "Menü", icon: UtensilsCrossed },
  { to: "/sarki-oner", label: "Şarkı", icon: Music },
  { to: "/hakkimizda", label: "Hakkımızda", icon: Info },
];

export function BottomNav() {
  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-40"
    >
      <div className="mx-auto max-w-md px-0">
        <div className="pointer-events-auto border-t border-border/50 bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-12px_30px_-24px_rgba(0,0,0,0.18)]">
          <div className="grid grid-cols-4">
            {items.map((it) => (
              <Link
                key={it.to}
                to={it.to}
                activeOptions={{ exact: it.exact }}
                className="flex flex-col items-center justify-center gap-1 py-2.5 text-foreground/60 transition active:scale-95"
                activeProps={{ className: "text-gold" }}
              >
                <it.icon className="h-5 w-5" />
                <span className="text-[10px] tracking-wide">{it.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
