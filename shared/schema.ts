import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const installers = sqliteTable("installers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  // Arabic name (primary)
  nameAr: text("name_ar").notNull(),
  // English name
  nameEn: text("name_en").notNull().default(""),
  // Source category (original from NREA)
  sourceCategory: text("source_category").notNull(), // "up_to_50kw" | "up_to_500kw" | "up_to_3mw" | "above_3mw"
  // Normalized public-facing bucket
  publicCategory: text("public_category").notNull(), // "up_to_500kw" | "above_500kw"
  // Track record
  stationsCount: integer("stations_count").notNull().default(0),
  installedPowerKw: real("installed_power_kw").notNull().default(0),
  installedPowerDisplay: text("installed_power_display").notNull().default(""),
  // Contact
  phone: text("phone").notNull().default(""),
  email: text("email").notNull().default(""),
  // Enriched from research
  website: text("website").notNull().default(""),
  facebookUrl: text("facebook_url").notNull().default(""),
  location: text("location").notNull().default(""),
  // Editable content
  descriptionAr: text("description_ar").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  notes: text("notes").notNull().default(""),
  // Admin controls
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  hidden: integer("hidden", { mode: "boolean" }).notNull().default(false),
});

export const insertInstallerSchema = createInsertSchema(installers).omit({ id: true });
export type InsertInstaller = z.infer<typeof insertInstallerSchema>;
export type Installer = typeof installers.$inferSelect;
