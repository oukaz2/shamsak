// Vercel serverless function entry point.
// Uses createRequire to load the CJS bundle from an ESM context
// (package.json has "type": "module", so .js files are ESM by default).
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const mod = require("./_handler.cjs");
// esbuild CJS output with ESM source exports via { default: app, __esModule: true }
const app = mod.default || mod;

export default app;
