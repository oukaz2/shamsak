import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import type { Installer } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin, Zap, Building2, Phone, Mail, Globe, Facebook,
  ArrowLeft, ArrowRight, AlertCircle
} from "lucide-react";

export default function InstallerPage() {
  const { id } = useParams<{ id: string }>();
  const { lang, dir } = useLang();
  const BackIcon = dir === "rtl" ? ArrowRight : ArrowLeft;

  const { data: installer, isLoading, error } = useQuery<Installer>({
    queryKey: ["/api/installers", id],
    queryFn: async () => {
      const res = await fetch(`/api/installers/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) return <ProfileSkeleton />;
  if (error || !installer) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="text-muted-foreground text-sm">Installer not found</p>
      <Link href="/directory" className="text-primary text-sm mt-4 inline-block">← {tr("backToDirectory", lang)}</Link>
    </div>
  );

  const name = lang === "ar" ? installer.nameAr : (installer.nameEn || installer.nameAr);
  const description = lang === "ar" ? installer.descriptionAr : (installer.descriptionEn || installer.descriptionAr);
  const categoryLabel = installer.publicCategory === "up_to_500kw"
    ? tr("categoryUpTo500", lang)
    : tr("categoryAbove500", lang);

  const power = installer.installedPowerDisplay || `${Math.round(installer.installedPowerKw)} kW`;

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 max-w-3xl">
      {/* Back */}
      <Link
        href="/directory"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        data-testid="back-to-directory"
      >
        <BackIcon size={14} />
        {tr("backToDirectory", lang)}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            {installer.featured && (
              <Badge variant="secondary" className="mb-2 text-xs bg-accent text-primary border-0">
                {tr("featured", lang)}
              </Badge>
            )}
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              {lang === "ar" ? installer.nameAr : (installer.nameEn || installer.nameAr)}
            </h1>
            {lang === "ar" && installer.nameEn && (
              <p className="text-sm text-muted-foreground mt-1">{installer.nameEn}</p>
            )}
            {lang === "en" && installer.nameEn && (
              <p className="text-sm text-muted-foreground mt-1" dir="rtl">{installer.nameAr}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className={
              installer.publicCategory === "above_500kw"
                ? "border-primary/30 text-primary bg-accent/50 shrink-0 self-start mt-1"
                : "border-border text-muted-foreground shrink-0 self-start mt-1"
            }
          >
            {categoryLabel}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <StatBox
          icon={<Building2 size={16} className="text-primary" />}
          value={installer.stationsCount.toString()}
          label={tr("stations", lang)}
        />
        <StatBox
          icon={<Zap size={16} className="text-primary" />}
          value={power}
          label={tr("installedPower", lang)}
        />
        {installer.location && (
          <StatBox
            icon={<MapPin size={16} className="text-primary" />}
            value={installer.location}
            label={tr("location", lang)}
          />
        )}
      </div>

      {/* Description */}
      {description && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">{tr("description", lang)}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </section>
      )}

      {/* Contact */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground mb-4">{tr("contact", lang)}</h2>
        <div className="space-y-3">
          {installer.phone && (
            <ContactRow icon={<Phone size={14} />} label={tr("phone", lang)}>
              <a href={`tel:${installer.phone}`} className="text-sm text-foreground hover:text-primary transition-colors" dir="ltr">
                {installer.phone}
              </a>
            </ContactRow>
          )}
          {installer.email && (
            <ContactRow icon={<Mail size={14} />} label={tr("email", lang)}>
              <a href={`mailto:${installer.email}`} className="text-sm text-foreground hover:text-primary transition-colors break-all">
                {installer.email}
              </a>
            </ContactRow>
          )}
          {installer.website && (
            <ContactRow icon={<Globe size={14} />} label={tr("website", lang)}>
              <a
                href={installer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {installer.website.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </ContactRow>
          )}
          {installer.facebookUrl && (
            <ContactRow icon={<Facebook size={14} />} label={tr("facebook", lang)}>
              <a
                href={installer.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Facebook
              </a>
            </ContactRow>
          )}
        </div>
      </section>

      {/* Notes */}
      {installer.notes && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-foreground mb-3">{tr("notes", lang)}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{installer.notes}</p>
        </section>
      )}

      {/* Disclaimer */}
      <section className="border border-border/60 rounded-xl p-4 bg-muted/30">
        <div className="flex gap-3">
          <AlertCircle size={15} className="text-muted-foreground shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{tr("disclaimer", lang)}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{tr("disclaimerText", lang)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatBox({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 mb-1.5">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="font-semibold text-sm text-foreground leading-tight">{value}</p>
    </div>
  );
}

function ContactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-2/3" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
      </div>
      <Skeleton className="h-24" />
    </div>
  );
}
