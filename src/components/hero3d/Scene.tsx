import { Billboard, Float, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  Vector3,
  type Texture,
} from "three";
import { profile } from "../../data/profile";
import type { SceneQuality } from "../../lib/device";
import type { Palette } from "./palette";
import { makeLabel, makeProfileCard, makeTextures } from "./textures";

interface SceneProps {
  quality: Exclude<SceneQuality, "static">;
  reducedMotion: boolean;
  palette: Palette;
}

type Vec3 = [number, number, number];

function Workspace({ monitor, laptop, palette }: { monitor: Texture; laptop: Texture; palette: Palette }) {
  const metal = { color: palette.surfaceLight, metalness: 0.5, roughness: 0.35 };
  return (
    <group>
      {/* desk */}
      <RoundedBox args={[3.1, 0.07, 1.3]} radius={0.025} position={[0, -0.035, 0]}>
        <meshStandardMaterial color="#2a2d3a" roughness={0.5} metalness={0.15} />
      </RoundedBox>
      {[-1.4, 1.4].map((x) => (
        <mesh key={x} position={[x, -0.6, 0]}>
          <boxGeometry args={[0.05, 1.1, 1.15]} />
          <meshStandardMaterial color="#22252f" roughness={0.6} />
        </mesh>
      ))}
      {/* monitor */}
      <group position={[-0.25, 0, -0.32]}>
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.26, 0.28, 0.025, 32]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <mesh position={[0, 0.3, -0.03]}>
          <boxGeometry args={[0.07, 0.58, 0.04]} />
          <meshStandardMaterial {...metal} />
        </mesh>
        <RoundedBox args={[1.75, 1.06, 0.05]} radius={0.03} position={[0, 0.92, 0]}>
          <meshStandardMaterial color="#1a1c24" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.92, 0.027]}>
          <planeGeometry args={[1.66, 0.98]} />
          <meshBasicMaterial map={monitor} toneMapped={false} />
        </mesh>
      </group>
      {/* laptop, angled toward the camera */}
      <group position={[1.0, 0, 0.05]} rotation={[0, -0.45, 0]}>
        <RoundedBox args={[0.72, 0.025, 0.48]} radius={0.01} position={[0, 0.013, 0]}>
          <meshStandardMaterial {...metal} />
        </RoundedBox>
        <group position={[0, 0.025, -0.24]} rotation={[-0.32, 0, 0]}>
          <RoundedBox args={[0.72, 0.46, 0.02]} radius={0.01} position={[0, 0.23, 0]}>
            <meshStandardMaterial color="#1a1c24" metalness={0.5} roughness={0.35} />
          </RoundedBox>
          <mesh position={[0, 0.23, 0.011]}>
            <planeGeometry args={[0.66, 0.4]} />
            <meshBasicMaterial map={laptop} toneMapped={false} />
          </mesh>
        </group>
      </group>
      {/* keyboard, mug */}
      <RoundedBox args={[0.85, 0.025, 0.25]} radius={0.01} position={[-0.25, 0.013, 0.3]}>
        <meshStandardMaterial color={palette.surfaceLight} roughness={0.6} />
      </RoundedBox>
      <mesh position={[-1.15, 0.085, 0.2]}>
        <cylinderGeometry args={[0.075, 0.07, 0.17, 20]} />
        <meshStandardMaterial color={palette.clay} roughness={0.8} />
      </mesh>
      <pointLight position={[-0.25, 0.9, 0.4]} intensity={1} distance={2.2} color={palette.accent} />
    </group>
  );
}

function Panel({ texture, width, aspect }: { texture: Texture; width: number; aspect: number }) {
  return (
    <mesh>
      <planeGeometry args={[width, width / aspect]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
  );
}

function Label({ text, color, palette, height = 0.17 }: { text: string; color: string; palette: Palette; height?: number }) {
  const label = useMemo(() => makeLabel(text, color, palette), [text, color, palette]);
  useEffect(() => () => label.texture.dispose(), [label]);
  return (
    <Billboard>
      <mesh>
        <planeGeometry args={[height * label.aspect, height]} />
        <meshBasicMaterial map={label.texture} transparent toneMapped={false} depthWrite={false} />
      </mesh>
    </Billboard>
  );
}

/** My real photo on a floating card. */
function ProfileCard({ palette, width }: { palette: Palette; width: number }) {
  const texture = useMemo(
    () => makeProfileCard(`${profile.photo.square}-512.webp`, profile.name, profile.role, palette),
    [palette],
  );
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh>
      <planeGeometry args={[width, width * 1.25]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}

/**
 * Frontend → API → Backend → Database: a thin line through the panels, with one small dot
 * travelling along it (still when reduced motion is on).
 */
function FlowLine({ points, color, animate }: { points: Vec3[]; color: string; animate: boolean }) {
  const curve = useMemo(() => new CatmullRomCurve3(points.map((p) => new Vector3(...p))), [points]);
  const line = useMemo(() => {
    const g = new BufferGeometry().setFromPoints(curve.getPoints(80));
    return new Line(g, new LineBasicMaterial({ color, transparent: true, opacity: 0.35 }));
  }, [curve, color]);
  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineBasicMaterial).dispose();
    },
    [line],
  );
  const dot = useRef<Mesh>(null);
  const t = useRef(0.15);
  useFrame((_, dt) => {
    if (animate) t.current = (t.current + dt * 0.12) % 1;
    dot.current?.position.copy(curve.getPointAt(t.current));
  });
  return (
    <group>
      <primitive object={line} />
      <mesh ref={dot}>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count, color, animate }: { count: number; color: string; animate: boolean }) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = Math.random() * 4.5 - 1.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 1;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (animate && ref.current) ref.current.rotation.y += dt * 0.01;
  });
  return (
    <group ref={ref}>
      <points geometry={geometry}>
        <pointsMaterial size={0.018} color={color} transparent opacity={0.5} depthWrite={false} blending={AdditiveBlending} />
      </points>
    </group>
  );
}

/** Eases the camera toward the cursor — a few degrees at most. */
function CameraRig({ base, target, strength }: { base: Vec3; target: Vec3; strength: number }) {
  const look = useMemo(() => new Vector3(...target), [target]);
  const goal = useMemo(() => new Vector3(), []);
  useFrame(({ camera, pointer }, dt) => {
    goal.set(base[0] + pointer.x * strength, base[1] + pointer.y * strength * 0.5, base[2]);
    camera.position.lerp(goal, 1 - Math.exp(-dt * 2.2));
    camera.lookAt(look);
  });
  return null;
}

/** For reduced motion / lite mode: point the camera once, no cursor tracking. */
function StaticCamera({ position, target }: { position: Vec3; target: Vec3 }) {
  const { camera, invalidate } = useThree();
  useEffect(() => {
    camera.position.set(...position);
    camera.lookAt(...target);
    invalidate();
  }, [camera, invalidate, position, target]);
  return null;
}

const FULL_CAM: Vec3 = [-0.8, 1.5, 7.4];
const FULL_TARGET: Vec3 = [0.2, 0.9, 0];
const LITE_CAM: Vec3 = [0, 0.1, 5.2];
const LITE_TARGET: Vec3 = [0, 0, 0];

// Desktop flow panel positions (also the points the flow line passes through).
const FLOW: { key: "frontend" | "api" | "backend" | "database"; label: string; pos: Vec3; width: number; aspect: number }[] = [
  { key: "frontend", label: "Frontend", pos: [-1.35, 2.15, -0.6], width: 1.2, aspect: 520 / 320 },
  { key: "api", label: "API", pos: [0.75, 2.5, -1.0], width: 1.1, aspect: 480 / 320 },
  { key: "backend", label: "Backend", pos: [2.2, 1.3, -0.6], width: 1.15, aspect: 520 / 320 },
  { key: "database", label: "Database", pos: [2.05, -0.15, 0.4], width: 1.05, aspect: 480 / 320 },
];
const FLOW_POINTS = FLOW.map((f) => f.pos);

const LITE_FLOW: { label: string; pos: Vec3 }[] = [
  { label: "Frontend", pos: [1.0, 1.15, 0] },
  { label: "API", pos: [1.0, 0.4, 0] },
  { label: "Backend", pos: [1.0, -0.35, 0] },
  { label: "Database", pos: [1.0, -1.1, 0] },
];
const LITE_POINTS = LITE_FLOW.map((f) => f.pos);

export function Scene({ quality, reducedMotion, palette }: SceneProps) {
  const textures = useMemo(() => makeTextures(palette), [palette]);
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures]);

  const animate = !reducedMotion;
  // drei <Float>: speed 0 freezes it for reduced motion. Kept small on purpose.
  const float = (speed: number, intensity = 0.25) => ({
    speed: animate ? speed : 0,
    floatIntensity: animate ? intensity : 0,
    rotationIntensity: animate ? 0.06 : 0,
  });

  if (quality === "lite") {
    return (
      <>
        <hemisphereLight args={["#c9c4ff", "#1a1b22", 1.3]} />
        <StaticCamera position={LITE_CAM} target={LITE_TARGET} />
        <Float {...float(1.2, 0.3)} position={[-0.7, 0, 0]}>
          <group rotation={[0, 0.12, 0]}>
            <ProfileCard palette={palette} width={1.55} />
          </group>
        </Float>
        <FlowLine points={LITE_POINTS} color={palette.accent2} animate={animate} />
        {LITE_FLOW.map((f, i) => (
          <group key={f.label} position={f.pos}>
            <Label text={f.label} color={i % 2 ? palette.accent2 : palette.accent} palette={palette} height={0.24} />
          </group>
        ))}
        <Particles count={40} color={palette.accent} animate={animate} />
      </>
    );
  }

  return (
    <>
      <hemisphereLight args={["#c9c4ff", "#1a1b22", 1.3]} />
      <directionalLight position={[3, 6, 6]} intensity={2.2} />
      <directionalLight position={[-6, 3, 4]} intensity={0.9} color="#d9d4ff" />
      {reducedMotion ? (
        <StaticCamera position={FULL_CAM} target={FULL_TARGET} />
      ) : (
        <CameraRig base={FULL_CAM} target={FULL_TARGET} strength={0.4} />
      )}

      <group position={[0.15, -0.6, 0.2]} rotation={[0, 0.28, 0]} scale={1.05}>
        <Workspace monitor={textures.monitor} laptop={textures.backend} palette={palette} />
      </group>

      {FLOW.map((f, i) => (
        <Float key={f.key} {...float(1.1 + i * 0.15)} position={f.pos}>
          <group rotation={[0, -f.pos[0] * 0.14, 0]}>
            <Panel texture={textures[f.key]} width={f.width} aspect={f.aspect} />
            <group position={[0, f.width / f.aspect / 2 + 0.14, 0.05]}>
              <Label text={f.label} color={i % 2 ? palette.accent2 : palette.accent} palette={palette} />
            </group>
          </group>
        </Float>
      ))}
      <FlowLine points={FLOW_POINTS} color={palette.accent2} animate={animate} />

      <Float {...float(0.9, 0.3)} position={[-1.3, 0.55, 1.5]}>
        <group rotation={[0, 0.22, 0]}>
          <ProfileCard palette={palette} width={1.05} />
        </group>
      </Float>

      <Particles count={120} color={palette.accent} animate={animate} />
    </>
  );
}
