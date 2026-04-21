import logo from "@/assets/logo.png";
import { Facebook, Instagram, Mail, MapPin, MessageCircleMore, Phone, Star } from "lucide-react";

const links = {
  instagram: "https://www.instagram.com/dragomanbahce",
  facebook: "https://www.facebook.com/dragomanbahce",
  whatsapp: "https://wa.me/905344325334",
  phone: "tel:+905344325334",
  email: "mailto:dragoman@bahcede.online",
  tripadvisor:
    "https://www.tripadvisor.com/Restaurant_Review-g297965-d14584671-Reviews-Dragoman_Bahce-Kas_Turkish_Mediterranean_Coast.html",
  maps:
    "https://www.google.com/maps/place/Dragoman+Bah%C3%A7e/@36.1997208,29.6393923,17z/data=!3m1!4b1!4m6!3m5!1s0x14c1db5e26b95e2d:0xa14572d48954193!8m2!3d36.1997208!4d29.6419672!16s%2Fg%2F11f62s05yd?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D",
};

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 bg-card/40">
      <div className="px-6 py-10 space-y-6">
        <div className="text-center">
          <img src={logo} alt="Dragoman Bahçe" className="h-14 w-auto mx-auto" />
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <SocialIcon href={links.instagram} label="Instagram" icon={Instagram} />
          <SocialIcon href={links.facebook} label="Facebook" icon={Facebook} />
          <SocialIcon href={links.whatsapp} label="WhatsApp" icon={MessageCircleMore} />
          <SocialIcon href={links.phone} label="Telefon" icon={Phone} />
          <SocialIcon href={links.email} label="E-posta" icon={Mail} />
          <SocialIcon href={links.tripadvisor} label="Tripadvisor" icon={Star} />
          <SocialIcon href={links.maps} label="Harita" icon={MapPin} />
        </div>
      </div>
      <div className="border-t border-border/30 py-4 text-center text-[10px] text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} DRAGOMAN BAHÇE
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
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/70 text-foreground/75 transition hover:border-gold/50 hover:text-gold"
    >
      <Icon className="h-4.5 w-4.5" />
    </a>
  );
}
