// Vercel serverless handler — no ESM exports, only module.exports
// esbuild bundles this as a plain CJS file since there are no ESM export statements
import express from "express";
import { storage } from "./storage";
import { insertInstallerSchema } from "@shared/schema";
import { seed } from "./seed";

const app = express();
app.use(express.json());

seed().catch(console.error);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "shamsak-admin-2026";

function requireAdmin(req: any, res: any, next: any) {
  if (req.headers["x-admin-password"] !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

app.get("/api/installers", (req, res) => {
  const { q, category, sort } = req.query as Record<string, string>;
  let results = storage.searchInstallers(q || "", category || "all");
  if (sort === "power_desc") results.sort((a, b) => b.installedPowerKw - a.installedPowerKw);
  else if (sort === "power_asc") results.sort((a, b) => a.installedPowerKw - b.installedPowerKw);
  else if (sort === "stations_desc") results.sort((a, b) => b.stationsCount - a.stationsCount);
  else results.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.stationsCount - a.stationsCount;
  });
  res.json(results);
});

app.get("/api/installers/featured", (_req, res) => res.json(storage.getFeaturedInstallers()));

app.get("/api/installers/:id", (req, res) => {
  const installer = storage.getInstallerById(parseInt(req.params.id));
  if (!installer) return res.status(404).json({ message: "Not found" });
  res.json(installer);
});

app.get("/api/admin/installers", requireAdmin, (_req, res) =>
  res.json(storage.getAllInstallers({ includeHidden: true })));

app.post("/api/admin/installers", requireAdmin, (req, res) => {
  const parsed = insertInstallerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
  res.json(storage.createInstaller(parsed.data));
});

app.patch("/api/admin/installers/:id", requireAdmin, (req, res) => {
  const installer = storage.updateInstaller(parseInt(req.params.id), req.body);
  if (!installer) return res.status(404).json({ message: "Not found" });
  res.json(installer);
});

app.delete("/api/admin/installers/:id", requireAdmin, (req, res) => {
  storage.deleteInstaller(parseInt(req.params.id));
  res.json({ success: true });
});

export default app;
