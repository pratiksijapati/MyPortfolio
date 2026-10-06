import { Canvas } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import type { SceneQuality } from "../../lib/device";
import { readPalette } from "./palette";
import { Scene } from "./Scene";

interface Props {
  quality: Exclude<SceneQuality, "static">;
  reducedMotion: boolean;
  /** Element whose pointer movement drives the parallax (the whole hero, not just the canvas). */
  eventSource: RefObject<HTMLElement | null>;
  onReady: () => void;
}

// Loaded lazily from Hero.tsx — three.js never blocks the first paint.
export default function Hero3D({ quality, reducedMotion, eventSource, onReady }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [fontsReady, setFontsReady] = useState(false);
  const palette = useMemo(readPalette, []);

  // Stop rendering entirely while the hero is scrolled out of view.
  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Panel textures are drawn with Geist Mono — wait for it (briefly) so they don't redraw.
  useEffect(() => {
    let done = false;
    const finish = () => !done && ((done = true), setFontsReady(true));
    document.fonts?.load('500 20px "Geist Mono"').then(finish, finish) ?? finish();
    const t = window.setTimeout(finish, 1200);
    return () => window.clearTimeout(t);
  }, []);

  const frameloop = !visible ? "never" : reducedMotion ? "demand" : "always";

  return (
    <div ref={wrapper} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
      {fontsReady && (
        <Canvas
          frameloop={frameloop}
          dpr={quality === "full" ? [1, 1.75] : [1, 1.5]}
          camera={{ fov: quality === "full" ? 34 : 40, position: [0, 1, 6], near: 0.1, far: 40 }}
          gl={{ antialias: quality === "full", alpha: true, powerPreference: "high-performance" }}
          eventSource={quality === "full" ? (eventSource as RefObject<HTMLElement>) : undefined}
          eventPrefix="client"
          onCreated={() => requestAnimationFrame(onReady)}
          style={{ touchAction: "pan-y" }}
        >
          <Scene quality={quality} reducedMotion={reducedMotion} palette={palette} />
        </Canvas>
      )}
    </div>
  );
}
