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
    title: "StockTable.tsx",
    fontSize: 24,
    palette: p,
    chrome: false,
    lines: [
      [["export function ", kw], ["StockTable", fn], ["() {", txt]],
      [["  const ", kw], ["{ data } ", txt], ["= ", dim], ["useQuery", fn], ["(stockQuery);", txt]],
      [],
      [["  return ", kw], ["(", txt]],
      [["    <", dim], ["Table", fn], [" rows", kw], ["={data}", txt], [" columns", kw], ["={columns}", txt], [" />", dim]],
      [["  );", txt]],
      [["}", txt]],
      [],
      [["// design → frontend → API → database", dim]],
    ],
  });

  const frontend = drawWindow({
    width: 520,
    height: 320,
    title: "Frontend · React",
    fontSize: 19,
    palette: p,
    lines: [
      [["<", dim], ["Dashboard", fn], [">", dim]],
      [["  <", dim], ["StatCard ", fn], ["label", kw], ["=", dim], ['"In stock"', str], [" />", dim]],
      [["  <", dim], ["Filters ", fn], ["onChange", kw], ["={setQuery} />", txt]],
      [["  <", dim], ["StockTable ", fn], ["/>", dim]],
      [["</", dim], ["Dashboard", fn], [">", dim]],
    ],
  });

  const api = drawWindow({
    width: 480,
    height: 320,
    title: "API · GET /api/stock/",
    fontSize: 19,
    palette: p,
    lines: [
      [["[", txt]],
      [["  { ", txt], ['"item"', kw], [": ", dim], ['"Kit A"', str], [",", dim]],
      [["    ", txt], ['"qty"', kw], [": ", dim], ["120", fn], [" },", txt]],
      [["  { ", txt], ['"item"', kw], [": ", dim], ['"Pouch B"', str], [",", dim]],
      [["    ", txt], ['"qty"', kw], [": ", dim], ["48", fn], [" }", txt]],
      [["]", txt]],
    ],
  });

  const backend = drawWindow({
    width: 520,
    height: 320,
    title: "Backend · Django",
    fontSize: 19,
    palette: p,
    lines: [
      [["class ", kw], ["StockViewSet", fn], ["(ModelViewSet):", txt]],
      [["    serializer_class ", txt], ["= ", dim], ["StockSerializer", fn]],
      [["    permission_classes ", txt], ["= ", dim], ["[IsInventory]", fn]],
      [],
      [["    def ", kw], ["get_queryset", fn], ["(self):", txt]],
      [["        return ", kw], ["Stock.objects.all()", txt]],
    ],
  });

  const database = drawTable(p);

  return { monitor, frontend, api, backend, database };
}

/** A small database table: header row and a few rows of muted cells. */
function drawTable(p: Palette) {
  const width = 480;
  const height = 320;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  roundRect(ctx, 1, 1, width - 2, height - 2, 22);
  ctx.fillStyle = "rgba(16, 18, 26, 0.96)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.font = `500 17px ${MONO}`;
  ctx.textBaseline = "middle";
  ctx.fillStyle = p.muted;
  ctx.fillText("Database · PostgreSQL", 24, 30);
  const cols = [
    ["id", 24],
    ["item", 104],
    ["qty", 284],
    ["updated", 364],
  ] as const;
  const top = 64;
  const rowH = 42;
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(16, top, width - 32, rowH);
  ctx.font = `500 16px ${MONO}`;
  ctx.fillStyle = p.accent2;
  cols.forEach(([c, x]) => ctx.fillText(c, x, top + rowH / 2));
  const rows = [
    ["1", "Kit A", "120", "today"],
    ["2", "Pouch B", "48", "today"],
    ["3", "Workbook", "300", "1d ago"],
    ["4", "Sensor set", "16", "2d ago"],
  ];
  ctx.font = `400 16px ${MONO}`;
  rows.forEach((r, i) => {
    const y = top + rowH * (i + 1);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(16, y, width - 32, 1);
    ctx.fillStyle = "#d8d9e3";
    r.forEach((cell, j) => ctx.fillText(cell, cols[j][1], y + rowH / 2));
  });
  return makeTexture(canvas);
}

/** Profile card with my real photo, name and role. Resolves once the photo has loaded. */
export function makeProfileCard(photoUrl: string, name: string, role: string, p: Palette) {
  const width = 512;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const texture = makeTexture(canvas);

  const drawFrame = (img?: HTMLImageElement) => {
    ctx.clearRect(0, 0, width, height);
    roundRect(ctx, 1, 1, width - 2, height - 2, 34);
    ctx.fillStyle = "rgba(18, 20, 28, 0.97)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.lineWidth = 2;
    ctx.stroke();
    const pad = 26;
    const size = width - pad * 2;
    ctx.save();
    roundRect(ctx, pad, pad, size, size, 22);
    ctx.clip();
    ctx.fillStyle = "#1b2638";
    ctx.fillRect(pad, pad, size, size);
    if (img) ctx.drawImage(img, pad, pad, size, size);
    ctx.restore();
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = p.text;
    ctx.font = `600 38px "Geist", system-ui, sans-serif`;
    ctx.fillText(name, pad + 4, pad + size + 56);
    ctx.fillStyle = p.accent2;
    ctx.font = `500 22px ${MONO}`;
    ctx.fillText(role, pad + 4, pad + size + 92);
    texture.needsUpdate = true;
  };

  drawFrame();
  const img = new Image();
  img.decoding = "async";
  img.onload = () => drawFrame(img);
  img.src = photoUrl;
  return texture;
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
