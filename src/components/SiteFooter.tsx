import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { LanguageToggle } from "@/components/LanguageToggle";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function TripadvisorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M12.006 4.295c-2.67 0-5.338.784-7.645 2.353H0L1.963 8.78a5.65 5.65 0 003.862 9.777 5.62 5.62 0 003.743-1.432l1.92 2.09 1.921-2.09a5.623 5.623 0 003.742 1.432 5.65 5.65 0 005.65-5.646 5.62 5.62 0 00-1.788-4.13L23.973 6.65h-4.322a13.603 13.603 0 00-7.645-2.354zm-.005 1.952a12.369 12.369 0 015.265 1.17 7.28 7.28 0 00-5.267 7.009 7.28 7.28 0 00-5.27-7.009c1.692-.771 3.49-1.17 5.272-1.17zm-6.176 4.218a3.695 3.695 0 013.697 3.694 3.693 3.693 0 11-7.387 0 3.695 3.695 0 013.69-3.694zm12.355 0a3.695 3.695 0 013.691 3.694 3.693 3.693 0 11-7.385 0 3.695 3.695 0 013.694-3.694zm-12.355 1.756a1.938 1.938 0 00-1.94 1.938 1.94 1.94 0 103.878 0 1.938 1.938 0 00-1.938-1.938zm12.355 0a1.938 1.938 0 00-1.937 1.938 1.94 1.94 0 103.878 0 1.938 1.938 0 00-1.94-1.938Z" />
    </svg>
  );
}

const links = {
  instagram: "https://www.instagram.com/dragomanbahce",
  facebook: "https://www.facebook.com/dragomanbahce",
  whatsapp: "https://wa.me/905344325334",
  phone: "tel:+905344325334",
  email: "mailto:dragoman@bahcede.online",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g297965-d14584671-Reviews-Dragoman_Bahce-Kas_Turkish_Mediterranean_Coast.html",
  maps: "https://www.google.com/maps/place/Dragoman+Bah%C3%A7e/@36.1997208,29.6393923,17z/data=!3m1!4b1!4m6!3m5!1s0x14c1db5e26b95e2d:0xa14572d48954193!8m2!3d36.1997208!4d29.6419672!16s%2Fg%2F11f62s05yd?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D",
};

export function SiteFooter() {
  const { t } = useTranslation();
  return (
    <footer className="mt-6 border-t border-border/40 bg-card/40 pb-8">
      <div className="px-6 pt-5 pb-3">
        <LanguageToggle variant="footer" />
      </div>
      <p className="text-center text-[11px] font-medium tracking-[0.15em] text-foreground/50 px-6 pb-2">
        {t("footer.contact")}
      </p>
      <div className="flex justify-center gap-3 px-6 pb-1">
        <SocialIcon href={links.instagram} label="Instagram" icon={Instagram} />
        <SocialIcon href={links.facebook} label="Facebook" icon={Facebook} />
        <SocialIcon href={links.whatsapp} label="WhatsApp" icon={WhatsAppIcon} />
        <SocialIcon href={links.phone} label="Telefon" icon={Phone} />
        <SocialIcon href={links.email} label="E-posta" icon={Mail} />
        <SocialIcon href={links.tripadvisor} label="Tripadvisor" icon={TripadvisorIcon} />
        <SocialIcon href={links.maps} label="Harita" icon={MapPin} />
      </div>
      <div className="border-t border-border/30 px-6 py-2 text-center text-[9px] leading-snug text-muted-foreground">
        <p>
          Dragoman Bahçe {new Date().getFullYear()} © · {t("footer.credit.designedBy")}{" "}
          <a
            href="https://ubterzioglu.de/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition hover:text-gold"
          >
            UBT
          </a>{" "}
          {t("footer.credit.withLove")} · {t("footer.credit.poweredBy")}{" "}
          <a
            href="https://corteqs.net/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition hover:text-gold"
          >
            CorteQS
          </a>
        </p>
        <p className="site-footer-credit text-[0.82rem] leading-[1.6] sm:text-base sm:leading-[1.55]">
          <a
            href="https://www.spindorai.com/seo/seo-calismasi"
            rel="dofollow"
            className="site-footer-credit-link text-foreground/80 transition hover:text-gold"
          >
            SEO
          </a>{" "}
          Spindora ·{" "}
          <a
            href="https://aryateknoloji.com"
            rel="dofollow"
            className="site-footer-credit-link text-foreground/80 transition hover:text-gold"
          >
            Arya Teknoloji
          </a>{" "}
          ·{" "}
          <a
            href="https://ufuksoynakliyat.com.tr"
            rel="dofollow"
            className="site-footer-credit-link text-foreground/80 transition hover:text-gold"
          >
            Evden Eve Nakliyat
          </a>{" "}
          Ufuksoy Nakliyat A.Ş ·{" "}
          <a
            href="https://tekhurdametal.com/istanbul-hurdaci/"
            rel="dofollow"
            className="site-footer-credit-link text-foreground/80 transition hover:text-gold"
          >
            İstanbul Hurdacı
          </a>{" "}
          Firması Tek Hurda Metal A.Ş
          {" · "}
          <a
            href="https://lionerotik.com/urunler/fetis-urunleri"
            rel="dofollow"
            className="site-footer-credit-link text-foreground/80 transition hover:text-gold"
          >
            Antalya Sex Shop
          </a>{" "}
          Lion Erotik
        </p>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-background/72 text-foreground/80 shadow-[0_0_24px_rgba(255,255,255,0.16)] transition hover:border-gold/50 hover:text-gold hover:shadow-[0_0_30px_rgba(255,255,255,0.22)]"
    >
      <Icon className="h-4.5 w-4.5" />
    </a>
  );
}
