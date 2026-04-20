import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, UtensilsCrossed, Music, Radio, Users, LogOut } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Yönetim — Dragoman Bahçe" }] }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { to: "/admin", label: "Pano", icon: LayoutDashboard, exact: true },
  { to: "/admin/menu", label: "Menü", icon: UtensilsCrossed },
  { to: "/admin/sarkilar", label: "Şarkılar", icon: Music },
  { to: "/admin/calan", label: "Çalan", icon: Radio },
  { to: "/admin/kullanicilar", label: "Personel", icon: Users, adminOnly: true },
];

function AdminLayout() {
  const { user, isAdmin, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">Yükleniyor…</div>;
  }
  if (!user) return null;
  if (!isStaff) {
    return (
      <div className="px-6 text-center py-20">
        <h2 className="font-display text-2xl text-foreground mb-2">Yetkin yok</h2>
        <p className="text-sm text-muted-foreground">Hesabına henüz personel rolü verilmedi.</p>
        <button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }} className="mt-5 text-gold border-b border-gold/40 text-sm">Çıkış Yap</button>
      </div>
    );
  }

  const visibleNav = navItems.filter((it) => !it.adminOnly || isAdmin);

  return (
    <div className="pt-2">
      {/* Admin top bar */}
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">Yönetim</p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/" }); }}
          className="inline-flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-full border border-border"
        >
          <LogOut className="h-3.5 w-3.5" /> Çıkış
        </button>
      </div>

      {/* Sticky tabs */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-y border-border/40">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max px-3">
            {visibleNav.map((it) => {
              const active = it.exact
                ? location.pathname === it.to
                : location.pathname.startsWith(it.to) && it.to !== "/admin";
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  className={`flex flex-col items-center gap-1 px-4 py-3 text-[11px] border-b-2 transition ${
                    active
                      ? "border-gold text-gold"
                      : "border-transparent text-foreground/60"
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
