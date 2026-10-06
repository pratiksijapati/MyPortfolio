import { Billboard, ContactShadows, Float, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Group,
  Quaternion,
  Vector3,
  type Texture,
} from "three";
import type { SceneQuality } from "../../lib/device";
import type { Palette } from "./palette";
import { makeLabel, makeTextures } from "./textures";

interface SceneProps {
  quality: Exclude<SceneQuality, "static">;
  reducedMotion: boolean;
  palette: Palette;
}

type Vec3 = [number, number, number];

const UP = new Vector3(0, 1, 0);

/** A capsule stretched between two points — used for the stylised developer's limbs. */
function Limb({ from, to, radius, color }: { from: Vec3; to: Vec3; radius: number; color: string }) {
  const { position, quaternion, length } = useMemo(() => {
    const a = new Vector3(...from);
    const b = new Vector3(...to);
    const dir = b.clone().sub(a);
    const len = dir.length();
    return {
      position: a.add(b).multiplyScalar(0.5),
      quaternion: new Quaternion().setFromUnitVectors(UP, dir.normalize()),
      length: Math.max(len - radius * 2, 0.001),
    };
  }, [from, to, radius]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <capsuleGeometry args={[radius, length, 4, 12]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  );
}

/** Low-poly, monochrome "clay" developer seated at the desk, facing the monitor (-z). */
function Developer({ palette }: { palette: Palette }) {
  const clay = palette.clay;
  const dark = "#3a3d4f";
  const shirt = "#5d6180";
  return (
    <group position={[0.15, 0, 1.05]}>
      {/* chair */}
      <mesh position={[0, -0.5, 0.05]}>
        <boxGeometry args={[0.6, 0.06, 0.55]} />
        <meshStandardMaterial color={dark} roughness={0.7} />
      </mesh>
      <RoundedBox args={[0.56, 0.62, 0.06]} radius={0.03} position={[0, -0.12, 0.33]} rotation={[0.08, 0, 0]}>
        <meshStandardMaterial color={dark} roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, -0.85, 0.05]}>
        <cylinderGeometry args={[0.03, 0.03, 0.65, 8]} />
        <meshStandardMaterial color={dark} />
      </mesh>
      {/* legs */}
      <Limb from={[-0.13, -0.42, 0.05]} to={[-0.14, -0.42, -0.38]} radius={0.085} color={dark} />
      <Limb from={[0.13, -0.42, 0.05]} to={[0.14, -0.42, -0.38]} radius={0.085} color={dark} />
      <Limb from={[-0.14, -0.42, -0.38]} to={[-0.15, -1.05, -0.42]} radius={0.075} color={dark} />
      <Limb from={[0.14, -0.42, -0.38]} to={[0.15, -1.05, -0.42]} radius={0.075} color={dark} />
      {/* torso, leaning slightly toward the screen */}
      <Limb from={[0, -0.36, 0.08]} to={[0, 0.12, -0.02]} radius={0.2} color={shirt} />
      {/* head + hair */}
      <mesh position={[0, 0.42, -0.06]}>
        <sphereGeometry args={[0.145, 24, 16]} />
        <meshStandardMaterial color={clay} roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.47, -0.03]} rotation={[-0.35, 0, 0]}>
        <sphereGeometry args={[0.152, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#23242e" roughness={0.9} />
      </mesh>
      <Limb from={[0, 0.2, -0.03]} to={[0, 0.3, -0.05]} radius={0.06} color={clay} />
      {/* arms reaching to the keyboard */}
      <Limb from={[-0.25, 0.1, 0]} to={[-0.28, -0.12, -0.3]} radius={0.06} color={shirt} />
      <Limb from={[0.25, 0.1, 0]} to={[0.28, -0.12, -0.3]} radius={0.06} color={shirt} />
      <Limb from={[-0.28, -0.12, -0.3]} to={[-0.14, 0.04, -0.72]} radius={0.05} color={clay} />
      <Limb from={[0.28, -0.12, -0.3]} to={[0.14, 0.04, -0.72]} radius={0.05} color={clay} />
    </group>
  );
}

function Workspace({ monitor, palette }: { monitor: Texture; palette: Palette }) {
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
      <group position={[0, 0, -0.32]}>
        <mesh position={[0, 0.012, 0]}>
          <cylinderGeometry args={[0.28, 0.3, 0.025, 32]} />
          <meshStandardMaterial color={palette.surfaceLight} metalness={0.5} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.3, -0.03]}>
          <boxGeometry args={[0.07, 0.58, 0.04]} />
          <meshStandardMaterial color={palette.surfaceLight} metalness={0.5} roughness={0.35} />
        </mesh>
        <RoundedBox args={[1.95, 1.18, 0.05]} radius={0.03} position={[0, 0.95, 0]}>
          <meshStandardMaterial color="#1a1c24" metalness={0.5} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.95, 0.027]}>
          <planeGeometry args={[1.86, 1.1]} />
          <meshBasicMaterial map={monitor} toneMapped={false} />
        </mesh>
      </group>
      {/* keyboard, mouse, mug */}
      <RoundedBox args={[0.9, 0.025, 0.26]} radius={0.01} position={[0, 0.013, 0.28]}>
        <meshStandardMaterial color={palette.surfaceLight} roughness={0.6} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.03, 0.16]} radius={0.015} position={[0.62, 0.015, 0.3]}>
        <meshStandardMaterial color={palette.surfaceLight} roughness={0.6} />
      </RoundedBox>
      <mesh position={[-1.05, 0.085, 0.15]}>
        <cylinderGeometry args={[0.075, 0.07, 0.17, 20]} />
        <meshStandardMaterial color={palette.clay} roughness={0.8} />
      </mesh>
      {/* light glow from the screen onto the desk */}
      <pointLight position={[0, 0.9, 0.35]} intensity={1.2} distance={2.2} color={palette.accent} />
    </group>
  );
}

/** Abstract "AI" object: a solid core inside a wireframe shell and a thin ring. */
function Orb({ palette, animate, scale = 1 }: { palette: Palette; animate: boolean; scale?: number }) {
  const shell = useRef<Group>(null);
  const ring = useRef<Group>(null);
  useFrame((_, dt) => {
    if (!animate) return;
    if (shell.current) shell.current.rotation.y += dt * 0.25;
    if (ring.current) ring.current.rotation.z += dt * 0.18;
  });
  return (
    <group scale={scale}>
      <mesh>
        <icosahedronGeometry args={[0.3, 4]} />
        <meshStandardMaterial
          color={palette.accent}
          emissive={palette.accent}
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      <group ref={shell} rotation={[0.4, 0, 0.2]}>
        <mesh>
          <icosahedronGeometry args={[0.48, 1]} />
          <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={0.35} />
        </mesh>
      </group>
      <group ref={ring} rotation={[1.2, 0.3, 0]}>
        <mesh>
          <torusGeometry args={[0.68, 0.005, 6, 96]} />
          <meshBasicMaterial color={palette.text} transparent opacity={0.4} />
        </mesh>
      </group>
      <pointLight intensity={2} distance={2.5} color={palette.accent} />
    </group>
  );
}

/** Stacked discs — a quiet database symbol. */
function DatabaseStack({ palette }: { palette: Palette }) {
  return (
    <group>
      {[0, 0.16, 0.32].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.11, 32]} />
          <meshStandardMaterial
            color={i === 2 ? palette.accent2 : palette.surfaceLight}
            emissive={i === 2 ? palette.accent2 : "#000"}
            emissiveIntensity={i === 2 ? 0.25 : 0}
            roughness={0.4}
            metalness={0.3}
          />
        </mesh>
      ))}
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

function Particles({ count, color, animate }: { count: number; color: string; animate: boolean }) {
  const ref = useRef<Group>(null);
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = Math.random() * 4.5 - 1.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5 - 0.5;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(positions, 3));
    return g;
  }, [count]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, dt) => {
    if (animate && ref.current) ref.current.rotation.y += dt * 0.015;
  });
  return (
    <group ref={ref}>
      <points geometry={geometry}>
        <pointsMaterial
          size={0.022}
          color={color}
          transparent
          opacity={0.7}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
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

const FULL_CAM: Vec3 = [-1, 1.55, 7.3];
const FULL_TARGET: Vec3 = [0.15, 0.8, 0];
const LITE_CAM: Vec3 = [0, 0.3, 5];
const LITE_TARGET: Vec3 = [0, 0.15, 0];

export function Scene({ quality, reducedMotion, palette }: SceneProps) {
  const textures = useMemo(() => makeTextures(palette), [palette]);
  useEffect(() => () => Object.values(textures).forEach((t) => t.dispose()), [textures]);

  const animate = !reducedMotion;
  // drei <Float>: speed 0 freezes it for reduced motion.
  const float = (speed: number, intensity = 0.6) => ({
    speed: animate ? speed : 0,
    floatIntensity: animate ? intensity : 0,
    rotationIntensity: animate ? 0.15 : 0,
  });

  if (quality === "lite") {
    return (
      <>
        <hemisphereLight args={["#c9c4ff", "#1a1b22", 1.3]} />
        <directionalLight position={[3, 4, 5]} intensity={1.8} />
        <StaticCamera position={LITE_CAM} target={LITE_TARGET} />
        <Float {...float(1.2, 0.4)}>
          <Orb palette={palette} animate={animate} scale={1.25} />
        </Float>
        <Float {...float(1.5)} position={[-1.05, 0.95, -0.4]}>
          <group rotation={[0, 0.25, 0]}>
            <Panel texture={textures.component} width={1.55} aspect={560 / 360} />
          </group>
        </Float>
        <Float {...float(1.3)} position={[1.05, -0.75, 0.1]}>
          <group rotation={[0, -0.25, 0]}>
            <Panel texture={textures.terminal} width={1.45} aspect={520 / 300} />
          </group>
        </Float>
        <Float {...float(1.8, 0.3)} position={[1.25, 0.85, 0.5]}>
          <Label text="API" color={palette.accent2} palette={palette} height={0.2} />
        </Float>
        <Float {...float(1.6, 0.3)} position={[-1.15, -0.55, 0.6]}>
          <Label text="Database" color={palette.accent} palette={palette} height={0.2} />
        </Float>
        <Particles count={70} color={palette.accent} animate={animate} />
      </>
    );
  }

  return (
    <>
      <hemisphereLight args={["#c9c4ff", "#1a1b22", 1.3]} />
      <directionalLight position={[3, 6, 6]} intensity={2.2} />
      <directionalLight position={[-6, 3, 4]} intensity={0.9} color="#d9d4ff" />
      <directionalLight position={[-4, 2, -4]} intensity={1.1} color={palette.accent2} />
      {reducedMotion ? (
        <StaticCamera position={FULL_CAM} target={FULL_TARGET} />
      ) : (
        <CameraRig base={FULL_CAM} target={FULL_TARGET} strength={0.45} />
      )}

      <group position={[0.25, -0.55, 0.2]} rotation={[0, 0.32, 0]} scale={1.08}>
        <Workspace monitor={textures.monitor} palette={palette} />
        <Developer palette={palette} />
        <ContactShadows position={[0, -1.18, 0.2]} scale={6} blur={2.4} opacity={0.5} far={2} frames={1} resolution={256} />
      </group>

      {/* Frontend: component code */}
      <Float {...float(1.4)} position={[-1.35, 2.0, -0.5]}>
        <group rotation={[0, 0.38, 0]}>
          <Panel texture={textures.component} width={1.3} aspect={560 / 360} />
          <group position={[-0.38, 0.55, 0.05]}>
            <Label text="Frontend" color={palette.accent} palette={palette} />
          </group>
        </group>
      </Float>

      {/* Backend: terminal */}
      <Float {...float(1.2)} position={[1.7, 0.2, 0.7]}>
        <group rotation={[0, -0.4, 0]}>
          <Panel texture={textures.terminal} width={1.2} aspect={520 / 300} />
          <group position={[0.3, -0.47, 0.05]}>
            <Label text="Backend" color={palette.accent2} palette={palette} />
          </group>
        </group>
      </Float>

      {/* API: JSON response */}
      <Float {...float(1.6)} position={[1.25, 2.35, -1]}>
        <group rotation={[0, -0.3, 0]}>
          <Panel texture={textures.json} width={1.05} aspect={460 / 300} />
          <group position={[0.4, 0.5, 0.05]}>
            <Label text="API" color={palette.accent2} palette={palette} />
          </group>
        </group>
      </Float>

      {/* AI: orb */}
      <Float {...float(1, 0.5)} position={[2.15, 1.35, -1.6]}>
        <Orb palette={palette} animate={animate} scale={0.62} />
        <group position={[0, -0.6, 0]}>
          <Label text="AI / ML" color={palette.accent} palette={palette} />
        </group>
      </Float>

      {/* Database */}
      <Float {...float(1.3, 0.4)} position={[-1.6, 0.05, 0.8]}>
        <group rotation={[0.15, 0, 0]}>
          <DatabaseStack palette={palette} />
        </group>
        <group position={[0, -0.28, 0]}>
          <Label text="Database" color={palette.accent2} palette={palette} />
        </group>
      </Float>

      <Particles count={260} color={palette.accent} animate={animate} />
    </>
  );
}
