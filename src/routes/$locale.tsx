import { BottomNav } from "@/components/BottomNav";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-background relative shadow-elegant">
      <SiteHeader />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <SiteFooter />
      <BottomNav />
    </div>
  );
}
