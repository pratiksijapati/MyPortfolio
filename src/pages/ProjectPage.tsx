import { ProjectLinks } from "../components/projects/ProjectCard";
import { ProjectImage } from "../components/projects/ProjectImage";
import { projectBySlug } from "../lib/projects";
import { NotFoundPage } from "./NotFoundPage";
import { PageLayout } from "./PageLayout";
import styles from "./PageLayout.module.css";

function Chips({ title, items }: { title: string; items?: string[] }) {
  if (!items?.length) return null;
  return (
    <div className={styles.asideBlock}>
      <h2>{title}</h2>
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

export default function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug);
  if (!project?.details) return <NotFoundPage />;
  const d = project.details;
  const phones = project.gallery?.filter((g) => g.ratio < 1) ?? [];
  const wide = project.gallery?.filter((g) => g.ratio >= 1) ?? [];

  return (
    <PageLayout title={project.title} current="development" backHref="/#development" backLabel="All projects">
      <article className="container" aria-labelledby="project-title">
        <header className={styles.hero}>
          <p className={styles.kind}>{project.kind}</p>
          <h1 id="project-title" className={styles.title}>
            {project.title}
          </h1>
          <p className={styles.lead}>{d.overview}</p>
          <div className={styles.actions}>
            <ProjectLinks project={project} showPage={false} />
          </div>
        </header>

        {project.cover && (
          <figure className={styles.figure}>
            <ProjectImage image={project.cover} sizes="(max-width: 1240px) calc(100vw - 2rem), 1200px" eager />
          </figure>
        )}

        <div className={styles.layout}>
          <div className={styles.content}>
            {d.problem && (
              <section aria-labelledby="problem">
                <h2 id="problem">The problem</h2>
                <p>{d.problem}</p>
              </section>
            )}

            <section aria-labelledby="features">
              <h2 id="features">What it does</h2>
              <ul className={styles.bullets}>
                {d.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            {(wide.length > 0 || phones.length > 0) && (
              <section aria-labelledby="screens">
                <h2 id="screens">Screenshots</h2>
                {wide.length > 0 && (
                  <div className={styles.gallery}>
                    {wide.map((g) => (
                      <figure key={g.src} className={styles.figure}>
                        <ProjectImage image={g} sizes="(max-width: 760px) calc(100vw - 2rem), 440px" />
                        {g.caption && <figcaption className={styles.caption}>{g.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                )}
                {phones.length > 0 && (
                  <div className={styles.galleryPhones}>
                    {phones.map((g) => (
                      <figure key={g.src} className={styles.figure}>
                        <ProjectImage image={g} sizes="(max-width: 760px) 45vw, 220px" />
                        {g.caption && <figcaption className={styles.caption}>{g.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            )}

            {d.implementation && (
              <section aria-labelledby="implementation">
                <h2 id="implementation">How it's built</h2>
                <p>{d.implementation}</p>
              </section>
            )}

            {d.note && <p className={styles.note}>{d.note}</p>}
          </div>

          <aside className={styles.aside} aria-label="Tech stack">
            <Chips title="Frontend" items={d.frontend} />
            <Chips title="Backend" items={d.backend} />
            <Chips title="Machine learning" items={d.ml} />
            <Chips title="Data" items={d.database} />
          </aside>
        </div>
      </article>
    </PageLayout>
  );
}
