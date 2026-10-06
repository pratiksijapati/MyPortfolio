import { languageStats, type Project } from "../../lib/projects";
import type { GithubData } from "../../lib/github";
import { Icon } from "../Icon";
import styles from "./GithubActivity.module.css";

const dateFmt = new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" });

export function GithubActivity({ data, projects }: { data: GithubData; projects: Project[] }) {
  const languages = languageStats(data).slice(0, 6);
  const total = languages.reduce((sum, [, n]) => sum + n, 0);
  const recent = projects
    .filter((p) => p.updatedAt && !p.owner)
    .sort((a, b) => b.updatedAt!.localeCompare(a.updatedAt!))
    .slice(0, 3);

  return (
    <section className={styles.panel} data-reveal aria-labelledby="github-title">
      <div className={styles.intro}>
        <span className={styles.icon}>
          <Icon name="github" size={22} />
        </span>
        <div>
          <h3 id="github-title" className={styles.title}>
            On GitHub
          </h3>
          <a href={data.user.url} target="_blank" rel="noreferrer" className={styles.handle}>
            @{data.user.login}
            <Icon name="arrowUpRight" size={14} />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>
        <p className={styles.stat}>
          <span className={styles.statValue}>{data.user.publicRepos}</span>
          <span className={styles.statLabel}>public repositories</span>
        </p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Primary languages</h4>
        <div className={styles.bar} aria-hidden="true">
          {languages.map(([lang, n], i) => (
            <span key={lang} style={{ flexGrow: n, opacity: 1 - i * 0.13 }} />
          ))}
        </div>
        <ul className={styles.langs}>
          {languages.map(([lang, n]) => (
            <li key={lang}>
              {lang} <span>{Math.round((n / total) * 100)}%</span>
            </li>
          ))}
        </ul>
        <p className={styles.footnote}>Share of repositories by their main language.</p>
      </div>

      <div className={styles.block}>
        <h4 className={styles.blockTitle}>Recently updated</h4>
        <ul className={styles.recent}>
          {recent.map((p) => (
            <li key={p.repo}>
              <a href={p.url} target="_blank" rel="noreferrer">
                <span className={styles.recentName}>{p.title}</span>
                <span className={styles.recentDate}>{dateFmt.format(new Date(p.updatedAt!))}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
