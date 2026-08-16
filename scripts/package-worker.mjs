import { copyFile, rm } from "node:fs/promises";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const workerBundle = resolve(projectRoot, "dist-worker/_worker.js");
const pagesWorker = resolve(projectRoot, "dist/_worker.js");

await copyFile(workerBundle, pagesWorker);
await rm(resolve(projectRoot, "dist-worker"), { recursive: true, force: true });

console.log("Packaged Cloudflare Pages Advanced Mode worker.");
