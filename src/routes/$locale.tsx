import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { createFileRoute, Outlet, redirect, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!isLocale(params.locale)) {
      throw redirect({
        to: "/$locale",
        params: { locale: DEFAULT_LOCALE },
      });
    }
  },
  component: LocaleLayout,
});

function LocaleLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("/admin");
  const isAuth = location.pathname.endsWith("/auth");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-screen-sm flex-col lg:max-w-5xl lg:px-6">
        <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden border-x border-border/30 bg-background/95 shadow-elegant">
          <SiteHeader />
          <main className={`flex-1 ${isAdmin || isAuth ? "pb-6" : "pb-24"} lg:pb-8`}>
            <Outlet />
          </main>
          {!isAdmin && <SiteFooter />}
          {!isAdmin && !isAuth && <BottomNav />}
        </div>
      </div>
    </div>
  );
}
