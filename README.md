# Pratik Sijapati — Portfolio

Personal portfolio of **Pratik Sijapati, Full-Stack Developer** — https://www.pratiksijapati.com.np/

Built with React 19, TypeScript and Vite, with an interactive Three.js hero
(@react-three/fiber + drei) that is lazy-loaded and degrades gracefully.

## Run locally

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build

```bash
npm run build        # refreshes the GitHub snapshot, type-checks, builds to dist/
npm run preview      # serves dist/ locally
npm run build:offline  # same build without contacting GitHub
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. The custom domain comes from `public/CNAME`.

One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Editing content

Everything personal lives in `src/data/` — components only read from it.

| File | Contents |
|---|---|
| `profile.ts` | Name, tagline, contact details, About text, education, résumé link |
| `experience.ts` | Work history (newest first) |
| `skills.ts` | Skill categories — only list skills a project demonstrates |
| `projects.ts` | Curated project info keyed by GitHub repo name: category, featured, summary, details |
| `socials.ts` | GitHub, LinkedIn, Facebook, Instagram |

Theme colours, fonts and spacing are CSS variables in `src/styles/tokens.css`.

## How GitHub projects stay in sync

1. `scripts/sync-github.mjs` runs before every build and saves my public repositories to
   `src/data/github-snapshot.json`. If GitHub is unreachable, the previous snapshot is kept.
2. The page renders that snapshot immediately, then quietly fetches the live list from
   GitHub's public API in the browser (cached for 6 hours). Any failure keeps the snapshot —
   visitors never see an error.
3. `src/lib/projects.ts` merges the repo list with `src/data/projects.ts`. A new public repo
   appears under **All projects** automatically; add an entry in `projects.ts` to categorise it,
   feature it or give it a detail view. Forks and repos in `excludedRepos` are skipped.

No token is used in the browser. In GitHub Actions the build uses the built-in `GITHUB_TOKEN`
only on the build machine, to avoid rate limits.

## Contact form

Set `VITE_CONTACT_ENDPOINT` to a form endpoint that accepts a JSON POST (for example a
[Formspree](https://formspree.io) form URL) — in `.env` locally, or as an Actions **variable**
for deployment. Without it, the form validates the message and opens the visitor's email app
with it filled in; it never pretends to send.

## 3D hero

`src/components/Hero.tsx` renders the text and a static SVG illustration immediately. After the
page has loaded and the browser is idle, it picks a quality level (`src/lib/device.ts`):

- **full** (desktop): workspace, developer, floating panels, particles, cursor parallax
- **lite** (phones/tablets): orb, two panels, fewer particles, no parallax
- **static**: no WebGL, data-saver, or very low-end devices → the SVG stays

three.js is only downloaded for full/lite. Rendering pauses when the hero is off-screen,
pixel ratio is capped, all textures are drawn on small canvases (no image downloads), and
`prefers-reduced-motion` renders a single still frame.
