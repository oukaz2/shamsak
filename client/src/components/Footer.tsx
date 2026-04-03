import { Link } from "wouter";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";

export default function Footer() {
  const { lang } = useLang();

  return (
    <footer className="border-t border-border/60 bg-background mt-16">
      <div className="container mx-auto px-4 md:px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-2">
            <p className="font-semibold text-sm text-foreground">{tr("siteName", lang)}</p>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              {tr("footerDisclaimer", lang)}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
              {tr("navAbout", lang)}
            </Link>
            <Link href="/directory" className="text-muted-foreground hover:text-foreground transition-colors">
              {tr("navDirectory", lang)}
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {tr("siteName", lang)} — {tr("footerRights", lang)}
          </p>
        </div>
      </div>
    </footer>
  );
}
