'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Sparkles } from '@react-three/drei';
import type { MotionValue } from 'framer-motion';
import { easing } from 'maath';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import Studio from './Studio';
import { ProductModel } from './PackModels';
import { useCanvasLoop } from './useCanvasVisibility';

function Carousel({ slugs, progress, still }: { slugs: string[]; progress: MotionValue<number>; still: boolean }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }, dt) => {
    const p = progress.get() * (slugs.length - 1);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const d = i - p;
      const a = Math.min(Math.abs(d), 1.4);
      easing.damp3(g.position, [d * 4.6, -a * 0.4, -a * 2.5], 0.25, dt);
      easing.damp(g.rotation, 'y', -d * 0.9 + (still ? 0 : Math.sin(clock.elapsedTime * 0.4 + i) * 0.25), 0.3, dt);
      const s = 1 - Math.min(Math.abs(d), 1) * 0.3;
      easing.damp3(g.scale, [s, s, s], 0.25, dt);
      g.visible = Math.abs(d) < 1.3;
    });
  });
  return (
    <>
      {slugs.map((s, i) => (
        <group key={s} ref={(g) => {
            refs.current[i] = g;
          }}>
          <ProductModel slug={s} fitHeight={3} />
        </group>
      ))}
    </>
  );
}

/** Scroll-driven product carousel: scroll progress (0-1) moves between real packs. */
export default function ShowcaseScene({ slugs, progress }: { slugs: string[]; progress: MotionValue<number> }) {
  const { ref, frameloop, reduce } = useCanvasLoop();
  return (
    <div ref={ref} className="edge-fade absolute inset-0" aria-hidden="true">
      <Canvas dpr={[1, 1.5]} frameloop={frameloop} camera={{ position: [0, 0.3, 7.5], fov: 32 }} gl={{ alpha: true, antialias: true }} onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}>
        <Suspense fallback={null}>
          <Studio />
          <Carousel slugs={slugs} progress={progress} still={reduce} />
          <Sparkles count={35} scale={[8, 5, 3]} size={2} speed={reduce ? 0 : 0.2} color="#E2BE78" opacity={0.5} />
          <ContactShadows position={[0, -1.95, 0]} opacity={0.45} scale={10} blur={2.4} far={3} resolution={256} color="#140b06" />
        </Suspense>
      </Canvas>
    </div>
  );
}
