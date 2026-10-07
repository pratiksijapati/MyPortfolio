import { DesignCover } from "../components/design/DesignCover";
import { DesignImage } from "../components/design/DesignImage";
import { designAreas, designCaseStudy as cs } from "../data/designWork";
import { NotFoundPage } from "./NotFoundPage";
import { PageLayout } from "./PageLayout";
import styles from "./PageLayout.module.css";

export default function DesignCaseStudyPage({ slug }: { slug: string }) {
  if (slug !== cs.slug) return <NotFoundPage />;
  const lead = designAreas.find((a) => a.images.length)?.images[0];

  return (
    <PageLayout title={cs.title} current="design" backHref="/#design" backLabel="Back to design">
      <article className="container" aria-labelledby="case-title">
        <header className={styles.hero}>
          <p className={styles.kind}>{cs.subtitle}</p>
          <h1 id="case-title" className={styles.title}>
            {cs.title}
          </h1>
          <p className={styles.lead}>{cs.overview}</p>
        </header>

        <figure className={styles.figure}>
          {lead ? (
            <DesignImage image={lead} sizes="(max-width: 1240px) calc(100vw - 2rem), 1200px" />
          ) : (
            <DesignCover title={cs.title} label={`${cs.role} · ${cs.period}`} />
          )}
        </figure>

        <div className={styles.layout}>
          <div className={styles.content}>
            <section aria-labelledby="problem">
              <h2 id="problem">The problem</h2>
              <p>{cs.problem}</p>
            </section>

            <section aria-labelledby="role">
              <h2 id="role">My role</h2>
              <ul className={styles.bullets}>
                {cs.myRole.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>

            {designAreas.map((area) => (
              <section key={area.id} id={area.id} aria-labelledby={`${area.id}-title`}>
                <h2 id={`${area.id}-title`}>{area.title}</h2>
                <p>{area.summary}</p>
                <ul className={styles.bullets} style={{ marginTop: "0.75rem" }}>
                  {area.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                {area.images.length > 0 && (
                  <div className={styles.gallery} style={{ marginTop: "1.25rem" }}>
                    {area.images.map((img) => (
                      <figure key={img.src} className={styles.figure}>
                        <DesignImage image={img} sizes="(max-width: 760px) calc(100vw - 2rem), 440px" />
                        {img.caption && <figcaption className={styles.caption}>{img.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                )}
              </section>
            ))}

            <section aria-labelledby="decisions">
              <h2 id="decisions">Design decisions</h2>
              <ul className={styles.bullets}>
                {cs.decisions.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="collaboration">
              <h2 id="collaboration">Working with developers</h2>
              <p>{cs.collaboration}</p>
            </section>
          </div>

          <aside className={styles.aside} aria-label="Project facts">
            <div className={styles.asideBlock}>
              <h2>Role</h2>
              <p>{cs.role}</p>
            </div>
            <div className={styles.asideBlock}>
              <h2>When</h2>
              <p>{cs.period}</p>
            </div>
            <div className={styles.asideBlock}>
              <h2>Tools</h2>
              <ul className={styles.chips}>
                {cs.tools.map((t) => (
                  <li key={t} className="tag">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </PageLayout>
  );
}
