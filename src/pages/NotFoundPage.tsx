import { PageLayout } from "./PageLayout";
import styles from "./PageLayout.module.css";

export function NotFoundPage() {
  return (
    <PageLayout title="Page not found" backHref="/" backLabel="Home">
      <div className="container">
        <header className={styles.hero}>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.lead}>This link may be old or mistyped.</p>
          <div className={styles.actions}>
            <a href="/" className="btn btn-primary">
              Go to the home page
            </a>
          </div>
        </header>
      </div>
    </PageLayout>
  );
}

export default NotFoundPage;
