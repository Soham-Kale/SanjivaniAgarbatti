'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { easing } from 'maath';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import Studio from './Studio';
import Halo from './Halo';
import { ProductModel } from './PackModels';
import { useCanvasLoop } from './useCanvasVisibility';

/** Packs stand on an arc; scroll turns the arc so each pack comes to the front in turn. */
function Carousel({ slugs, progress, still }: { slugs: string[]; progress: MotionValue<number>; still: boolean }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }, dt) => {
    const p = progress.get() * (slugs.length - 1);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const d = i - p;
      const a = Math.min(Math.abs(d), 1.6);
      // arc: neighbours step back and to the side
      easing.damp3(g.position, [Math.sin(d * 0.75) * 4.2, -a * 0.25, -(1 - Math.cos(d * 0.75)) * 4], 0.3, dt);
      easing.damp(g.rotation, 'y', -d * 0.75 + (still ? 0 : Math.sin(clock.elapsedTime * 0.5 + i) * 0.22), 0.3, dt);
      const s = 1 - Math.min(Math.abs(d), 1) * 0.28;
      easing.damp3(g.scale, [s, s, s], 0.25, dt);
      g.visible = Math.abs(d) < 2.2;
    });
  });
  return (
    <>
      {slugs.map((s, i) => (
        <group
          key={s}
          ref={(g) => {
            refs.current[i] = g;
          }}
        >
          <ProductModel slug={s} fitHeight={3} />
        </group>
      ))}
    </>
  );
}

/** Scroll-driven product carousel framed by a gold halo. */
export default function ShowcaseScene({ slugs, progress, low = false }: { slugs: string[]; progress: MotionValue<number>; low?: boolean }) {
  const { ref, frameloop, reduce } = useCanvasLoop();
  return (
    <div ref={ref} className="edge-fade absolute inset-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} frameloop={frameloop} camera={{ position: [0, 0.6, 8], fov: 34 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}>
        <Suspense fallback={null}>
          <Studio />
          <group position={[0, 0.4, -2.4]}>
            <Halo still={reduce} radius={2.4} glow={0.9} />
          </group>
          <Carousel slugs={slugs} progress={progress} still={reduce} />
          <Sparkles count={45} scale={[9, 5, 4]} size={2.4} speed={reduce ? 0 : 0.25} color="#FFD480" opacity={0.6} />
          <ContactShadows position={[0, -1.95, 0]} opacity={0.6} scale={12} blur={2.4} far={3} resolution={low ? 256 : 512} color="#08040f" />
          <fog attach="fog" args={['#120A21', 9, 22]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
