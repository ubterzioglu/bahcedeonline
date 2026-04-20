import { Link } from "@tanstack/react-router";
import logo from "@/assets/boundries.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="px-5 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Dragoman Bahçe" className="h-9 w-auto" />
        </Link>
        <Link
          to="/admin"
          className="px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] rounded-full border border-gold/40 text-gold"
        >
          Personel
        </Link>
      </div>
    </header>
  );
}
