import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface Props {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}

export function SectionHeading({ id, index, eyebrow, title, children }: Props) {
  return (
    <header className={styles.heading} data-reveal>
      <p className={styles.eyebrow}>
        <span className={styles.index}>{index}</span>
        <span className={styles.rule} aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {children && <p className={styles.lead}>{children}</p>}
    </header>
  );
}
