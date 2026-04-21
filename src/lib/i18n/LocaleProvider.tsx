import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "@tanstack/react-router";
import { tr, type TranslationKey } from "./dictionaries/tr";
import { en } from "./dictionaries/en";
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES, type Locale } from "./types";

const dictionaries: Record<Locale, typeof tr> = { tr, en };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: TranslationKey) => string;
  localize: (path: string) => string;
  stripLocale: (path: string) => string;
};

export const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(x: string | undefined): x is Locale {
  return !!x && (LOCALES as string[]).includes(x);
}

function parseLocaleFromPath(pathname: string): Locale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return isLocale(first) ? first : null;
}

function readCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${LOCALE_COOKIE}=`));
  if (!match) return null;
  const val = decodeURIComponent(match.slice(LOCALE_COOKIE.length + 1));
  return isLocale(val) ? val : null;
}

function writeCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathLocale = parseLocaleFromPath(location.pathname);

  const [stored, setStored] = useState<Locale>(() => {
    // SSR-safe: URL prefix takes priority, then cookie, then default
    if (pathLocale) return pathLocale;
    const cookie = readCookie();
    return cookie ?? DEFAULT_LOCALE;
  });

  const locale: Locale = pathLocale ?? stored;

  useEffect(() => {
    // Sync cookie whenever active locale changes
    writeCookie(locale);
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback(
    (next: Locale) => {
      setStored(next);
      writeCookie(next);
      if (typeof window === "undefined") return;
      const { pathname, search, hash } = window.location;
      const stripped = pathname.replace(/^\/(tr|en)(?=\/|$)/, "") || "/";
      const nextPath = next === DEFAULT_LOCALE ? stripped : `/${next}${stripped === "/" ? "" : stripped}`;
      const target = `${nextPath}${search}${hash}`;
      if (target !== pathname + search + hash) {
        window.location.assign(target || "/");
      }
    },
    [],
  );

  const t = useCallback(
    (key: TranslationKey) => {
      const dict = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
      return dict[key] ?? dictionaries[DEFAULT_LOCALE][key] ?? key;
    },
    [locale],
  );

  const localize = useCallback(
    (path: string) => {
      if (locale === DEFAULT_LOCALE) return path;
      if (path.startsWith("http") || path.startsWith("#") || path.startsWith("mailto:") || path.startsWith("tel:")) {
        return path;
      }
      const clean = path.startsWith("/") ? path : `/${path}`;
      if (clean === "/") return `/${locale}`;
      return `/${locale}${clean}`;
    },
    [locale],
  );

  const stripLocale = useCallback((path: string) => {
    return path.replace(/^\/(tr|en)(?=\/|$)/, "") || "/";
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, localize, stripLocale }),
    [locale, setLocale, t, localize, stripLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
