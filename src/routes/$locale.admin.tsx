import { createFileRoute, Link, Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, UtensilsCrossed, Music, Radio, Users, LogOut } from "lucide-react";
import { useEffect } from "react";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/admin")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));
    return { meta: [{ title: dictionary.adminPage.title }] };
  },
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  adminOnly?: boolean;
};

function AdminLayout() {
  const { locale, dictionary } = useI18n();
  const { user, isAdmin, isStaff, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      to: "/$locale/admin",
      label: dictionary.adminPage.dashboard,
      icon: LayoutDashboard,
      exact: true,
    },
    { to: "/$locale/admin/menu", label: dictionary.adminPage.menu, icon: UtensilsCrossed },
    { to: "/$locale/admin/sarkilar", label: dictionary.adminPage.songs, icon: Music },
    { to: "/$locale/admin/calan", label: dictionary.adminPage.nowPlaying, icon: Radio },
    {
      to: "/$locale/admin/kullanicilar",
      label: dictionary.adminPage.users,
      icon: Users,
      adminOnly: true,
    },
  ];

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/$locale/auth", params: { locale } });
  }, [loading, user, locale, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground text-sm">
        {dictionary.common.loading}
      </div>
    );
  }
  if (!user) return null;
  if (!isStaff) {
    return (
      <div className="px-6 text-center py-20">
        <h2 className="font-display text-2xl text-foreground mb-2">
          {dictionary.common.unauthorized}
        </h2>
        <p className="text-sm text-muted-foreground">{dictionary.adminPage.accessDenied}</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/$locale", params: { locale } });
          }}
          className="mt-5 text-gold border-b border-gold/40 text-sm"
        >
          {dictionary.nav.signOut}
        </button>
      </div>
    );
  }

  const visibleNav = navItems.filter((it) => !it.adminOnly || isAdmin);

  return (
    <div className="pt-2">
      <div className="px-5 pb-3 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">
            {dictionary.nav.adminLabel}
          </p>
          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/$locale", params: { locale } });
          }}
          className="inline-flex items-center gap-1.5 text-xs text-foreground/70 px-3 py-1.5 rounded-full border border-border"
        >
          <LogOut className="h-3.5 w-3.5" /> {dictionary.nav.signOut}
        </button>
      </div>

      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-y border-border/40">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max px-3">
            {visibleNav.map((it) => {
              const active = it.exact
                ? location.pathname === `/${locale}/admin`
                : location.pathname.startsWith(`/${locale}${it.to.replace("/$locale", "")}`);
              return (
                <Link
                  key={it.to}
                  to={it.to}
                  params={{ locale }}
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
