import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, UtensilsCrossed, Music, Radio, LogOut, LockKeyhole } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";

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
  { to: "/admin/sarkilar", label: "Şarkılar", icon: Music },
  { to: "/admin/calan", label: "Çalan", icon: Radio },
];

function AdminLayout() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
        Yükleniyor…
      </div>
    );
  }
  if (!authenticated) {
    return (
      <div className="px-5 pt-12">
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
    );
  }

  return (
    <div className="pt-2">
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">Yönetim</p>
          <p className="text-xs text-muted-foreground truncate max-w-[220px]">
            Parola ile korumalı admin paneli
          </p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-full border border-border"
        >
          <LogOut className="h-3.5 w-3.5" /> Çıkış
        </button>
      </div>

      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-y border-border/40">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max px-3">
            {navItems.map((it) => {
              const active = it.exact
                ? location.pathname === it.to
                : location.pathname.startsWith(it.to) && it.to !== "/admin";
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex flex-col items-center gap-1 px-4 py-3 text-[11px] border-b-2 transition ${
                    active ? "border-gold text-gold" : "border-transparent text-foreground/60"
                  }`}
                >
                  <it.icon className="h-4 w-4" />
                  {it.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-5 pt-6">
        <Outlet />
      </div>
    </div>
  );
}
