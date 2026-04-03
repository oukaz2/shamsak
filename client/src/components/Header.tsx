import { Link, useLocation } from "wouter";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Sun, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { lang, setLang, dir } = useLang();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/directory", label: tr("navDirectory", lang) },
    { href: "/about", label: tr("navAbout", lang) },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <ShamsakLogo />
          <span className="font-semibold text-base text-foreground tracking-tight" data-testid="site-name">
            {tr("siteName", lang)}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6" dir={dir}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                location === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Lang toggle */}
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md border border-border/60 hover:border-border transition-colors"
            data-testid="lang-toggle"
          >
            {tr("langToggle", lang)}
          </button>

          {/* Mobile menu */}
          <button
            className="md:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background px-4 pb-4 pt-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function ShamsakLogo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Shamsak logo"
    >
      {/* Sun circle */}
      <circle cx="14" cy="14" r="5" fill="hsl(183, 97%, 22%)" />
      {/* Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 14 + 7 * Math.cos(rad);
        const y1 = 14 + 7 * Math.sin(rad);
        const x2 = 14 + 11 * Math.cos(rad);
        const y2 = 14 + 11 * Math.sin(rad);
        return (
          <line
            key={i}
            x1={x1.toFixed(1)}
            y1={y1.toFixed(1)}
            x2={x2.toFixed(1)}
            y2={y2.toFixed(1)}
            stroke="hsl(183, 97%, 22%)"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
