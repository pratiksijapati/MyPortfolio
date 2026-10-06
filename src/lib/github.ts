import snapshot from "../data/github-snapshot.json";

export const GITHUB_USERNAME = "pratiksijapati";

export interface GithubRepo {
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  fork: boolean;
  archived: boolean;
  updatedAt: string;
}

export interface GithubData {
  /** "live" = fetched in this browser just now (or cached from a recent visit). */
  source: "live" | "snapshot";
  fetchedAt: string;
  user: { login: string; publicRepos: number; url: string };
  repos: GithubRepo[];
}

export const githubSnapshot: GithubData = { ...(snapshot as Omit<GithubData, "source">), source: "snapshot" };

const CACHE_KEY = "gh-cache-v1";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

function toRepo(r: ApiRepo): GithubRepo {
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

function readCache(): GithubData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as GithubData;
    return Date.now() - Date.parse(data.fetchedAt) < CACHE_TTL_MS ? data : null;
  } catch {
    return null;
  }
}

function writeCache(data: GithubData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked — the in-memory result is still used */
  }
}

/**
 * Public, unauthenticated GitHub API (60 requests/hour per visitor IP — plenty for a
 * portfolio, and results are cached for 6 hours). Resolves to null on any failure so
 * the caller can quietly keep the build-time snapshot.
 */
export async function fetchGithubData(signal?: AbortSignal): Promise<GithubData | null> {
  const cached = readCache();
  if (cached) return cached;
  try {
    const base = `https://api.github.com/users/${GITHUB_USERNAME}`;
    const opts = { headers: { Accept: "application/vnd.github+json" }, signal };
    const [userRes, reposRes] = await Promise.all([
      fetch(base, opts),
      fetch(`${base}/repos?per_page=100&sort=pushed`, opts),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;
    const user = (await userRes.json()) as { login: string; public_repos: number; html_url: string };
    const repos = (await reposRes.json()) as ApiRepo[];
    const data: GithubData = {
      source: "live",
      fetchedAt: new Date().toISOString(),
      user: { login: user.login, publicRepos: user.public_repos, url: user.html_url },
      repos: repos.map(toRepo),
    };
    writeCache(data);
    return data;
  } catch {
    return null;
  }
}
