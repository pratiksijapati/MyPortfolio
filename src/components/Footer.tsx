import { profile } from "../data/profile";
import { socials } from "../data/socials";
import { Icon } from "./Icon";
import { NAV_ITEMS } from "./Navbar";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <p className={styles.name}>{profile.name}</p>
          <p className={styles.role}>
            {profile.role} · {profile.location}
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className={styles.links}>
            {NAV_ITEMS.slice(1).map((i) => (
              <li key={i.id}>
                <a href={`#${i.id}`}>{i.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className={styles.socials}>
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                <Icon name={s.icon} size={18} />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className={`container ${styles.bottom}`}>
        <p>
          Designed &amp; built by {profile.name} · © {year}
        </p>
        <a href="#home" className={styles.top}>
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
