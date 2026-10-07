import { profile } from "../../data/profile";
import styles from "./HeroFallback.module.css";

// Static version of the 3D scene: my photo card, a monitor, and the
// Frontend → API → Backend → Database flow. It shows while the 3D scene loads
// and stays when WebGL isn't used.

const codeRows = [
  [40, 90],
  [60, 140, 50],
  [80, 70],
  [80, 110, 60],
  [60, 50],
  [40, 120],
];

const FLOW = [
  { label: "Frontend", x: 440, y: 70 },
  { label: "API", x: 470, y: 170 },
  { label: "Backend", x: 450, y: 270 },
  { label: "Database", x: 420, y: 370 },
];

export function HeroFallback() {
  return (
    <svg
      className={styles.svg}
      viewBox="0 0 600 520"
      role="img"
      aria-label={`${profile.name}, ${profile.role}. Illustration of a workspace with frontend, API, backend and database.`}
    >
      <defs>
        <radialGradient id="hf-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#8b7cf8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#8b7cf8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hf-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#171925" />
          <stop offset="100%" stopColor="#0d0e14" />
        </linearGradient>
        <clipPath id="hf-photo">
          <rect x="44" y="196" width="168" height="168" rx="14" />
        </clipPath>
      </defs>

      <rect width="600" height="520" fill="url(#hf-glow)" />

      {/* monitor */}
      <g>
        <rect x="190" y="110" width="250" height="160" rx="12" fill="url(#hf-panel)" className={styles.stroke} />
        {codeRows.map((row, i) => {
          let x = 212;
          return row.map((w, j) => {
            const el = (
              <rect
                key={`${i}-${j}`}
                x={x}
                y={136 + i * 20}
                width={w * 0.8}
                height="7"
                rx="3.5"
                className={j === 0 ? styles.kw : j === 1 ? styles.fn : styles.str}
              />
            );
            x += w * 0.8 + 8;
            return el;
          });
        })}
        <rect x="300" y="270" width="30" height="34" className={styles.stand} />
        <rect x="262" y="302" width="106" height="7" rx="3.5" className={styles.stand} />
        <rect x="150" y="318" width="330" height="8" rx="4" className={styles.desk} />
      </g>

      {/* flow: frontend → API → backend → database */}
      <path
        d={`M${FLOW[0].x + 50} ${FLOW[0].y + 13} C 560 110, 560 140, ${FLOW[1].x + 40} ${FLOW[1].y + 13} S 560 250, ${FLOW[2].x + 50} ${FLOW[2].y + 13} S 540 350, ${FLOW[3].x + 52} ${FLOW[3].y + 13}`}
        className={styles.wire}
      />
      {FLOW.map((f, i) => (
        <g key={f.label} transform={`translate(${f.x} ${f.y})`} className={i % 2 ? styles.float2 : styles.float3}>
          <rect width={f.label.length * 8.5 + 40} height="26" rx="13" className={styles.pill} />
          <circle cx="15" cy="13" r="4" className={i % 2 ? styles.dotB : styles.dotA} />
          <text x="26" y="17.5" className={styles.label}>
            {f.label}
          </text>
        </g>
      ))}

      {/* profile card with my photo */}
      <g className={styles.float1}>
        <rect x="30" y="182" width="196" height="262" rx="20" className={styles.card} />
        <rect x="44" y="196" width="168" height="168" rx="14" fill="#1b2638" />
        <image
          href={`${profile.photo.square}-256.webp`}
          x="44"
          y="196"
          width="168"
          height="168"
          clipPath="url(#hf-photo)"
          preserveAspectRatio="xMidYMid slice"
        />
        <text x="48" y="396" className={styles.cardName}>
          {profile.name}
        </text>
        <text x="48" y="420" className={styles.cardRole}>
          {profile.role}
        </text>
      </g>
    </svg>
  );
}
