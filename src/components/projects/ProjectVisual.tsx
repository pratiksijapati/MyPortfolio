import type { Project } from "../../lib/projects";
import styles from "./ProjectVisual.module.css";

// Cover image for a project. Uses a real screenshot when there is one; otherwise a
// clean diagram built from the project's own data (never a fake screenshot).

function Layers({ rows }: { rows: [string, string][] }) {
  return (
    <div className={styles.layers}>
      {rows.map(([label, value], i) => (
        <div key={label} className={styles.layer} style={{ marginInline: `${i * 7}%` }}>
          <span className={styles.layerLabel}>{label}</span>
          <span className={styles.layerValue}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function first(list: string[] | undefined) {
  return list?.[0]?.replace(/\s*\(.*\)$/, "");
}

export function ProjectVisual({ project, eager = false }: { project: Project; eager?: boolean }) {
  if (project.image) {
    const base = `/projects/${project.image}`;
    return (
      <div className={styles.frame}>
        <img
          src={`${base}-480.webp`}
          srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`}
          sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 400px"
          width={480}
          height={300}
          alt={`Screenshot of ${project.title}`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className={styles.img}
        />
      </div>
    );
  }

  const d = project.details;
  const cats = project.categories;
  let body;
  if (cats.includes("fullstack") && d) {
    const rows: [string, string][] = [];
    const fe = first(d.frontend);
    const be = first(d.backend?.filter((b) => b !== "Python"));
    const db = first(d.database);
    const ml = first(d.ml)?.split(":")[0];
    if (fe) rows.push(["UI", fe]);
    if (be) rows.push(["API", be]);
    if (ml) rows.push(["ML", ml]);
    if (db && !db.startsWith("No database")) rows.push(["DB", db]);
    body = <Layers rows={rows} />;
  } else if (cats.includes("ai")) {
    body = (
      <div className={styles.flow} aria-hidden="true">
        <span>data</span>
        <i />
        <span className={styles.flowMain}>model</span>
        <i />
        <span>insight</span>
      </div>
    );
  } else {
    body = (
      <div className={styles.browser} aria-hidden="true">
        <div className={styles.browserBar}>
          <b />
          <b />
          <b />
        </div>
        <div className={styles.browserBody}>
          <span className={styles.lang}>{project.language ?? project.tech[0] ?? "code"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.frame} ${styles.placeholder} ${cats.includes("ai") ? styles.ai : ""}`} aria-hidden="true">
      {body}
    </div>
  );
}
