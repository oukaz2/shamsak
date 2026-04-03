import { db } from "./db";
import { installers, type Installer, type InsertInstaller } from "@shared/schema";
import { eq, and, like, or } from "drizzle-orm";

export interface IStorage {
  getAllInstallers(options?: { includeHidden?: boolean }): Installer[];
  getFeaturedInstallers(): Installer[];
  getInstallerById(id: number): Installer | undefined;
  createInstaller(data: InsertInstaller): Installer;
  updateInstaller(id: number, data: Partial<InsertInstaller>): Installer | undefined;
  deleteInstaller(id: number): void;
  searchInstallers(query: string, category?: string): Installer[];
}

export class Storage implements IStorage {
  getAllInstallers(options: { includeHidden?: boolean } = {}) {
    const rows = db.select().from(installers).all();
    if (options.includeHidden) return rows;
    return rows.filter((r) => !r.hidden);
  }

  getFeaturedInstallers() {
    return db.select().from(installers).all().filter((r) => r.featured && !r.hidden);
  }

  getInstallerById(id: number) {
    return db.select().from(installers).where(eq(installers.id, id)).get();
  }

  createInstaller(data: InsertInstaller) {
    return db.insert(installers).values(data).returning().get();
  }

  updateInstaller(id: number, data: Partial<InsertInstaller>) {
    return db.update(installers).set(data).where(eq(installers.id, id)).returning().get();
  }

  deleteInstaller(id: number) {
    db.delete(installers).where(eq(installers.id, id)).run();
  }

  searchInstallers(query: string, category?: string) {
    const allRows = db.select().from(installers).all().filter((r) => !r.hidden);
    const q = query.toLowerCase();
    return allRows.filter((r) => {
      const matchesQuery =
        !q ||
        r.nameAr.toLowerCase().includes(q) ||
        r.nameEn.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q);
      const matchesCategory = !category || category === "all" || r.publicCategory === category;
      return matchesQuery && matchesCategory;
    });
  }
}

export const storage = new Storage();
