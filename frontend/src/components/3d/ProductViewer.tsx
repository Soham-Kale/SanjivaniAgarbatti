'use client';

import { Canvas } from '@react-three/fiber';
import { Bounds, ContactShadows, OrbitControls } from '@react-three/drei';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import Studio from './Studio';
import { ProductModel } from './PackModels';
import { useCanvasLoop } from './useCanvasVisibility';

/** Drag-to-rotate viewer for one product. Auto-rotates until the visitor touches it. */
export default function ProductViewer({ slug }: { slug: string }) {
  const { ref, frameloop, reduce } = useCanvasLoop();
  const [auto, setAuto] = useState(!reduce);
  return (
    <div ref={ref} className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing">
      <Canvas dpr={[1, 1.75]} frameloop={frameloop} camera={{ position: [0, 0.4, 6], fov: 32 }} gl={{ antialias: true, alpha: true }} onCreated={({ gl }) => (gl.toneMapping = THREE.ACESFilmicToneMapping)}>
        <Suspense fallback={null}>
          <Studio />
          <Bounds fit clip margin={1.08}>
            <ProductModel slug={slug} />
          </Bounds>
          <ContactShadows position={[0, -1.9, 0]} opacity={0.4} scale={8} blur={2.4} far={3} resolution={256} color="#3b2a1d" />
        </Suspense>
        <OrbitControls makeDefault autoRotate={auto} autoRotateSpeed={1.2} enablePan={false} minDistance={3.5} maxDistance={9} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.8} onStart={() => setAuto(false)} />
      </Canvas>
    </div>
  );
}
