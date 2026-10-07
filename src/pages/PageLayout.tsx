import { useEffect, type ReactNode } from "react";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { useReveal } from "../hooks/useReveal";
import styles from "./PageLayout.module.css";

interface Props {
  title: string;
  /** Nav item to highlight, e.g. "development". */
  current?: string;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

/** Shell for standalone pages (project pages, design case study). */
export function PageLayout({ title, current, backHref, backLabel, children }: Props) {
  useReveal();
  useEffect(() => {
    document.title = `${title} | Pratik Sijapati`;
  }, [title]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Navbar onHome={false} current={current} />
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className="container">
          <a href={backHref} className={styles.back}>
            <span aria-hidden="true">←</span> {backLabel}
          </a>
        </div>
        {children}
      </main>
      <Footer onHome={false} />
    </>
  );
}
