// Reads the theme's accent colours from CSS so the 3D scene follows tokens.css.

function cssVar(name: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v.startsWith("#") ? v : fallback;
}

export function readPalette() {
  return {
    accent: cssVar("--accent", "#8b7cf8"),
    accent2: cssVar("--accent-2", "#3ddbc3"),
    text: cssVar("--text", "#ededf2"),
    muted: cssVar("--text-muted", "#a1a3b3"),
    bg: cssVar("--bg", "#08090c"),
    clay: "#c9c6d8",
    surface: "#171922",
    surfaceLight: "#252836",
  };
}

export type Palette = ReturnType<typeof readPalette>;
