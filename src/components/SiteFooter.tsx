import logo from "@/assets/logo.png";
import { Instagram, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { dictionary } = useI18n();

  return (
    <footer className="mt-12 border-t border-border/40 bg-card/40">
      <div className="px-6 py-10 space-y-8">
        <div className="text-center">
          <img src={logo} alt={dictionary.brand.name} className="h-14 w-auto mx-auto mb-3" />
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            {dictionary.brand.footerTagline}
          </p>
        </div>
        <div className="space-y-3 text-sm text-foreground/80 max-w-xs mx-auto">
          <p className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-primary shrink-0" /> {dictionary.brand.location}
          </p>
          <p className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-primary shrink-0" /> {dictionary.brand.phone}
          </p>
          <p className="flex items-center gap-3">
            <Instagram className="h-4 w-4 text-primary shrink-0" /> {dictionary.brand.instagram}
          </p>
          <p className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="text-gold uppercase tracking-widest text-[10px]">
              {dictionary.common.active}
            </span>
            {dictionary.brand.hours}
          </p>
        </div>
      </div>
      <div className="border-t border-border/30 py-4 text-center text-[10px] text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} {dictionary.brand.name.toUpperCase()}
      </div>
    </footer>
  );
}
