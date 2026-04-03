import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLang } from "@/App";
import { tr } from "@/lib/i18n";
import { queryClient } from "@/lib/queryClient";
import type { Installer } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Edit, Trash2, Plus, LogOut, Shield, Zap, Building2 } from "lucide-react";

export default function AdminPage() {
  const { lang } = useLang();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [authedPassword, setAuthedPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [editingInstaller, setEditingInstaller] = useState<Installer | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [search, setSearch] = useState("");

  const { data: installers, isLoading, refetch } = useQuery<Installer[]>({
    queryKey: ["/api/admin/installers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/installers", {
        headers: { "x-admin-password": authedPassword },
      });
      if (res.status === 401) { setIsAuthed(false); throw new Error("Unauthorized"); }
      return res.json();
    },
    enabled: isAuthed && !!authedPassword,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Installer> }) => {
      const res = await fetch(`/api/admin/installers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-password": authedPassword },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers/featured"] });
      setEditingInstaller(null);
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved successfully" });
    },
    onError: () => toast({ title: lang === "ar" ? "خطأ في الحفظ" : "Save failed", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/installers/${id}`, {
        method: "DELETE",
        headers: { "x-admin-password": authedPassword },
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers/featured"] });
      toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Partial<Installer>) => {
      const res = await fetch("/api/admin/installers", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": authedPassword },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Create failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/installers/featured"] });
      setAddingNew(false);
      toast({ title: lang === "ar" ? "تمت الإضافة" : "Company added" });
    },
  });

  const handleLogin = async () => {
    const res = await fetch("/api/admin/installers", {
      headers: { "x-admin-password": password },
    });
    if (res.ok) {
      setAuthedPassword(password);
      setIsAuthed(true);
    } else {
      toast({ title: tr("adminWrongPassword", lang), variant: "destructive" });
    }
  };

  const filtered = installers?.filter((i) =>
    !search || i.nameAr.includes(search) || i.nameEn.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  if (!isAuthed) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-sm">
        <div className="bg-card border border-border rounded-xl p-8 space-y-5">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-primary" />
            <h1 className="font-semibold text-base">{tr("adminLogin", lang)}</h1>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">{tr("adminPassword", lang)}</Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              data-testid="admin-password-input"
            />
          </div>
          <Button className="w-full" onClick={handleLogin} data-testid="admin-login-btn">
            {tr("adminLoginBtn", lang)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-foreground">{tr("adminTitle", lang)}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{installers?.length ?? 0} companies</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setAddingNew(true)} size="sm" data-testid="add-company-btn">
            <Plus size={14} className="me-1.5" />
            {tr("adminAddNew", lang)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { setIsAuthed(false); setAuthedPassword(""); }}
          >
            <LogOut size={14} className="me-1.5" />
            {tr("adminLogout", lang)}
          </Button>
        </div>
      </div>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={tr("searchPlaceholder", lang)}
        className="mb-6 max-w-xs bg-background"
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((installer) => (
            <div
              key={installer.id}
              className={`flex items-center gap-4 p-4 rounded-xl border bg-card ${installer.hidden ? "opacity-50" : ""}`}
              data-testid={`admin-row-${installer.id}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm text-foreground truncate">{installer.nameAr}</p>
                  {installer.nameEn && <p className="text-xs text-muted-foreground truncate">{installer.nameEn}</p>}
                  {installer.featured && (
                    <Badge variant="secondary" className="text-xs bg-accent text-primary border-0">★</Badge>
                  )}
                  {installer.hidden && (
                    <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">{tr("adminHidden", lang)}</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 size={11} />{installer.stationsCount}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap size={11} />{installer.installedPowerDisplay}
                  </span>
                  <span>{installer.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => updateMutation.mutate({ id: installer.id, data: { hidden: !installer.hidden } })}
                  title={installer.hidden ? tr("adminShow", lang) : tr("adminHide", lang)}
                >
                  {installer.hidden ? <Eye size={14} /> : <EyeOff size={14} />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setEditingInstaller(installer)}
                  data-testid={`edit-btn-${installer.id}`}
                >
                  <Edit size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm(lang === "ar" ? "تأكيد الحذف؟" : "Confirm delete?")) {
                      deleteMutation.mutate(installer.id);
                    }
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editingInstaller && (
        <InstallerModal
          installer={editingInstaller}
          lang={lang}
          onSave={(data) => updateMutation.mutate({ id: editingInstaller.id, data })}
          onClose={() => setEditingInstaller(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {/* Add new modal */}
      {addingNew && (
        <InstallerModal
          installer={null}
          lang={lang}
          onSave={(data) => createMutation.mutate(data)}
          onClose={() => setAddingNew(false)}
          isPending={createMutation.isPending}
        />
      )}
    </div>
  );
}

function InstallerModal({
  installer,
  lang,
  onSave,
  onClose,
  isPending,
}: {
  installer: Installer | null;
  lang: string;
  onSave: (data: any) => void;
  onClose: () => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState({
    nameAr: installer?.nameAr ?? "",
    nameEn: installer?.nameEn ?? "",
    sourceCategory: installer?.sourceCategory ?? "up_to_50kw",
    publicCategory: installer?.publicCategory ?? "up_to_500kw",
    stationsCount: installer?.stationsCount ?? 0,
    installedPowerKw: installer?.installedPowerKw ?? 0,
    installedPowerDisplay: installer?.installedPowerDisplay ?? "",
    phone: installer?.phone ?? "",
    email: installer?.email ?? "",
    website: installer?.website ?? "",
    facebookUrl: installer?.facebookUrl ?? "",
    location: installer?.location ?? "",
    descriptionAr: installer?.descriptionAr ?? "",
    descriptionEn: installer?.descriptionEn ?? "",
    notes: installer?.notes ?? "",
    featured: installer?.featured ?? false,
    hidden: installer?.hidden ?? false,
  });

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">
            {installer ? (lang === "ar" ? "تعديل شركة" : "Edit Company") : (lang === "ar" ? "إضافة شركة" : "Add Company")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
          <Field label="الاسم بالعربي / Arabic Name">
            <Input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} dir="rtl" />
          </Field>
          <Field label="English Name">
            <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} />
          </Field>
          <Field label="Public Category">
            <Select value={form.publicCategory} onValueChange={(v) => setForm({ ...form, publicCategory: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="up_to_500kw">Up to 500 kW</SelectItem>
                <SelectItem value="above_500kw">More than 500 kW</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Source Category">
            <Select value={form.sourceCategory} onValueChange={(v) => setForm({ ...form, sourceCategory: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="up_to_50kw">Up to 50 kW</SelectItem>
                <SelectItem value="up_to_500kw">Up to 500 kW</SelectItem>
                <SelectItem value="up_to_3mw">Up to 3 MW</SelectItem>
                <SelectItem value="above_3mw">Above 3 MW</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Stations Count">
            <Input type="number" value={form.stationsCount} onChange={(e) => setForm({ ...form, stationsCount: +e.target.value })} />
          </Field>
          <Field label="Power (kW)">
            <Input type="number" value={form.installedPowerKw} onChange={(e) => setForm({ ...form, installedPowerKw: +e.target.value })} />
          </Field>
          <Field label="Power Display (e.g. 1.5 MW)">
            <Input value={form.installedPowerDisplay} onChange={(e) => setForm({ ...form, installedPowerDisplay: e.target.value })} />
          </Field>
          <Field label="Location">
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} dir="ltr" />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Website">
            <Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
          </Field>
          <Field label="Facebook URL">
            <Input value={form.facebookUrl} onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description (Arabic)">
              <Textarea rows={3} value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} dir="rtl" />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Description (English)">
              <Textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </Field>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} id="featured" />
            <Label htmlFor="featured" className="text-sm">{lang === "ar" ? "مميز" : "Featured"}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={form.hidden} onCheckedChange={(v) => setForm({ ...form, hidden: v })} id="hidden" />
            <Label htmlFor="hidden" className="text-sm">{lang === "ar" ? "مخفي" : "Hidden"}</Label>
          </div>
        </div>
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline" onClick={onClose} disabled={isPending}>{tr("adminCancel", lang as any)}</Button>
          <Button onClick={() => onSave(form)} disabled={isPending}>
            {isPending ? "..." : tr("adminSave", lang as any)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
