import { Facebook, Instagram, Mail, MapPin, MessageCircleMore, Phone, Star } from "lucide-react";

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
  return (
    <footer className="mt-6 border-t border-border/40 bg-card/40 pb-8">
      <div className="px-6 pt-5 pb-1 space-y-2">
        <div className="text-center">
          <p className="text-[11px] font-medium tracking-[0.24em] text-foreground/45 uppercase">
            İletişim & Sosyal Medya
          </p>
        </div>
        <div className="grid grid-cols-4 gap-3 px-1">
          <SocialIcon href={links.instagram} label="Instagram" icon={Instagram} />
          <SocialIcon href={links.facebook} label="Facebook" icon={Facebook} />
          <SocialIcon href={links.whatsapp} label="WhatsApp" icon={MessageCircleMore} />
          <SocialIcon href={links.phone} label="Telefon" icon={Phone} />
          <SocialIcon href={links.email} label="E-posta" icon={Mail} />
          <SocialIcon href={links.tripadvisor} label="Tripadvisor" icon={Star} />
          <SocialIcon href={links.maps} label="Harita" icon={MapPin} />
        </div>
      </div>
      <div className="border-t border-border/30 px-6 py-2 text-center text-[9px] leading-tight text-muted-foreground">
        <p>
          Dragoman Bahçe {new Date().getFullYear()} © · Footer designed by{" "}
          <a
            href="https://ubterzioglu.de/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition hover:text-gold"
          >
            UBT
          </a>{" "}
          with Love · SEO&amp;GEO by{" "}
          <a
            href="https://www.spindorai.com/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition hover:text-gold"
          >
            Spindora
          </a>{" "}
          · Powered by{" "}
          <a
            href="https://corteqs.net/"
            target="_blank"
            rel="noreferrer"
            className="text-foreground/80 transition hover:text-gold"
          >
            CorteQS
          </a>
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
