import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";
import { githubUrl } from "../data/socials";
import { usePrefersReducedMotion } from "../hooks/useMediaQuery";
import { detectSceneQuality, type SceneQuality } from "../lib/device";
import { HeroFallback } from "./hero3d/HeroFallback";
import { Icon } from "./Icon";
import styles from "./Hero.module.css";

const Hero3D = lazy(() => import("./hero3d/Hero3D"));

const STACK = ["Frontend", "API", "Backend", "Database", "UI/UX design"];

/** Resolve after the page has loaded and the main thread is idle, so 3D never competes with content. */
function whenIdle(cb: () => void) {
  let cancelled = false;
  const run = () => {
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 300));
    idle(() => !cancelled && cb(), { timeout: 2500 });
  };
  if (document.readyState === "complete") run();
  else window.addEventListener("load", run, { once: true });
  return () => {
    cancelled = true;
    window.removeEventListener("load", run);
  };
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [quality, setQuality] = useState<SceneQuality | null>(null);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => whenIdle(() => setQuality(detectSceneQuality())), []);

  const use3D = quality === "full" || quality === "lite";

  return (
    <section id="home" ref={sectionRef} className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          {profile.available && (
            <p className={styles.status}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>{profile.availabilityText}</span>
            </p>
          )}

          <h1 id="hero-title" className={styles.title}>
            <span className={styles.hello}>Hi, I'm</span>
            <span className={styles.name}>{profile.name}</span>
            <span className={styles.role}>
              <span className="gradient-text">Full-Stack</span> Developer
            </span>
          </h1>

          <p className={styles.tagline}>{profile.tagline}</p>

          <div className={styles.actions}>
            <a href="#development" className="btn btn-primary">
              View My Work <Icon name="arrowRight" />
            </a>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="btn">
              <Icon name="github" /> GitHub
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
            <a href="#contact" className="btn">
              Contact Me
            </a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} className="btn" download>
                <Icon name="download" /> Download CV
                <span className="visually-hidden"> (PDF)</span>
              </a>
            )}
          </div>

          <ul className={styles.stack} aria-label="What I work across">
            {STACK.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className={styles.visual}>
          <div className={`${styles.fallback} ${sceneReady ? styles.hidden : ""}`}>
            <HeroFallback />
          </div>
          {use3D && (
            <Suspense fallback={null}>
              <div className={`${styles.canvas} ${sceneReady ? styles.shown : ""}`}>
                <Hero3D
                  quality={quality}
                  reducedMotion={reducedMotion}
                  eventSource={sectionRef}
                  onReady={() => setSceneReady(true)}
                />
              </div>
            </Suspense>
          )}
        </div>
      </div>

      <a href="#about" className={styles.scrollHint}>
        <span className="visually-hidden">Scroll to About</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>
    </section>
  );
}
