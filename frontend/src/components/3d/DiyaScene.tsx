'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { easing } from 'maath';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGlowTexture } from './Halo';
import { useCanvasLoop } from './useCanvasVisibility';

const flameVert = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uSeed;
  void main() {
    vUv = uv;
    vec3 p = position;
    // sway the tip more than the base
    float k = smoothstep(-0.5, 0.5, p.y);
    p.x += sin(uTime * 3.1 + uSeed) * 0.06 * k + sin(uTime * 7.3 + uSeed * 2.0) * 0.02 * k;
    p.z += cos(uTime * 2.7 + uSeed) * 0.04 * k;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;
const flameFrag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  void main() {
    float y = vUv.y;
    vec3 core = vec3(1.0, 0.97, 0.85);
    vec3 mid = vec3(1.0, 0.62, 0.18);
    vec3 edge = vec3(0.9, 0.22, 0.12);
    vec3 col = mix(core, mid, smoothstep(0.15, 0.6, y));
    col = mix(col, edge, smoothstep(0.65, 1.0, y));
    float a = (1.0 - smoothstep(0.75, 1.0, y)) * (0.85 + 0.15 * sin(uTime * 18.0));
    gl_FragColor = vec4(col * 1.6, a);
  }
`;

/** Clay diya with a gold rim and a flickering shader flame. */
function Diya({ seed = 0, still }: { seed?: number; still: boolean }) {
  const flame = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);
  const glow = useRef<THREE.Mesh>(null);
  const tex = useGlowTexture('rgba(255,200,120,1)', 'rgba(255,122,26,.4)');

  const bowl = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24;
      // shallow bowl: wide rim, small foot
      pts.push(new THREE.Vector2(0.35 + Math.sin(t * Math.PI * 0.5) * 0.75, -0.28 + Math.pow(t, 1.6) * 0.42));
    }
    pts.unshift(new THREE.Vector2(0, -0.28));
    return new THREE.LatheGeometry(pts, 64);
  }, []);

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uSeed: { value: seed } },
        vertexShader: flameVert,
        fragmentShader: flameFrag,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [seed],
  );

  useFrame(({ clock }) => {
    const t = still ? 0 : clock.elapsedTime;
    mat.uniforms.uTime.value = t;
    const f = 1 + Math.sin(t * 9 + seed) * 0.05 + Math.sin(t * 23 + seed * 3) * 0.03;
    if (flame.current) flame.current.scale.set(0.12, 0.32 * f, 0.12);
    if (light.current) light.current.intensity = 6 * f;
    if (glow.current) glow.current.scale.setScalar(1.2 * f);
  });

  return (
    <group>
      <mesh geometry={bowl}>
        <meshStandardMaterial color="#B5532A" roughness={0.75} metalness={0.05} side={THREE.DoubleSide} />
      </mesh>
      {/* oil */}
      <mesh position-y={0.1} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.98, 48]} />
        <meshStandardMaterial color="#8a5a12" roughness={0.15} metalness={0.3} />
      </mesh>
      <mesh position-y={0.14} rotation-x={Math.PI / 2}>
        <torusGeometry args={[1.08, 0.035, 12, 96]} />
        <meshStandardMaterial color="#F2B33D" metalness={1} roughness={0.25} emissive="#ff8a2a" emissiveIntensity={0.25} />
      </mesh>
      {/* wick */}
      <mesh position={[0.62, 0.2, 0]} rotation-z={-0.5}>
        <cylinderGeometry args={[0.03, 0.04, 0.22, 8]} />
        <meshStandardMaterial color="#2a1a10" />
      </mesh>
      <group position={[0.66, 0.5, 0]}>
        <mesh ref={flame} material={mat}>
          <sphereGeometry args={[1, 24, 24]} />
        </mesh>
        <mesh ref={glow}>
          <planeGeometry args={[1.2, 1.6]} />
          <meshBasicMaterial map={tex} transparent blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <pointLight ref={light} color="#ff9a3c" distance={6} decay={1.6} />
      </group>
    </group>
  );
}

function Rig() {
  useFrame((state, dt) => {
    // step back on narrow (portrait) screens so all three diyas stay in frame
    // (the canvas is a wide strip under the closing text, so frame the diyas themselves)
    const z = state.viewport.aspect < 1.6 ? 11 : 7.5;
    easing.damp3(state.camera.position, [state.pointer.x * 0.8, 0.4 + state.pointer.y * 0.3, z], 0.6, dt);
    state.camera.lookAt(0, -1.9, 0);
  });
  return null;
}

/** Three lit diyas for the closing section, with rising embers. */
export default function DiyaScene() {
  const { ref, frameloop, reduce } = useCanvasLoop();
  return (
    <div ref={ref} className="absolute inset-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} frameloop={frameloop} camera={{ position: [0, 0.4, 7.5], fov: 35 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.25} color="#ffd9b0" />
          <Rig />
          <group position={[0, -2.35, 0]}>
            <Float enabled={!reduce} speed={1.2} rotationIntensity={0.1} floatIntensity={0.25}>
              <Diya still={reduce} />
            </Float>
            <group position={[-3, -0.2, -1.6]} scale={0.7} rotation-y={0.6}>
              <Diya seed={2} still={reduce} />
            </group>
            <group position={[3, -0.2, -1.6]} scale={0.7} rotation-y={2.4}>
              <Diya seed={4} still={reduce} />
            </group>
            <mesh rotation-x={-Math.PI / 2} position-y={-0.32}>
              <circleGeometry args={[8, 48]} />
              <meshStandardMaterial color="#1C0F30" roughness={0.9} />
            </mesh>
          </group>
          <Sparkles count={50} scale={[8, 5, 3]} position={[0, -1.2, -0.5]} size={3.5} speed={reduce ? 0 : 0.5} noise={1.2} color="#FF9A3C" opacity={0.9} />
          <fog attach="fog" args={['#120A21', 7, 16]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
