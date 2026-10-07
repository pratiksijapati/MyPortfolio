// Tiny path-based routing. Every page is a real HTML file on GitHub Pages
// (vite.config.ts writes one per route), so links are plain <a href> — no router library.

export type Route =
  | { name: "home" }
  | { name: "project"; slug: string }
  | { name: "design"; slug: string }
  | { name: "notFound" };

export function getRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/" || path === "/index.html") return { name: "home" };
  let m = path.match(/^\/projects\/([\w-]+)$/);
  if (m) return { name: "project", slug: m[1] };
  m = path.match(/^\/design\/([\w-]+)$/);
  if (m) return { name: "design", slug: m[1] };
  return { name: "notFound" };
}

export const projectPath = (slug: string) => `/projects/${slug}/`;
export const designPath = (slug: string) => `/design/${slug}/`;

/** Link to a section of the home page, from the home page or any other page. */
export const sectionHref = (id: string, onHome: boolean) => (onHome ? `#${id}` : `/#${id}`);
