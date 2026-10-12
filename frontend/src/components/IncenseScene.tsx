'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, PerformanceMonitor, PresentationControls, Sparkles } from '@react-three/drei';
import { easing } from 'maath';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Studio from './3d/Studio';
import Smoke from './3d/Smoke';
import IncenseHolder from './3d/IncenseHolder';
import { ProductModel } from './3d/PackModels';
import { useCanvasLoop } from './3d/useCanvasVisibility';

const HERO_JAR = 'premium-kasturi';
const HERO_BOX = 'dhoop-box-kewda-bel';

function Rig() {
  useFrame((state, dt) => {
    easing.damp3(state.camera.position, [state.pointer.x * 0.5, 0.6 + state.pointer.y * 0.3, 9], 0.5, dt);
    state.camera.lookAt(0, 0.2, 0);
  });
  return null;
}

function Idle({ children, still }: { children: React.ReactNode; still: boolean }) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current && !still) g.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.35;
  });
  return <group ref={g}>{children}</group>;
}

function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}

function Scene({ low, still, onReady }: { low: boolean; still: boolean; onReady: () => void }) {
  const tips = useRef<THREE.Object3D[]>([]);
  return (
    <>
      <Studio />
      <Rig />
      <PresentationControls global={false} cursor snap rotation={[0, -0.25, 0]} polar={[-0.15, 0.2]} azimuth={[-0.9, 0.9]} config={{ mass: 1, tension: 170, friction: 26 }}>
        <Float enabled={!still} speed={1.4} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.05, 0.08]}>
          <Idle still={still}>
            <group position={[0.15, -0.12, 0.6]} scale={1.05}>
              <ProductModel slug={HERO_JAR} />
            </group>
          </Idle>
        </Float>
        <group position={[-1.75, -1.09, -0.6]} rotation={[0, 0.55, 0]} scale={0.8}>
          <ProductModel slug={HERO_BOX} />
        </group>
      </PresentationControls>
      <group position={[1.45, -1.75, -0.8]} scale={0.55}>
        <IncenseHolder tips={tips} />
      </group>
      <Smoke sources={tips} count={low ? 380 : 760} spread={0.8} />
      <Sparkles count={low ? 25 : 60} scale={[7, 5, 4]} position={[0, 0.8, -1]} size={2.2} speed={still ? 0 : 0.25} color="#E2BE78" opacity={0.7} />
      <ContactShadows position={[0, -1.92, 0]} opacity={0.5} scale={9} blur={2.6} far={3.5} resolution={256} color="#140b06" frames={still ? 1 : Infinity} />
      <Ready onReady={onReady} />
    </>
  );
}

/** Cinematic hero: real-pack 3D jar and dhoop box, lit agarbatti, smoke and gold dust. */
export default function IncenseScene({ onReady }: { onReady: () => void }) {
  const { ref, frameloop, reduce } = useCanvasLoop();
  const [dpr, setDpr] = useState(1.75);
  const [low, setLow] = useState(false);

  useEffect(() => {
    // modest devices start lighter
    if ((navigator.hardwareConcurrency ?? 8) <= 4) {
      setDpr(1.25);
      setLow(true);
    }
  }, []);

  return (
    <div ref={ref} className="edge-fade absolute inset-0 touch-pan-y" aria-hidden="true">
      <Canvas
        dpr={[1, dpr]}
        frameloop={frameloop}
        camera={{ position: [0, 0.6, 9], fov: 30, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            setLow(true);
          }}
        />
        <Suspense fallback={null}>
          <Scene low={low} still={reduce} onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
