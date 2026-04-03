import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import { apiRequest } from "@/lib/queryClient";
import type { Installer } from "@shared/schema";
import InstallerCard from "@/components/InstallerCard";
import { ArrowLeft, ArrowRight, FileText, Star, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const { lang, dir } = useLang();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const { data: allInstallers } = useQuery<Installer[]>({
    queryKey: ["/api/installers"],
  });

  const { data: featured, isLoading } = useQuery<Installer[]>({
    queryKey: ["/api/installers/featured"],
  });

  const totalMW = allInstallers
    ? (allInstallers.reduce((s, i) => s + i.installedPowerKw, 0) / 1000).toFixed(1)
    : "—";
  const totalStations = allInstallers
    ? allInstallers.reduce((s, i) => s + i.stationsCount, 0)
    : 0;
  const totalInstallers = allInstallers?.length ?? "—";

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-28 px-4 md:px-6">
        <div className="container mx-auto max-w-3xl text-center md:text-start">
          <p className="text-xs font-medium uppercase tracking-widest text-primary mb-4 opacity-80">
            {tr("siteTagline", lang)}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5 max-w-2xl">
            {tr("heroTitle", lang)}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-8 leading-relaxed">
            {tr("heroSubtitle", lang)}
          </p>
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
            data-testid="hero-cta"
          >
            {tr("heroCTA", lang)}
            <ArrowIcon size={16} />
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border/60 bg-muted/40">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto text-center">
            <StatItem value={totalInstallers.toString()} label={tr("statsInstallers", lang)} />
            <StatItem value={`${totalMW}`} label={tr("statsMW", lang)} />
            <StatItem value={totalStations.toLocaleString()} label={tr("statsStations", lang)} />
          </div>
        </div>
      </section>

      {/* Featured Installers */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-foreground">
              {tr("featuredTitle", lang)}
            </h2>
            <Link
              href="/directory"
              className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 font-medium"
            >
              {tr("heroCTA", lang)} <ArrowIcon size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured?.map((installer) => (
                <InstallerCard key={installer.id} installer={installer} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 md:px-6 bg-muted/30 border-t border-border/40">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-10 text-center">
            {tr("howWorksTitle", lang)}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <HowStep
              icon={<FileText size={18} />}
              title={tr("howStep1Title", lang)}
              desc={tr("howStep1Desc", lang)}
            />
            <HowStep
              icon={<Star size={18} />}
              title={tr("howStep2Title", lang)}
              desc={tr("howStep2Desc", lang)}
            />
            <HowStep
              icon={<RefreshCw size={18} />}
              title={tr("howStep3Title", lang)}
              desc={tr("howStep3Desc", lang)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </div>
  );
}

function HowStep({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}
