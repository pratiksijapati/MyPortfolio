import { CanvasTexture, SRGBColorSpace } from "three";
import type { Palette } from "./palette";

// Every screen, panel and label in the scene is drawn once onto a small canvas —
// no image downloads, a few hundred KB of GPU memory in total.

type Token = [text: string, color: string];
type Line = Token[];

const MONO = '"Geist Mono", ui-monospace, Consolas, monospace';

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function makeTexture(canvas: HTMLCanvasElement) {
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

interface WindowOptions {
  width: number;
  height: number;
  title: string;
  lines: Line[];
  fontSize: number;
  palette: Palette;
  /** Draw a window frame (title bar + border). Monitor screens skip it. */
  chrome?: boolean;
}

function drawWindow({ width, height, title, lines, fontSize, palette, chrome = true }: WindowOptions) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const r = chrome ? 22 : 0;

  roundRect(ctx, 1, 1, width - 2, height - 2, r);
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "rgba(22, 24, 34, 0.96)");
  bg.addColorStop(1, "rgba(12, 13, 19, 0.96)");
  ctx.fillStyle = bg;
  ctx.fill();
  if (chrome) {
    ctx.strokeStyle = "rgba(255,255,255,0.14)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const barH = fontSize * 2.2;
  ["#ff6b6b", "#ffcc66", "#3ddbc3"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(fontSize * 1.2 + i * fontSize * 1.05, barH / 2, fontSize * 0.32, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  ctx.font = `500 ${fontSize * 0.85}px ${MONO}`;
  ctx.fillStyle = palette.muted;
  ctx.textBaseline = "middle";
  ctx.fillText(title, fontSize * 4.6, barH / 2 + 1);
  ctx.fillStyle = "rgba(255,255,255,0.07)";
  ctx.fillRect(0, barH, width, 2);

  ctx.font = `400 ${fontSize}px ${MONO}`;
  const lineH = fontSize * 1.6;
  lines.forEach((line, i) => {
    let x = fontSize * 1.1;
    const y = barH + fontSize * 1.2 + i * lineH;
    if (y > height - fontSize * 0.6) return;
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillText(String(i + 1).padStart(2, " "), x, y);
    x += fontSize * 2.2;
    for (const [text, color] of line) {
      ctx.fillStyle = color;
      ctx.fillText(text, x, y);
      x += ctx.measureText(text).width;
    }
  });
  return makeTexture(canvas);
}

export function makeTextures(p: Palette) {
  const kw = p.accent;
  const fn = p.accent2;
  const str = "#f0b97a";
  const txt = "#d8d9e3";
  const dim = "#6f7183";

  const monitor = drawWindow({
    width: 1024,
    height: 620,
    title: "projects/api.py",
    fontSize: 24,
    palette: p,
    chrome: false,
    lines: [
      [["from ", kw], ["fastapi ", txt], ["import ", kw], ["APIRouter", fn]],
      [],
      [["router ", txt], ["= ", dim], ["APIRouter", fn], ["(prefix=", txt], ['"/api/projects"', str], [")", txt]],
      [],
      [["@router", kw], [".get", fn], ['("/")', str]],
      [["async def ", kw], ["list_projects", fn], ["(db: ", txt], ["Session", fn], ["):", txt]],
      [["    rows ", txt], ["= ", dim], ["db.query(", txt], ["Project", fn], [").all()", txt]],
      [["    return ", kw], ["[p.to_dict() ", txt], ["for ", kw], ["p ", txt], ["in ", kw], ["rows]", txt]],
      [],
      [["# frontend → API → database → back again", dim]],
    ],
  });

  const component = drawWindow({
    width: 560,
    height: 360,
    title: "ProjectCard.tsx",
    fontSize: 19,
    palette: p,
    lines: [
      [["export function ", kw], ["ProjectCard", fn], ["({ p }) {", txt]],
      [["  return ", kw], ["(", txt]],
      [["    <", dim], ["article ", fn], ["className", kw], ["=", dim], ['"card"', str], [">", dim]],
      [["      <", dim], ["h3", fn], [">{p.title}</", txt], ["h3", fn], [">", dim]],
      [["      <", dim], ["Tags ", fn], ["items", kw], ["={p.tech} />", txt]],
      [["    </", dim], ["article", fn], [">", dim]],
      [["  );", txt]],
      [["}", txt]],
    ],
  });

  const terminal = drawWindow({
    width: 520,
    height: 300,
    title: "terminal",
    fontSize: 19,
    palette: p,
    lines: [
      [["$ ", fn], ["python manage.py migrate", txt]],
      [["  Applying ", dim], ["core.0007", txt], ["... OK", fn]],
      [["$ ", fn], ["npm run build", txt]],
      [["  ✓ built in 1.84s", fn]],
      [["$ ", fn], ["git push origin main", txt]],
      [["  → deploying…", dim]],
    ],
  });

  const json = drawWindow({
    width: 460,
    height: 300,
    title: "GET /api/health",
    fontSize: 19,
    palette: p,
    lines: [
      [["{", txt]],
      [['  "status"', kw], [": ", dim], ['"healthy"', str], [",", dim]],
      [['  "db"', kw], [": ", dim], ['"postgres"', str], [",", dim]],
      [['  "auth"', kw], [": ", dim], ['"jwt"', str]],
      [["}", txt]],
    ],
  });

  return { monitor, component, terminal, json };
}

/** Pill-shaped label, e.g. "● Backend". Returned with its aspect ratio. */
export function makeLabel(text: string, dotColor: string, p: Palette) {
  const fontSize = 34;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  ctx.font = `500 ${fontSize}px ${MONO}`;
  const w = Math.ceil(ctx.measureText(text).width) + fontSize * 2.4;
  const h = fontSize * 1.9;
  canvas.width = w;
  canvas.height = h;
  ctx.font = `500 ${fontSize}px ${MONO}`;
  roundRect(ctx, 1, 1, w - 2, h - 2, h / 2);
  ctx.fillStyle = "rgba(14, 16, 22, 0.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(fontSize * 0.95, h / 2, fontSize * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = p.text;
  ctx.textBaseline = "middle";
  ctx.fillText(text, fontSize * 1.5, h / 2 + 2);
  return { texture: makeTexture(canvas), aspect: w / h };
}
