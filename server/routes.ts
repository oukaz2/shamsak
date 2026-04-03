import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertInstallerSchema } from "@shared/schema";
import { seed } from "./seed";

// Run seed on startup
seed().catch(console.error);

export async function registerRoutes(app: Express) {
  const httpServer = createServer(app);

  // Public API
  app.get("/api/installers", (req, res) => {
    const { q, category, sort } = req.query as Record<string, string>;
    let results = storage.searchInstallers(q || "", category || "all");

    if (sort === "power_desc") {
      results.sort((a, b) => b.installedPowerKw - a.installedPowerKw);
    } else if (sort === "power_asc") {
      results.sort((a, b) => a.installedPowerKw - b.installedPowerKw);
    } else if (sort === "stations_desc") {
      results.sort((a, b) => b.stationsCount - a.stationsCount);
    } else {
      // Default: featured first, then by stations
      results.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.stationsCount - a.stationsCount;
      });
    }

    res.json(results);
  });

  app.get("/api/installers/featured", (_req, res) => {
    const featured = storage.getFeaturedInstallers();
    res.json(featured);
  });

  app.get("/api/installers/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const installer = storage.getInstallerById(id);
    if (!installer) return res.status(404).json({ message: "Not found" });
    res.json(installer);
  });

  // Admin API (simple password protection)
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "shamsak-admin-2026";

  function requireAdmin(req: any, res: any, next: any) {
    const auth = req.headers["x-admin-password"];
    if (auth !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  }

  app.get("/api/admin/installers", requireAdmin, (_req, res) => {
    const all = storage.getAllInstallers({ includeHidden: true });
    res.json(all);
  });

  app.post("/api/admin/installers", requireAdmin, (req, res) => {
    const parsed = insertInstallerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: parsed.error.message });
    const installer = storage.createInstaller(parsed.data);
    res.json(installer);
  });

  app.patch("/api/admin/installers/:id", requireAdmin, (req, res) => {
    const id = parseInt(req.params.id);
    const installer = storage.updateInstaller(id, req.body);
    if (!installer) return res.status(404).json({ message: "Not found" });
    res.json(installer);
  });

  app.delete("/api/admin/installers/:id", requireAdmin, (req, res) => {
    storage.deleteInstaller(parseInt(req.params.id));
    res.json({ success: true });
  });

  return httpServer;
}
