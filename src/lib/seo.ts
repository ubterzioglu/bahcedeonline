const SITE_URL = "https://bahcede.online";

type PageLocale = "tr" | "en";

/**
 * `trPath` is the canonical TR path (e.g. "/", "/menu"). The EN path is always
 * `/en` + trPath (with "/en" + "/" collapsed to "/en/"), matching the route
 * file naming convention (en.menu.tsx, en.index.tsx, ...).
 */
export function seoLinks(trPath: string, locale: PageLocale) {
  const enPath = trPath === "/" ? "/en/" : `/en${trPath}`;
  const current = locale === "tr" ? trPath : enPath;

  return [
    { rel: "canonical", href: `${SITE_URL}${current}` },
    { rel: "alternate", hreflang: "tr", href: `${SITE_URL}${trPath}` },
    { rel: "alternate", hreflang: "en", href: `${SITE_URL}${enPath}` },
    { rel: "alternate", hreflang: "x-default", href: `${SITE_URL}${trPath}` },
  ];
}

export function seoLocaleMeta(locale: PageLocale) {
  return [{ property: "og:locale", content: locale === "tr" ? "tr_TR" : "en_US" }];
}

type MenuSection = { name: string; description: string };

/**
 * Category-level Menu schema (no per-item pricing). Item data loads
 * client-side from Supabase, so a full schema.org Menu with MenuItem
 * entries would require a server-side loader for this route.
 */
export function menuSchema(locale: PageLocale, sections: MenuSection[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Menu",
      name: locale === "tr" ? "Dragoman Bahçe Menüsü" : "Dragoman Bahçe Menu",
      inLanguage: locale,
      hasMenuSection: sections.map((section) => ({
        "@type": "MenuSection",
        name: section.name,
        description: section.description,
      })),
    }),
  };
}
