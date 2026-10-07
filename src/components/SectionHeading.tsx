import type { ReactNode } from "react";
import styles from "./SectionHeading.module.css";

interface Props {
  id: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  /** Heading level — h1 on standalone pages, h2 on the home page. */
  as?: "h1" | "h2";
}

export function SectionHeading({ id, eyebrow, title, children, as: Tag = "h2" }: Props) {
  return (
    <header className={styles.heading} data-reveal>
      <p className={styles.eyebrow}>
        <span className={styles.rule} aria-hidden="true" />
        {eyebrow}
      </p>
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
      {children && <p className={styles.lead}>{children}</p>}
    </header>
  );
}
