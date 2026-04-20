import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Personel Girişi — Dragoman Bahçe" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) setError(error.message);
      else navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError("E-posta veya şifre hatalı.");
      else navigate({ to: "/admin" });
    }
    setLoading(false);
  };

  return (
    <div className="px-5 pt-12">
      <div className="text-center mb-8">
        <p className="font-script text-2xl text-gradient-gold mb-1">staff only</p>
        <h1 className="font-display text-3xl text-foreground">Personel Girişi</h1>
        <p className="text-xs text-muted-foreground mt-2">
          {mode === "signin" ? "Hoş geldin." : "Yeni hesap oluştur."}
        </p>
      </div>

      <form onSubmit={submit} className="glass-card rounded-2xl p-5 space-y-4">
        <input
          type="email" required value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta"
          className="w-full bg-input/60 border border-border rounded-full px-5 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <input
          type="password" required minLength={6} value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Şifre (en az 6 karakter)"
          className="w-full bg-input/60 border border-border rounded-full px-5 py-3 text-sm focus:border-gold focus:outline-none"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit" disabled={loading}
          className="w-full bg-gold text-gold-foreground rounded-full py-3.5 text-sm font-medium shadow-gold disabled:opacity-50 active:scale-[0.98] transition"
        >
          {loading ? "..." : mode === "signin" ? "Giriş Yap" : "Hesap Oluştur"}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-muted-foreground">
        {mode === "signin" ? (
          <>Hesabın yok mu?{" "}<button onClick={() => setMode("signup")} className="text-gold">Kaydol</button></>
        ) : (
          <>Hesabın var mı?{" "}<button onClick={() => setMode("signin")} className="text-gold">Giriş Yap</button></>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground/70 mt-4 text-center px-6">
        İlk kayıt olan kullanıcı otomatik <span className="text-gold">admin</span> olur.
      </p>
      <div className="text-center mt-5">
        <Link to="/" className="text-xs text-muted-foreground">← Anasayfa</Link>
      </div>
    </div>
  );
}
