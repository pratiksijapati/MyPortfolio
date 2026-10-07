import styles from "./DesignCover.module.css";

/**
 * Plain branded cover for design work that has no exported screens yet.
 * Abstract shapes only — deliberately nothing that looks like an app screen.
 */
export function DesignCover({ title, label, variant = 0 }: { title: string; label: string; variant?: number }) {
  return (
    <div className={`${styles.cover} ${styles[`v${variant % 3}`]}`} role="img" aria-label={`${title} — ${label}`}>
      <svg className={styles.shapes} viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <circle cx="320" cy="60" r="90" className={styles.c1} />
        <circle cx="80" cy="220" r="70" className={styles.c2} />
        <rect x="190" y="110" width="140" height="140" rx="28" transform="rotate(18 260 180)" className={styles.r1} />
        <path d="M0 170 C 90 120, 170 210, 260 150 S 380 90, 400 120" className={styles.line} />
      </svg>
      <div className={styles.text} aria-hidden="true">
        <span className={styles.label}>{label}</span>
        <span className={styles.title}>{title}</span>
      </div>
    </div>
  );
}
