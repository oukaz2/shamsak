import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile } from "fs/promises";
import { mkdirSync, existsSync } from "fs";

const allowlist = [
  "@google/generative-ai",
  "axios",
  "cors",
  "date-fns",
  "drizzle-orm",
  "drizzle-zod",
  "express",
  "express-rate-limit",
  "express-session",
  "jsonwebtoken",
  "memorystore",
  "multer",
  "nanoid",
  "nodemailer",
  "openai",
  "passport",
  "passport-local",
  "stripe",
  "uuid",
  "ws",
  "xlsx",
  "zod",
  "zod-validation-error",
];

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server (Railway/local)...");
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];
  const externals = allDeps.filter((dep) => !allowlist.includes(dep));

  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "dist/index.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: true,
    external: externals,
    logLevel: "info",
    alias: {
      "@shared": "./shared",
    },
  });

  // Build Vercel serverless API handler (fully bundled, no external deps)
  console.log("building Vercel API handler...");
  if (!existsSync("api")) mkdirSync("api");

  await esbuild({
    entryPoints: ["server/vercel-entry.ts"],
    platform: "node",
    bundle: true,
    format: "cjs",
    outfile: "api/_handler.cjs",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    // Bundle everything except native modules that need to stay as require()
    external: ["better-sqlite3"],
    logLevel: "info",
    alias: {
      "@shared": "./shared",
    },
  });

  console.log("Done.");
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
