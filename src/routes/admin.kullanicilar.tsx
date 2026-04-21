import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/kullanicilar")({
  component: Users,
});

function Users() {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      <h1 className="font-display text-xl mb-1">Personel girişi kaldırıldı</h1>
      <p className="text-xs text-muted-foreground">
        Yönetim paneli artık sadece <span className="text-gold">/admin</span> altında tek parola ile açılıyor.
      </p>
    </div>
  );
}
