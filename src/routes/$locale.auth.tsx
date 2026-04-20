import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDictionary, getLocaleFromUnknown, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/$locale/auth")({
  head: ({ params }) => {
    const dictionary = getDictionary(getLocaleFromUnknown(params.locale));
    return { meta: [{ title: dictionary.authPage.title }] };
  },
  component: AuthPage,
});

function AuthPage() {
  const { locale, dictionary } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/$locale/admin", params: { locale } });
      }
    });
  }, [locale, navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === "signup") {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/${locale}/admin`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
      } else {
        navigate({ to: "/$locale/admin", params: { locale } });
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(dictionary.authPage.invalidCredentials);
      } else {
        navigate({ to: "/$locale/admin", params: { locale } });
      }
    }

    setLoading(false);
  };

  return (
    <div className="px-4 pt-10 sm:px-5 sm:pt-12">
      <div className="mb-8 text-center">
        <p className="mb-1 font-script text-2xl text-gradient-gold">{dictionary.nav.staffOnly}</p>
        <h1 className="font-display text-3xl text-foreground">{dictionary.authPage.heading}</h1>
        <p className="mt-2 text-xs text-muted-foreground">
          {mode === "signin" ? dictionary.authPage.welcomeBack : dictionary.authPage.signupIntro}
        </p>
      </div>

      <form onSubmit={submit} className="glass-card space-y-4 rounded-2xl p-5">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={dictionary.authPage.email}
          className="w-full rounded-full border border-border bg-input/60 px-5 py-3 text-sm focus:border-gold focus:outline-none"
        />
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder={dictionary.authPage.password}
          className="w-full rounded-full border border-border bg-input/60 px-5 py-3 text-sm focus:border-gold focus:outline-none"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-gold py-3.5 text-sm font-medium text-gold-foreground shadow-gold transition active:scale-[0.98] disabled:opacity-50"
        >
          {loading
            ? "..."
            : mode === "signin"
              ? dictionary.authPage.signIn
              : dictionary.authPage.signUp}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-muted-foreground">
        {mode === "signin" ? (
          <>
            {dictionary.authPage.noAccount}{" "}
            <button onClick={() => setMode("signup")} className="text-gold">
              {dictionary.authPage.switchToSignup}
            </button>
          </>
        ) : (
          <>
            {dictionary.authPage.hasAccount}{" "}
            <button onClick={() => setMode("signin")} className="text-gold">
              {dictionary.authPage.switchToSignin}
            </button>
          </>
        )}
      </div>

      <p className="mt-4 px-6 text-center text-[10px] text-muted-foreground/70">
        {dictionary.authPage.firstUserAdmin}
      </p>

      <div className="mt-5 text-center">
        <Link to="/$locale" params={{ locale }} className="text-xs text-muted-foreground">
          ← {dictionary.authPage.backHome}
        </Link>
      </div>
    </div>
  );
}
