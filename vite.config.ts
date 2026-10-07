import react from "@vitejs/plugin-react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { defineConfig, type Plugin } from "vite";
import { projectPages } from "./src/data/projects.ts";

const SITE = "https://www.pratiksijapati.com.np";

interface Page {
  path: string;
  title: string;
  description: string;
}

const pages: Page[] = [
  ...projectPages.map((p) => ({
    path: `/projects/${p.slug}/`,
    title: `${p.title} | Pratik Sijapati`,
    description: p.description,
  })),
  {
    path: "/design/karkhana/",
    title: "Karkhana Product & UI/UX Work | Pratik Sijapati",
    description:
      "Product and UI/UX design work at Karkhana (2025–2026): an internal operations platform, a classroom progress tracker and visual design.",
  },
];

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/**
 * GitHub Pages serves static files only, so after the build each sub-page gets its own
 * index.html (a copy of the app shell with the right title, description and canonical URL).
 * The app reads the path and renders the matching page.
 */
function staticPages(): Plugin {
  let outDir = "dist";
  return {
    name: "static-pages",
    apply: "build",
    configResolved(config) {
      outDir = config.build.outDir;
    },
    async closeBundle() {
      const shell = await readFile(`${outDir}/index.html`, "utf8");
      const withMeta = (page: Page) =>
        shell
          .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
          .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escape(page.title)}$2`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
          .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${escape(page.title)}$2`)
          .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escape(page.description)}$2`)
          .replaceAll(`content="${SITE}/"`, `content="${SITE}${page.path}"`)
          .replace(`<link rel="canonical" href="${SITE}/" />`, `<link rel="canonical" href="${SITE}${page.path}" />`);

      for (const page of pages) {
        await mkdir(`${outDir}${page.path}`, { recursive: true });
        await writeFile(`${outDir}${page.path}index.html`, withMeta(page));
      }
      // Unknown URLs: GitHub Pages serves 404.html, and the app shows its "not found" page.
      await writeFile(
        `${outDir}/404.html`,
        withMeta({ path: "/", title: "Page not found | Pratik Sijapati", description: "This page doesn't exist." }).replace(
          '<link rel="canonical"',
          '<meta name="robots" content="noindex" />\n    <link rel="canonical"',
        ),
      );
      const urls = ["/", ...pages.map((p) => p.path)];
      await writeFile(
        `${outDir}/sitemap.xml`,
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${SITE}${u}</loc></url>`)
          .join("\n")}\n</urlset>\n`,
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticPages()],
  build: {
    target: "es2022",
    // three.js lives only in the lazily loaded Hero3D chunk (see components/Hero.tsx),
    // which is large by nature; it never blocks the first paint.
    chunkSizeWarningLimit: 1000,
  },
});
