import { Link } from "@tanstack/react-router";
import logo from "../../hopdeneme.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="px-5 flex h-28 items-center justify-center">
        <Link to="/" className="flex items-center justify-center">
          <img src={logo} alt="Dragoman Bahçe" className="h-24 w-auto" />
        </Link>
      </div>
    </header>
  );
}
