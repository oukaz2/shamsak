import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import type { Installer } from "@shared/schema";
import InstallerCard from "@/components/InstallerCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DirectoryPage() {
  const { lang, dir } = useLang();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: installers, isLoading } = useQuery<Installer[]>({
    queryKey: ["/api/installers", { q: debouncedSearch, category, sort }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (category !== "all") params.set("category", category);
      if (sort !== "default") params.set("sort", sort);
      const res = await fetch(`/api/installers?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-1.5">{tr("directoryTitle", lang)}</h1>
        <p className="text-sm text-muted-foreground">{tr("directorySubtitle", lang)}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${dir === "rtl" ? "right-3" : "left-3"}`}
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={tr("searchPlaceholder", lang)}
            className={`${dir === "rtl" ? "pr-9" : "pl-9"} bg-background`}
            data-testid="search-input"
          />
        </div>

        {/* Category filter */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-52 bg-background" data-testid="category-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tr("filterAll", lang)}</SelectItem>
            <SelectItem value="up_to_500kw">{tr("filterUpTo500", lang)}</SelectItem>
            <SelectItem value="above_500kw">{tr("filterAbove500", lang)}</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-52 bg-background" data-testid="sort-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{tr("sortDefault", lang)}</SelectItem>
            <SelectItem value="power_desc">{tr("sortPowerDesc", lang)}</SelectItem>
            <SelectItem value="power_asc">{tr("sortPowerAsc", lang)}</SelectItem>
            <SelectItem value="stations_desc">{tr("sortStationsDesc", lang)}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      {!isLoading && installers && (
        <p className="text-xs text-muted-foreground mb-5">
          {installers.length} {tr("resultsCount", lang)}
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(12)].map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : installers && installers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {installers.map((installer) => (
            <InstallerCard key={installer.id} installer={installer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground text-sm">
          {tr("noResults", lang)}
        </div>
      )}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
