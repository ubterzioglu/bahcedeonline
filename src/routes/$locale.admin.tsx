import { createFileRoute, Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, LogOut, Music, Radio, Users, UtensilsCrossed } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
    if (!loading && !user) {
      navigate({ to: "/$locale/auth", params: { locale } });
    }
  }, [loading, user, locale, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-sm text-muted-foreground">
        {dictionary.common.loading}
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!isStaff) {
    return (
      <div className="px-4 py-20 text-center sm:px-6">
        <h2 className="mb-2 font-display text-2xl text-foreground">
          {dictionary.common.unauthorized}
        </h2>
        <p className="text-sm text-muted-foreground">{dictionary.adminPage.accessDenied}</p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/$locale", params: { locale } });
          }}
          className="mt-5 border-b border-gold/40 text-sm text-gold"
        >
          {dictionary.nav.signOut}
        </button>
      </div>
    );
  }

  const visibleNav = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <div className="pt-2">
      <div className="flex items-center justify-between gap-3 px-4 pb-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.3em] text-gold">
            {dictionary.nav.adminLabel}
          </p>
          <p className="max-w-[200px] truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/$locale", params: { locale } });
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs text-foreground/70"
        >
          <LogOut className="h-3.5 w-3.5" />
          {dictionary.nav.signOut}
        </button>
      </div>

      <div className="sticky top-16 z-30 border-y border-border/40 bg-background/90 backdrop-blur-xl">
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex min-w-max px-2 sm:px-3">
            {visibleNav.map((item) => {
              const active = item.exact
                ? location.pathname === `/${locale}/admin`
                : location.pathname.startsWith(`/${locale}${item.to.replace("/$locale", "")}`);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  params={{ locale }}
                  className={`flex min-h-14 min-w-[72px] flex-col items-center justify-center gap-1 border-b-2 px-3 py-3 text-[11px] transition ${
                    active ? "border-gold text-gold" : "border-transparent text-foreground/60"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-center">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 sm:px-5">
        <Outlet />
      </div>
    </div>
  );
}
