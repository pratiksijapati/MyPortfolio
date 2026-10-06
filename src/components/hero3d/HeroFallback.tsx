import styles from "./HeroFallback.module.css";

// Static illustration of the same "developer workspace" idea. It is the placeholder
// while the 3D scene loads and the permanent visual when WebGL isn't used.

const codeRows = [
  [40, 90],
  [60, 140, 50],
  [80, 70],
  [80, 110, 60],
  [60, 50],
  [40, 120],
  [40, 0],
  [40, 160, 40],
];

export function HeroFallback() {
  return (
    <svg className={styles.svg} viewBox="0 0 600 520" role="img" aria-label="Illustration of a developer workspace: code editor, terminal, API and database">
      <defs>
        <radialGradient id="hf-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#8b7cf8" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#8b7cf8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hf-orb" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#c9c1ff" />
          <stop offset="55%" stopColor="#8b7cf8" />
          <stop offset="100%" stopColor="#3b2f9e" />
        </radialGradient>
        <linearGradient id="hf-panel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#171925" />
          <stop offset="100%" stopColor="#0d0e14" />
        </linearGradient>
      </defs>

      <rect width="600" height="520" fill="url(#hf-glow)" />

      {/* monitor */}
      <g className={styles.float1}>
        <rect x="120" y="150" width="360" height="220" rx="14" fill="url(#hf-panel)" className={styles.stroke} />
        {codeRows.map((row, i) => {
          let x = 150;
          return row.map((w, j) => {
            const el = w ? (
              <rect
                key={`${i}-${j}`}
                x={x}
                y={180 + i * 22}
                width={w}
                height="8"
                rx="4"
                className={j === 0 ? styles.kw : j === 1 ? styles.fn : styles.str}
              />
            ) : null;
            x += w + 10;
            return el;
          });
        })}
        <rect x="280" y="370" width="40" height="40" className={styles.stand} />
        <rect x="230" y="408" width="140" height="8" rx="4" className={styles.stand} />
      </g>

      {/* component window */}
      <g className={styles.float2}>
        <rect x="30" y="60" width="200" height="120" rx="12" fill="url(#hf-panel)" className={styles.stroke} />
        <circle cx="50" cy="78" r="4" fill="#ff6b6b" opacity="0.8" />
        <circle cx="64" cy="78" r="4" fill="#ffcc66" opacity="0.8" />
        <circle cx="78" cy="78" r="4" fill="#3ddbc3" opacity="0.8" />
        <rect x="48" y="102" width="120" height="7" rx="3.5" className={styles.kw} />
        <rect x="64" y="120" width="140" height="7" rx="3.5" className={styles.fn} />
        <rect x="64" y="138" width="90" height="7" rx="3.5" className={styles.str} />
        <rect x="48" y="156" width="40" height="7" rx="3.5" className={styles.dim} />
        <g transform="translate(40 30)">
          <rect width="104" height="26" rx="13" className={styles.pill} />
          <circle cx="15" cy="13" r="4" className={styles.dotA} />
          <text x="26" y="17.5" className={styles.label}>Frontend</text>
        </g>
      </g>

      {/* terminal */}
      <g className={styles.float3}>
        <rect x="400" y="300" width="180" height="110" rx="12" fill="url(#hf-panel)" className={styles.stroke} />
        <text x="416" y="336" className={styles.term}>$ npm run build</text>
        <text x="416" y="358" className={styles.termOk}>✓ built</text>
        <text x="416" y="380" className={styles.term}>$ manage.py migrate</text>
        <g transform="translate(470 420)">
          <rect width="98" height="26" rx="13" className={styles.pill} />
          <circle cx="15" cy="13" r="4" className={styles.dotB} />
          <text x="26" y="17.5" className={styles.label}>Backend</text>
        </g>
      </g>

      {/* orb */}
      <g className={styles.float2}>
        <circle cx="490" cy="110" r="42" fill="url(#hf-orb)" />
        <ellipse cx="490" cy="110" rx="72" ry="20" transform="rotate(-18 490 110)" fill="none" className={styles.ring} />
        <g transform="translate(450 168)">
          <rect width="84" height="26" rx="13" className={styles.pill} />
          <circle cx="15" cy="13" r="4" className={styles.dotA} />
          <text x="26" y="17.5" className={styles.label}>AI / ML</text>
        </g>
      </g>

      {/* database */}
      <g className={styles.float3}>
        {[0, 18, 36].map((dy, i) => (
          <ellipse key={dy} cx="70" cy={330 + dy} rx="34" ry="11" className={i === 0 ? styles.dbTop : styles.db} />
        ))}
        <g transform="translate(22 384)">
          <rect width="104" height="26" rx="13" className={styles.pill} />
          <circle cx="15" cy="13" r="4" className={styles.dotB} />
          <text x="26" y="17.5" className={styles.label}>Database</text>
        </g>
      </g>

      {/* API connector lines */}
      <path d="M230 140 C 260 160, 270 160, 300 150" className={styles.wire} />
      <path d="M480 300 C 470 280, 480 260, 470 250" className={styles.wire} />
      <path d="M104 330 C 130 300, 120 280, 120 270" className={styles.wire} />
    </svg>
  );
}
