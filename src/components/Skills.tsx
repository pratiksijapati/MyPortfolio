import type { CSSProperties } from "react";
import { skillCategories, type SkillCategory as Category } from "../data/skills";
import { SectionHeading } from "./SectionHeading";
import { TechIcon } from "./TechIcon";
import styles from "./Skills.module.css";

function SkillCategory({ category, index }: { category: Category; index: number }) {
  return (
    <article
      className={`${styles.card} ${styles[category.id] ?? ""}`}
      data-reveal
      style={{ "--i": index % 3 } as CSSProperties}
      aria-labelledby={`skill-${category.id}`}
    >
      <header className={styles.head}>
        <span className={styles.num} aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 id={`skill-${category.id}`} className={styles.title}>
          {category.title}
        </h3>
        <p className={styles.blurb}>{category.blurb}</p>
      </header>
      <ul className={styles.list}>
        {category.skills.map((s) => (
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
        <SectionHeading id="skills-title" index="03" eyebrow="Skills" title="A stack that covers the whole product">
          Every item here is used in a project you can open below — from the interface down to the database.
        </SectionHeading>
        <div className={styles.grid}>
          {skillCategories.map((c, i) => (
            <SkillCategory key={c.id} category={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
