// Refreshes src/data/github-snapshot.json from GitHub's public API.
//
// The snapshot is what the site shows instantly (and what it falls back to if the live
// API is unavailable in the visitor's browser). It runs before every production build.
//
// - No token needed. If GITHUB_TOKEN is set (e.g. in GitHub Actions) it is used only here,
//   on the build machine, to avoid rate limits. It is never bundled into the site.
// - If GitHub can't be reached, the existing snapshot is kept and the build continues.

import { readFile, writeFile } from "node:fs/promises";

const USERNAME = "pratiksijapati";
const OUT = new URL("../src/data/github-snapshot.json", import.meta.url);

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": `${USERNAME}-portfolio-build`,
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function getJson(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${path} → HTTP ${res.status}`);
  return res.json();
}

/** Keep only the fields the site uses — same shape as src/lib/github.ts `toRepo`. */
function toRepo(r) {
  return {
    name: r.name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    language: r.language,
    topics: r.topics ?? [],
    stars: r.stargazers_count,
    fork: r.fork,
    archived: r.archived,
    updatedAt: r.pushed_at,
  };
}

try {
  const [user, repos] = await Promise.all([
    getJson(`/users/${USERNAME}`),
    getJson(`/users/${USERNAME}/repos?per_page=100&sort=pushed`),
  ]);
  const snapshot = {
    fetchedAt: new Date().toISOString(),
    user: { login: user.login, publicRepos: user.public_repos, url: user.html_url },
    repos: repos.map(toRepo),
  };
  await writeFile(OUT, JSON.stringify(snapshot, null, 2) + "\n");
  console.log(`github-snapshot: ${snapshot.repos.length} repositories saved.`);
} catch (err) {
  // Keep the last good snapshot — a GitHub outage must never break a deploy.
  const existing = await readFile(OUT, "utf8").catch(() => null);
  if (!existing) {
    console.error(`github-snapshot: could not fetch (${err.message}) and no snapshot exists.`);
    process.exit(1);
  }
  console.warn(`github-snapshot: could not fetch (${err.message}); keeping the existing snapshot.`);
}
