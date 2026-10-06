import type { CSSProperties } from "react";
import { about, education, profile } from "../data/profile";
import { Icon } from "./Icon";
import { SectionHeading } from "./SectionHeading";
import styles from "./About.module.css";

export function About() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHeading
          id="about-title"
          index="01"
          eyebrow="About"
          title={
            <>
              I build products end to end — <span className="gradient-text">interface, API and data.</span>
            </>
          }
        />

        <div className={styles.grid}>
          <div className={styles.text}>
            {about.paragraphs.map((p, i) => (
              <p key={i} data-reveal style={{ "--i": i } as CSSProperties}>
                {p}
              </p>
            ))}
            <p className={styles.location} data-reveal>
              <Icon name="pin" size={16} /> {profile.location}
            </p>
          </div>

          <aside className={styles.side}>
            <ul className={styles.highlights}>
              {about.highlights.map((h, i) => (
                <li key={h.label} data-reveal style={{ "--i": i } as CSSProperties}>
                  <span className={styles.hValue}>{h.value}</span>
                  <span className={styles.hLabel}>{h.label}</span>
                </li>
              ))}
            </ul>

            <div className={styles.education} data-reveal>
              <h3 className={styles.subhead}>Education</h3>
              <ol>
                {education.map((e) => (
                  <li key={e.title}>
                    <span className={styles.period}>{e.period}</span>
                    <span className={styles.eduTitle}>{e.title}</span>
                    <span className={styles.place}>{e.place}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
