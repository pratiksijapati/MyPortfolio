import { useEffect, useRef } from "react";
import type { Project } from "../../lib/projects";
import { Icon } from "../Icon";
import { ProjectLinks } from "./ProjectCard";
import styles from "./ProjectDetails.module.css";

// Native <dialog>: focus trapping, Escape-to-close and the backdrop come from the browser.

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className={styles.block}>
      <h4 className={styles.blockTitle}>{title}</h4>
      <ul className={styles.chips}>
        {items.map((i) => (
          <li key={i} className="tag">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectDetails({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) dialog.showModal();
    if (!project && dialog.open) dialog.close();
  }, [project]);

  const d = project?.details;

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby="project-details-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {project && d && (
        <div className={styles.inner}>
          <header className={styles.header}>
            <div>
              <p className={styles.kind}>{project.kind}</p>
              <h3 id="project-details-title" className={styles.title}>
                {project.title}
              </h3>
            </div>
            <button type="button" className={styles.close} onClick={() => ref.current?.close()} aria-label="Close details">
              <Icon name="close" />
            </button>
          </header>

          <div className={styles.content}>
            <p className={styles.overview}>{d.overview}</p>

            {d.problem && (
              <div className={styles.block}>
                <h4 className={styles.blockTitle}>The problem</h4>
                <p>{d.problem}</p>
              </div>
            )}

            <div className={styles.block}>
              <h4 className={styles.blockTitle}>Main features</h4>
              <ul className={styles.features}>
                {d.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>

            <div className={styles.stackGrid}>
              <List title="Frontend" items={d.frontend} />
              <List title="Backend" items={d.backend} />
              <List title="Machine learning" items={d.ml} />
              <List title="Data / database" items={d.database} />
            </div>

            {d.architecture && (
              <div className={styles.block}>
                <h4 className={styles.blockTitle}>Architecture</h4>
                <p>{d.architecture}</p>
              </div>
            )}

            {d.note && (
              <p className={styles.note}>
                <Icon name="info" size={16} /> {d.note}
              </p>
            )}
          </div>

          <footer className={styles.footer}>
            <ProjectLinks project={project} />
          </footer>
        </div>
      )}
    </dialog>
  );
}
