import { useMemo, useState } from "react";
import { categoryLabels, type ProjectCategory } from "../../data/projects";
import { useGithubData } from "../../hooks/useGithubData";
import { buildProjects, sortAll, sortFeatured, type Project } from "../../lib/projects";
import { Icon } from "../Icon";
import { SectionHeading } from "../SectionHeading";
import { GithubActivity } from "./GithubActivity";
import { FeaturedProject, ProjectCard } from "./ProjectCard";
import { ProjectDetails } from "./ProjectDetails";
import styles from "./Projects.module.css";

type Filter = "all" | ProjectCategory;
const FILTER_ORDER: ProjectCategory[] = ["fullstack", "frontend", "backend", "ai", "college", "other"];
const INITIAL_VISIBLE = 6;

export function Projects() {
  const github = useGithubData();
  const projects = useMemo(() => buildProjects(github), [github]);
  const featured = useMemo(() => sortFeatured(projects), [projects]);
  const all = useMemo(() => sortAll(projects), [projects]);

  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Project | null>(null);

  // Only offer filters that actually have projects.
  const filters = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    for (const p of all) for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
    return FILTER_ORDER.filter((c) => counts.get(c)).map((c) => ({ id: c, label: categoryLabels[c], count: counts.get(c)! }));
  }, [all]);

  const filtered = filter === "all" ? all : all.filter((p) => p.categories.includes(filter));
  const visible = expanded || filter !== "all" ? filtered : filtered.slice(0, INITIAL_VISIBLE);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading id="projects-title" index="04" eyebrow="Projects" title="Things I've built">
          Full-stack applications, AI-powered tools and the smaller projects I learned on — all pulled from my
          GitHub.
        </SectionHeading>

        <h3 className={styles.subhead} data-reveal>
          <Icon name="star" size={16} /> Featured projects
        </h3>
        <div className={styles.featuredGrid}>
          {featured.map((p, i) => (
            <FeaturedProject key={p.repo} project={p} index={i} onDetails={setSelected} />
          ))}
        </div>

        <div className={styles.allHeader} data-reveal>
          <h3 className={styles.subhead} id="all-projects-title">
            <Icon name="layers" size={16} /> All projects <span className={styles.count}>{all.length}</span>
          </h3>
          <div className={styles.filters} role="group" aria-label="Filter projects by category">
            <button
              type="button"
              className={styles.filter}
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All <span>{all.length}</span>
            </button>
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                className={styles.filter}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                {f.label} <span>{f.count}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="visually-hidden" aria-live="polite">
          Showing {filtered.length} {filter === "all" ? "" : categoryLabels[filter]} projects
        </p>

        <ul className={styles.grid} aria-labelledby="all-projects-title">
          {visible.map((p, i) => (
            <ProjectCard key={p.repo} project={p} index={i} onDetails={setSelected} />
          ))}
        </ul>

        {filter === "all" && filtered.length > INITIAL_VISIBLE && (
          <div className={styles.more}>
            <button type="button" className="btn" onClick={() => setExpanded((e) => !e)} aria-expanded={expanded}>
              {expanded ? "Show fewer" : `Show all ${filtered.length} projects`}
            </button>
          </div>
        )}

        <GithubActivity data={github} projects={projects} />
      </div>

      <ProjectDetails project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
