'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Radial glow texture drawn once on a canvas (no image download). */
export function useGlowTexture(inner = 'rgba(255,170,80,1)', mid = 'rgba(255,122,26,.35)') {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner);
    gr.addColorStop(0.35, mid);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [inner, mid]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

/**
 * Aarti halo: a soft saffron aura with three thin gold rings and a circle of beads, each turning
 * on its own axis. Sits behind a product to give the scene depth.
 */
export default function Halo({ still = false, radius = 2.1, glow = 1 }: { still?: boolean; radius?: number; glow?: number }) {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Group>(null);
  const r3 = useRef<THREE.Mesh>(null);
  const aura = useRef<THREE.Mesh>(null);
  const tex = useGlowTexture();
  const beads = useMemo(() => Array.from({ length: 36 }, (_, i) => (i / 36) * Math.PI * 2), []);

  useFrame(({ clock }, dt) => {
    if (still) return;
    if (r1.current) r1.current.rotation.z += dt * 0.12;
    if (r2.current) {
      r2.current.rotation.z -= dt * 0.08;
      r2.current.rotation.x = 1.2 + Math.sin(clock.elapsedTime * 0.3) * 0.08;
    }
    if (r3.current) r3.current.rotation.y += dt * 0.15;
    if (aura.current) aura.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 0.9) * 0.04);
  });

  const gold = <meshStandardMaterial color="#F2B33D" metalness={1} roughness={0.22} emissive="#ff8a2a" emissiveIntensity={0.55} />;
  return (
    <group>
      <mesh ref={aura} position-z={-0.6}>
        <planeGeometry args={[radius * 3.6, radius * 3.6]} />
        <meshBasicMaterial map={tex} transparent opacity={0.85 * glow} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={r1}>
        <torusGeometry args={[radius, 0.014, 12, 220]} />
        {gold}
      </mesh>
      <group ref={r2} rotation-x={1.2}>
        <mesh>
          <torusGeometry args={[radius * 1.22, 0.008, 8, 220]} />
          {gold}
        </mesh>
        {beads.map((a) => (
          <mesh key={a} position={[Math.cos(a) * radius * 1.22, Math.sin(a) * radius * 1.22, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            {gold}
          </mesh>
        ))}
      </group>
      <mesh ref={r3} rotation-x={0.4}>
        <torusGeometry args={[radius * 1.42, 0.006, 8, 220]} />
        <meshBasicMaterial color="#F59BC0" transparent opacity={0.55} toneMapped={false} />
      </mesh>
    </group>
  );
}
