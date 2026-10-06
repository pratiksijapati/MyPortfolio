import {
  curatedProjects,
  excludedRepos,
  type CuratedProject,
  type ProjectCategory,
} from "../data/projects";
import { GITHUB_USERNAME, type GithubData, type GithubRepo } from "./github";

export interface Project extends CuratedProject {
  url: string;
  language: string | null;
  stars: number;
  updatedAt: string | null;
  /** Not in curated data — shown from GitHub metadata alone. */
  auto: boolean;
}

const curatedByRepo = new Map(curatedProjects.map((p) => [p.repo.toLowerCase(), p]));

function prettify(name: string) {
  return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function guessCategories(language: string | null): ProjectCategory[] {
  switch (language) {
    case "HTML":
    case "CSS":
    case "JavaScript":
    case "TypeScript":
      return ["frontend"];
    case "Jupyter Notebook":
      return ["ai"];
    case "PHP":
      return ["backend"];
    default:
      return ["other"];
  }
}

function fromRepo(repo: GithubRepo): Project {
  const curated = curatedByRepo.get(repo.name.toLowerCase());
  const base: CuratedProject = curated ?? {
    repo: repo.name,
    title: prettify(repo.name),
    kind: repo.language ? `${repo.language} project` : "Project",
    summary: repo.description ?? "Source code on GitHub.",
    categories: guessCategories(repo.language),
    tech: [...(repo.language ? [repo.language] : []), ...repo.topics.slice(0, 4)],
  };
  return {
    ...base,
    liveUrl: base.liveUrl ?? repo.homepage ?? undefined,
    url: repo.url,
    language: repo.language,
    stars: repo.stars,
    updatedAt: repo.updatedAt,
    auto: !curated,
  };
}

/** Curated projects that live under someone else's account (team projects). */
function externalProjects(): Project[] {
  return curatedProjects
    .filter((p) => p.owner && p.owner !== GITHUB_USERNAME)
    .map((p) => ({
      ...p,
      url: `https://github.com/${p.owner}/${p.repo}`,
      language: null,
      stars: 0,
      updatedAt: null,
      auto: false,
    }));
}

/** All projects to show, merged from GitHub data + curated metadata. */
export function buildProjects(data: GithubData): Project[] {
  const own = data.repos
    .filter((r) => !r.fork && !r.archived && !excludedRepos.has(r.name))
    .map(fromRepo);
  return [...own, ...externalProjects()];
}

export function sortFeatured(projects: Project[]) {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

/** Most recently updated first (featured ones are already shown above, so no special treatment). */
export function sortAll(projects: Project[]) {
  return [...projects].sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
}

/** Language counts across my own, non-fork repositories — for the GitHub section. */
export function languageStats(data: GithubData) {
  const counts = new Map<string, number>();
  for (const r of data.repos) {
    if (r.fork || excludedRepos.has(r.name) || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
