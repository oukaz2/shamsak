import { Link } from "wouter";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { Installer } from "@shared/schema";
import { MapPin, Zap, Building2, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InstallerCardProps {
  installer: Installer;
  compact?: boolean;
}

export default function InstallerCard({ installer, compact = false }: InstallerCardProps) {
  const { lang, dir } = useLang();
  const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

  const name = lang === "ar" ? installer.nameAr : (installer.nameEn || installer.nameAr);
  const description = lang === "ar" ? installer.descriptionAr : (installer.descriptionEn || installer.descriptionAr);
  const categoryLabel = installer.publicCategory === "up_to_500kw"
    ? tr("categoryUpTo500", lang)
    : tr("categoryAbove500", lang);

  return (
    <div
      className={cn(
        "group bg-card border border-border rounded-xl p-5 card-lift cursor-pointer",
        installer.featured && "ring-1 ring-brand/20"
      )}
      data-testid={`installer-card-${installer.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          {installer.featured && (
            <Badge variant="secondary" className="mb-2 text-xs font-medium bg-accent text-primary border-0">
              {tr("featured", lang)}
            </Badge>
          )}
          <h3 className="font-semibold text-sm leading-snug text-foreground line-clamp-2">
            {lang === "ar" ? installer.nameAr : (installer.nameEn || installer.nameAr)}
          </h3>
          {lang === "ar" && installer.nameEn && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{installer.nameEn}</p>
          )}
          {lang === "en" && installer.nameEn && installer.nameEn !== installer.nameAr && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1" dir="rtl">{installer.nameAr}</p>
          )}
        </div>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 text-xs whitespace-nowrap",
            installer.publicCategory === "above_500kw"
              ? "border-primary/30 text-primary bg-accent/50"
              : "border-border text-muted-foreground"
          )}
        >
          {categoryLabel}
        </Badge>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Building2 size={13} className="text-primary/60" />
          {installer.stationsCount} {tr("stations", lang)}
        </span>
        <span className="flex items-center gap-1">
          <Zap size={13} className="text-primary/60" />
          {installer.installedPowerDisplay || `${Math.round(installer.installedPowerKw)} kW`}
        </span>
        {installer.location && (
          <span className="flex items-center gap-1 hidden sm:flex">
            <MapPin size={13} className="text-primary/60" />
            {installer.location}
          </span>
        )}
      </div>

      {/* Description */}
      {!compact && description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {description}
        </p>
      )}

      {/* CTA */}
      <Link
        href={`/installer/${installer.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group-hover:gap-2"
        data-testid={`view-profile-${installer.id}`}
      >
        {tr("viewProfile", lang)}
        <ArrowIcon size={13} className="transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
      </Link>
    </div>
  );
}
