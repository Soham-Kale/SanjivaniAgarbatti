'use client';

import { Environment, Lightformer } from '@react-three/drei';

/**
 * Warm "puja room" lighting. The environment map is built from local light panels, so no
 * HDR file is downloaded at runtime.
 */
export default function Studio({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} color="#fff1dc" />
      <directionalLight position={[3, 5, 4]} intensity={2.4 * intensity} color="#ffe2b8" />
      <directionalLight position={[-4, 2, -3]} intensity={0.9 * intensity} color="#f0c99a" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#fff1d6" position={[0, 3, 4]} scale={[7, 2.5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#e2b765" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[5, 5, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#f3d2ae" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[5, 5, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffd9a0" position={[0, 5, -3]} scale={2} />
      </Environment>
    </>
  );
}
