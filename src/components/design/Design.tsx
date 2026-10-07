import type { CSSProperties } from "react";
import { designAreas, designCaseStudy as cs } from "../../data/designWork";
import { designPath } from "../../lib/routes";
import { Icon } from "../Icon";
import { SectionHeading } from "../SectionHeading";
import { DesignCover } from "./DesignCover";
import { DesignImage } from "./DesignImage";
import styles from "./Design.module.css";

export function Design() {
  const lead = designAreas.find((a) => a.images.length)?.images[0];
  return (
    <section id="design" className="section" aria-labelledby="design-title">
      <div className="container">
        <SectionHeading id="design-title" eyebrow="Design" title="Product & UI/UX design">
          Before moving into development, I spent my time at Karkhana designing the product.
        </SectionHeading>

        <article className={styles.feature} data-reveal aria-labelledby="design-feature-title">
          <a href={designPath(cs.slug)} className={styles.media} tabIndex={-1} aria-hidden="true">
            {lead ? (
              <DesignImage image={lead} sizes="(max-width: 999px) calc(100vw - 2rem), 600px" />
            ) : (
              <DesignCover title="Karkhana" label={`${cs.role} · ${cs.period}`} />
            )}
          </a>
          <div className={styles.body}>
            <p className={styles.kind}>{cs.subtitle}</p>
            <h3 id="design-feature-title" className={styles.title}>
              {cs.title}
            </h3>
            <p className={styles.summary}>{cs.summary}</p>
            <p className={styles.meta}>
              {cs.role} · {cs.period} · {cs.tools.join(", ")}
            </p>
            <a href={designPath(cs.slug)} className={`btn btn-primary ${styles.cta}`}>
              View Case Study <Icon name="arrowRight" />
            </a>
          </div>
        </article>

        <div className={styles.areas}>
          {designAreas.map((area, i) => (
            <article
              key={area.id}
              className={styles.area}
              data-reveal
              style={{ "--i": i } as CSSProperties}
              aria-labelledby={`area-${area.id}`}
            >
              {area.images[0] && (
                <DesignImage image={area.images[0]} sizes="(max-width: 999px) calc(100vw - 2rem), 380px" />
              )}
              <div className={`${styles.areaBody} ${area.images[0] ? "" : styles.areaBodyOnly}`}>
                <h4 id={`area-${area.id}`} className={styles.areaTitle}>
                  {area.title}
                </h4>
                <p className={styles.areaSummary}>{area.summary}</p>
                <a href={`${designPath(cs.slug)}#${area.id}`} className={styles.areaLink}>
                  Read more<span className="visually-hidden"> about {area.title}</span>
                  <Icon name="arrowRight" size={15} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
