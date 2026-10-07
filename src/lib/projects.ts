import { curatedProjects, excludedRepos, type CuratedProject } from "../data/projects";
import { GITHUB_USERNAME, type GithubData, type GithubRepo } from "./github";

export interface Project extends CuratedProject {
  url: string;
  language: string | null;
  updatedAt: string | null;
}

const curatedByRepo = new Map(curatedProjects.map((p) => [p.repo.toLowerCase(), p]));

function prettify(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function fromRepo(repo: GithubRepo): Project {
  const curated = curatedByRepo.get(repo.name.toLowerCase());
  const base: CuratedProject = curated ?? {
    repo: repo.name,
    title: prettify(repo.name),
    kind: repo.language ? `${repo.language} project` : "Project",
    summary: repo.description ?? "Source code on GitHub.",
    tech: repo.language ? [repo.language] : [],
  };
  return {
    ...base,
    liveUrl: base.liveUrl ?? repo.homepage ?? undefined,
    url: repo.url,
    language: repo.language,
    updatedAt: repo.updatedAt,
  };
}

function toProject(p: CuratedProject): Project {
  const owner = p.owner ?? GITHUB_USERNAME;
  return { ...p, url: `https://github.com/${owner}/${p.repo}`, language: null, updatedAt: null };
}

/** All projects to show, merged from GitHub data + curated metadata. */
export function buildProjects(data: GithubData): Project[] {
  const own = data.repos.filter((r) => !r.fork && !r.archived && !excludedRepos.has(r.name)).map(fromRepo);
  // Team projects hosted on someone else's account.
  const external = curatedProjects.filter((p) => p.owner && p.owner !== GITHUB_USERNAME).map(toProject);
  return [...own, ...external];
}

export function featuredProjects(projects: Project[]) {
  return projects.filter((p) => p.featured).sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Non-featured projects, most recently updated first. */
export function moreProjects(projects: Project[]) {
  return projects
    .filter((p) => !p.featured)
    .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

/** Curated data for a project page, available even before GitHub data loads. */
export function projectBySlug(slug: string): Project | undefined {
  const p = curatedProjects.find((c) => c.slug === slug);
  return p && toProject(p);
}

/** srcset string for an image with known widths. */
export function srcSet(src: string, widths: number[]) {
  return widths.map((w) => `${src}-${w}.webp ${w}w`).join(", ");
}

/** Language counts across my own, non-fork repositories — for the GitHub panel. */
export function languageStats(data: GithubData) {
  const counts = new Map<string, number>();
  for (const r of data.repos) {
    if (r.fork || excludedRepos.has(r.name) || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
