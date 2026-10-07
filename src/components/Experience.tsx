import { experience, type Experience as ExperienceItem } from "../data/experience";
import { SectionHeading } from "./SectionHeading";
import styles from "./Experience.module.css";

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <li className={styles.item} data-reveal>
      <div className={styles.meta}>
        <span className={styles.period}>{item.period}</span>
        {[item.location].filter(Boolean).map((m) => (
          <span key={m} className={styles.type}>
            {m}
          </span>
        ))}
      </div>
      <article className={styles.card}>
        <h3 className={styles.role}>{item.role}</h3>
        <p className={styles.org}>{item.organization}</p>
        <p className={styles.summary}>{item.summary}</p>
        <ul className={styles.duties}>
          {item.responsibilities.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <ul className={styles.tags} aria-label="Areas">
          {item.tags.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="container">
        <SectionHeading id="experience-title" eyebrow="Experience" title="Where I've worked">
          Two roles at Karkhana: first designing the product, now building it.
        </SectionHeading>
        <ol className={styles.timeline}>
          {experience.map((item) => (
            <ExperienceCard key={`${item.organization}-${item.role}`} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}
