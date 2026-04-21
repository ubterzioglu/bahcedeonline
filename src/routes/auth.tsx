import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Yönetim Girişi — Dragoman Bahçe" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate({ to: "/admin", replace: true });
  }, [navigate]);

  return (
    <div className="px-5 pt-16 text-center">
      <div className="glass-card rounded-2xl p-8 space-y-3">
        <h1 className="font-display text-2xl text-foreground">Yönetim girişi taşındı</h1>
        <p className="text-sm text-muted-foreground">Admin paneli artık doğrudan <span className="text-gold">/admin</span> adresinden açılıyor.</p>
        <div className="pt-2">
          <Link to="/admin" className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-3 text-sm text-gold-foreground shadow-gold">
            /admin'e git
          </Link>
        </div>
      </div>
    </div>
  );
}
