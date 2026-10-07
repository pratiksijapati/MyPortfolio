import type { CSSProperties } from "react";
import type { Project } from "../../lib/projects";
import { projectPath } from "../../lib/routes";
import { Icon } from "../Icon";
import { ProjectImage } from "./ProjectImage";
import styles from "./ProjectCard.module.css";

export function ProjectLinks({ project, showPage = true }: { project: Project; showPage?: boolean }) {
  return (
    <div className={styles.links}>
      {showPage && project.slug && (
        <a href={projectPath(project.slug)} className={`${styles.link} ${styles.primaryLink}`}>
          View project<span className="visually-hidden">: {project.title}</span>
          <Icon name="arrowRight" size={16} />
        </a>
      )}
      <a href={project.url} target="_blank" rel="noreferrer" className={styles.link}>
        <Icon name="github" size={16} /> GitHub
        <span className="visually-hidden"> repository for {project.title} (opens in a new tab)</span>
      </a>
      {project.liveUrl && (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.link}>
          <Icon name="arrowUpRight" size={16} /> Live demo
          <span className="visually-hidden"> of {project.title} (opens in a new tab)</span>
        </a>
      )}
    </div>
  );
}

/** Featured project: image, name, one sentence, tags, links. */
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const href = project.slug ? projectPath(project.slug) : project.url;
  const external = !project.slug;
  return (
    <article
      className={styles.card}
      data-reveal
      style={{ "--i": index % 2 } as CSSProperties}
      aria-labelledby={`project-${project.repo}`}
    >
      {project.cover && (
        <a
          href={href}
          className={styles.media}
          tabIndex={-1}
          aria-hidden="true"
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          <ProjectImage
            image={project.cover}
            sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1200px) 50vw, 580px"
            className={styles.img}
            eager={index < 2}
          />
          <span className={styles.hoverLabel}>{external ? "View on GitHub" : "View project"}</span>
        </a>
      )}
      <div className={styles.body}>
        <p className={styles.kind}>{project.kind}</p>
        <h3 id={`project-${project.repo}`} className={styles.title}>
          {project.title}
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.tech} aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <ProjectLinks project={project} />
        </div>
      </div>
    </article>
  );
}

/** Compact row for smaller and earlier projects. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className={styles.row}>
      <div className={styles.rowMain}>
        <h4 className={styles.rowTitle}>{project.title}</h4>
        <p className={styles.rowSummary}>
          <span className={styles.rowKind}>{project.kind}</span> {project.summary}
        </p>
      </div>
      <ul className={styles.rowTech} aria-label="Technologies">
        {project.tech.slice(0, 3).map((t) => (
          <li key={t} className="tag">
            {t}
          </li>
        ))}
      </ul>
      <a href={project.url} target="_blank" rel="noreferrer" className={styles.rowLink}>
        <Icon name="github" size={16} />
        <span>
          GitHub<span className="visually-hidden"> repository for {project.title} (opens in a new tab)</span>
        </span>
      </a>
    </li>
  );
}
