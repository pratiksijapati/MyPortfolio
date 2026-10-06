/**
 * How much 3D this device should get:
 *  - "full":   desktop scene (workspace, developer, panels, particles, cursor parallax)
 *  - "lite":   phones/tablets — a smaller scene with fewer objects and no parallax
 *  - "static": no WebGL, data-saver on, or a very low-end device → static illustration
 */
export type SceneQuality = "full" | "lite" | "static";

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean; effectiveType?: string };
};

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export function detectSceneQuality(): SceneQuality {
  const nav = navigator as NavigatorHints;
  if (nav.connection?.saveData) return "static";
  if (nav.connection?.effectiveType && /(^|-)2g$/.test(nav.connection.effectiveType)) return "static";
  if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency ?? 8) <= 2) return "static";
  if (!hasWebGL()) return "static";
  const small = window.matchMedia("(max-width: 899px), (pointer: coarse)").matches;
  return small ? "lite" : "full";
}
