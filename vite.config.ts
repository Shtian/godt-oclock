import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins, type Plugin } from "vite-plus";

/**
 * Emits `sw.js` with every built file (bundle + public/) baked into its precache
 * list, so the installed home-screen app works offline. The version is a hash of
 * the file names, so each deploy with changed assets replaces the old cache.
 */
function offlineServiceWorker(): Plugin {
  let publicDir = "";
  return {
    name: "offline-service-worker",
    apply: "build",
    configResolved(config) {
      publicDir = config.publicDir;
    },
    generateBundle(_, bundle) {
      const publicFiles = readdirSync(publicDir, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile())
        .map((entry) => join(entry.parentPath, entry.name).slice(publicDir.length + 1));
      const files = [...Object.keys(bundle), ...publicFiles]
        .filter((f) => !f.endsWith(".map"))
        .sort();
      const version = createHash("sha256").update(files.join("\n")).digest("hex").slice(0, 12);
      const source = readFileSync(new URL("./pwa/sw.js", import.meta.url), "utf8")
        .replace("__SW_VERSION__", version)
        .replace("__SW_PRECACHE__", JSON.stringify(["./", ...files]));
      this.emitFile({ type: "asset", fileName: "sw.js", source });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    plugins: ["react", "typescript", "oxc"],
    rules: {
      "react/rules-of-hooks": "error",
      "react/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
  },
  plugins: lazyPlugins(() => [react(), offlineServiceWorker()]),
});
