import logo from "@/assets/logo.png";
import { Instagram, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border/40 bg-card/40">
      <div className="px-6 py-10 space-y-8">
        <div className="text-center">
          <img src={logo} alt="Dragoman Bahçe" className="h-14 w-auto mx-auto mb-3" />
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Kaş'ın kalbinde; serin bir bahçe ve özenli kokteyller.
          </p>
        </div>
        <div className="space-y-3 text-sm text-foreground/80 max-w-xs mx-auto">
          <p className="flex items-center gap-3"><MapPin className="h-4 w-4 text-primary shrink-0" /> Kaş, Antalya</p>
          <p className="flex items-center gap-3"><Phone className="h-4 w-4 text-primary shrink-0" /> +90 ___ ___ __ __</p>
          <p className="flex items-center gap-3"><Instagram className="h-4 w-4 text-primary shrink-0" /> @dragomanbahce</p>
          <p className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="text-gold uppercase tracking-widest text-[10px]">Açık</span>
            Her gün · 17:00 — 02:00
          </p>
        </div>
      </div>
      <div className="border-t border-border/30 py-4 text-center text-[10px] text-muted-foreground tracking-wider">
        © {new Date().getFullYear()} DRAGOMAN BAHÇE
      </div>
    </footer>
  );
}
