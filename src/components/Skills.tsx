import type { CSSProperties } from "react";
import { exploring, skillGroups, type SkillGroup as Group } from "../data/skills";
import { SectionHeading } from "./SectionHeading";
import { TechIcon } from "./TechIcon";
import styles from "./Skills.module.css";

function SkillGroup({ group, index }: { group: Group; index: number }) {
  return (
    <article
      className={`${styles.card} ${styles[group.id] ?? ""}`}
      data-reveal
      style={{ "--i": index % 3 } as CSSProperties}
      aria-labelledby={`skill-${group.id}`}
    >
      <h3 id={`skill-${group.id}`} className={styles.title}>
        {group.title}
      </h3>
      <ul className={styles.list}>
        {group.skills.map((s) => (
          <li key={s.name} className={styles.skill}>
            {s.icon ? <TechIcon slug={s.icon} size={15} /> : <span className={styles.bullet} aria-hidden="true" />}
            {s.name}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Skills() {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="container">
        <SectionHeading id="skills-title" eyebrow="Skills" title="What I work with" />
        <div className={styles.grid}>
          {skillGroups.map((g, i) => (
            <SkillGroup key={g.id} group={g} index={i} />
          ))}
        </div>
        <p className={styles.exploring} data-reveal>
          <span className={styles.exploringLabel}>{exploring.title}</span> {exploring.text}
        </p>
      </div>
    </section>
  );
}
