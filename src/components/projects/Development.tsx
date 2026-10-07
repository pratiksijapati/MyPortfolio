import { useMemo } from "react";
import { githubUrl } from "../../data/socials";
import { useGithubData } from "../../hooks/useGithubData";
import { buildProjects, featuredProjects, moreProjects } from "../../lib/projects";
import { Icon } from "../Icon";
import { SectionHeading } from "../SectionHeading";
import { GithubActivity } from "./GithubActivity";
import { ProjectCard, ProjectRow } from "./ProjectCard";
import styles from "./Development.module.css";

export function Development() {
  const github = useGithubData();
  const projects = useMemo(() => buildProjects(github), [github]);
  const featured = useMemo(() => featuredProjects(projects), [projects]);
  const more = useMemo(() => moreProjects(projects), [projects]);

  return (
    <section id="development" className="section" aria-labelledby="development-title">
      <div className="container">
        <SectionHeading id="development-title" eyebrow="Development" title="Selected development work">
          Apps I've built across frontend, backend and database. Click a project to see how it works.
        </SectionHeading>

        <div className={styles.featured}>
          {featured.map((p, i) => (
            <ProjectCard key={p.repo} project={p} index={i} />
          ))}
        </div>

        <div className={styles.more} data-reveal>
          <div className={styles.moreHeader}>
            <h3 id="more-projects-title" className={styles.subhead}>
              More projects
            </h3>
            <p className={styles.moreNote}>Smaller experiments and the projects I learned on.</p>
          </div>
          <ul className={styles.list} aria-labelledby="more-projects-title">
            {more.map((p) => (
              <ProjectRow key={p.repo} project={p} />
            ))}
          </ul>
          <a href={githubUrl} target="_blank" rel="noreferrer" className={styles.allLink}>
            Everything else is on GitHub <Icon name="arrowUpRight" size={16} />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <GithubActivity data={github} projects={projects} />
      </div>
    </section>
  );
}
