import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Music,
  Radio,
  LogOut,
  LockKeyhole,
  Menu,
  X,
  LayoutGrid,
  CalendarDays,
  BarChart3,
  Search,
  ExternalLink,
  Star,
  Images,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

const CLARITY_URL =
  "https://clarity.microsoft.com/projects/view/x3emfiml3b/dashboard?date=Last%203%20days";
const SEARCH_CONSOLE_URL =
  "https://search.google.com/u/0/search-console/performance/search-analytics?resource_id=sc-domain%3Abahcede.online&hl=de&pageId=none";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Yönetim — Dragoman Bahçe" }] }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Pano", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu", label: "Menü", icon: UtensilsCrossed },
  { to: "/admin/kartlar", label: "Kartlar", icon: LayoutGrid },
  { to: "/admin/program", label: "Haftalık Program", icon: CalendarDays },
  { to: "/admin/sarkilar", label: "Şarkılar", icon: Music },
  { to: "/admin/calan", label: "Çalan", icon: Radio },
  { to: "/admin/degerlendirmeler", label: "Değerlendirmeler", icon: Star },
  { to: "/admin/sosyal-medya", label: "Sosyal Medya Deposu", icon: Images },
];

type ExternalNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const externalNavItems: ExternalNavItem[] = [
  { href: CLARITY_URL, label: "Clarity", icon: BarChart3 },
  { href: SEARCH_CONSOLE_URL, label: "Search Console", icon: Search },
];

function AdminLayout() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    adminApi
      .getSession()
      .then(({ authenticated }) => setAuthenticated(authenticated))
      .catch(() => setAuthenticated(false))
      .finally(() => setChecking(false));
  }, []);

  const logout = async () => {
    await adminApi.logout();
    setAuthenticated(false);
    setPassword("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const result = await adminApi.login(password);
      setAuthenticated(result.authenticated);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm">
        Yükleniyor…
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-script text-2xl text-gradient-gold mb-1">admin only</p>
            <h1 className="font-display text-3xl text-foreground">Yönetim Girişi</h1>
            <p className="text-xs text-muted-foreground mt-2">
              Panele girmek için sadece admin parolasını yaz.
            </p>
          </div>

          <form onSubmit={submit} className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <LockKeyhole className="h-5 w-5" />
              </div>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin parolası"
              className="w-full bg-input/60 border border-border rounded-full px-5 py-3 text-sm focus:border-gold focus:outline-none"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={submitting || !password}
              className="w-full bg-gold text-gold-foreground rounded-full py-3.5 text-sm font-medium shadow-gold disabled:opacity-50 active:scale-[0.98] transition"
            >
              {submitting ? "..." : "Panele Gir"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border/40">
        <SidebarContent location={location} logout={logout} />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 z-50 bg-card border-r border-border/40">
            <SidebarContent
              location={location}
              logout={logout}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 px-6 h-14 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 text-foreground/70"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs text-muted-foreground">
              {navItems.find((it) =>
                it.exact ? location.pathname === it.to : location.pathname.startsWith(it.to),
              )?.label ?? "Pano"}
            </p>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-full border border-border hover:text-foreground transition"
          >
            <LogOut className="h-3.5 w-3.5" /> Çıkış
          </button>
        </header>

        <main className="p-6 max-w-6xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  location,
  logout,
  onClose,
}: {
  location: { pathname: string };
  logout: () => Promise<void>;
  onClose?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-border/40">
        <Link to="/admin" onClick={onClose}>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">Yönetim</p>
          <p className="font-display text-lg text-foreground">Dragoman Bahçe</p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((it) => {
          const active = it.exact
            ? location.pathname === it.to
            : location.pathname.startsWith(it.to) && it.to !== "/admin";
          return (
            <Link
              key={it.to}
              to={it.to}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active
                  ? "bg-gold/15 text-gold font-medium"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/5"
              }`}
            >
              <it.icon className="h-4.5 w-4.5" />
              {it.label}
            </Link>
          );
        })}

        <p className="px-3 pt-4 pb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Raporlar
        </p>
        {externalNavItems.map((it) => (
          <a
            key={it.href}
            href={it.href}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/60 hover:text-foreground hover:bg-white/5 transition"
          >
            <it.icon className="h-4.5 w-4.5" />
            <span className="flex-1">{it.label}</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-50" />
          </a>
        ))}
      </nav>

      <div className="px-3 pb-4">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-foreground/50 hover:text-foreground hover:bg-white/5 transition"
        >
          <X className="h-4 w-4" />
          Siteye Dön
        </Link>
      </div>
    </div>
  );
}
