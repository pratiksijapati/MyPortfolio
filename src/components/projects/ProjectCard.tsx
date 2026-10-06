import type { CSSProperties } from "react";
import type { Project } from "../../lib/projects";
import { Icon } from "../Icon";
import { ProjectVisual } from "./ProjectVisual";
import styles from "./ProjectCard.module.css";

const dateFmt = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

export function ProjectLinks({ project, onDetails }: { project: Project; onDetails?: () => void }) {
  return (
    <div className={styles.links}>
      {onDetails && project.details && (
        <button type="button" className={`${styles.link} ${styles.primaryLink}`} onClick={onDetails}>
          Details<span className="visually-hidden"> about {project.title}</span>
          <Icon name="arrowRight" size={16} />
        </button>
      )}
      <a href={project.url} target="_blank" rel="noreferrer" className={styles.link}>
        <Icon name="github" size={16} /> Code
        <span className="visually-hidden"> for {project.title} on GitHub (opens in a new tab)</span>
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

interface CardProps {
  project: Project;
  index: number;
  onDetails: (p: Project) => void;
}

export function ProjectCard({ project, index, onDetails }: CardProps) {
  return (
    <li className={styles.card} data-reveal style={{ "--i": index % 3 } as CSSProperties}>
      <ProjectVisual project={project} />
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.kind}>{project.kind}</span>
          {project.featured && (
            <span className={styles.featured}>
              <Icon name="star" size={12} /> Featured
            </span>
          )}
        </div>
        <h4 className={styles.title}>{project.title}</h4>
        <p className={styles.summary}>{project.summary}</p>
        <ul className={styles.tech} aria-label="Technologies">
          {project.tech.slice(0, 5).map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <ProjectLinks project={project} onDetails={() => onDetails(project)} />
          {project.updatedAt && (
            <span className={styles.updated}>
              <span className="visually-hidden">Last updated </span>
              {dateFmt.format(new Date(project.updatedAt))}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function FeaturedProject({ project, index, onDetails }: CardProps) {
  const d = project.details;
  return (
    <article
      className={`${styles.featuredCard} ${index < 2 ? styles.featuredLarge : ""}`}
      data-reveal
      style={{ "--i": index % 2 } as CSSProperties}
      aria-labelledby={`featured-${project.repo}`}
    >
      <ProjectVisual project={project} eager={index === 0} />
      <div className={styles.body}>
        <div className={styles.metaRow}>
          <span className={styles.kind}>{project.kind}</span>
          {project.liveUrl && <span className={styles.live}>Live</span>}
        </div>
        <h3 id={`featured-${project.repo}`} className={styles.featuredTitle}>
          {project.title}
        </h3>
        <p className={styles.summary}>{project.summary}</p>
        {index < 2 && d && (
          <ul className={styles.points}>
            {d.features.slice(0, 3).map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        )}
        <ul className={styles.tech} aria-label="Technologies">
          {project.tech.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <ProjectLinks project={project} onDetails={() => onDetails(project)} />
        </div>
      </div>
    </article>
  );
}
