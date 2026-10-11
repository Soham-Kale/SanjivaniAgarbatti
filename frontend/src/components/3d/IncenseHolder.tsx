'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/** Brass holder with three lit agarbatti. Pushes the ember meshes into `tips` for the smoke. */
export default function IncenseHolder({ tips }: { tips: React.MutableRefObject<THREE.Object3D[]> }) {
  const embers = useRef<THREE.Mesh[]>([]);
  const lathe = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(0.15 + Math.sin(t * Math.PI * 0.9) * 1.05 + t * 0.2, t * 0.55 - 0.1));
    }
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const sticks: [number, number, number, number][] = [
    [-0.18, 0, 0.08, 0.1],
    [0.12, 0.05, -0.05, -0.06],
    [0.02, -0.12, 0.02, 0],
  ];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    embers.current.forEach((m, i) => (m.material as THREE.MeshBasicMaterial).color.setHSL(0.05, 1, 0.5 + Math.sin(t * 6 + i) * 0.08));
  });

  return (
    <group>
      <mesh geometry={lathe}>
        <meshStandardMaterial color="#c99a45" metalness={0.9} roughness={0.28} side={THREE.DoubleSide} />
      </mesh>
      <mesh position-y={-0.18}>
        <cylinderGeometry args={[0.55, 0.75, 0.18, 48]} />
        <meshStandardMaterial color="#c99a45" metalness={0.9} roughness={0.28} />
      </mesh>
      <mesh position-y={0.38} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[1.25, 48]} />
        <meshStandardMaterial color="#5a4330" roughness={1} />
      </mesh>
      {sticks.map(([x, z, tx, tz], i) => {
        const h = 2.6 - i * 0.25;
        return (
          <group key={i} position={[x, 0.35, z]} rotation={[tz, 0, -tx]}>
            <mesh position-y={0.35}>
              <cylinderGeometry args={[0.018, 0.018, 0.7, 8]} />
              <meshStandardMaterial color="#b08850" roughness={0.7} />
            </mesh>
            <mesh position-y={0.7 + h / 2}>
              <cylinderGeometry args={[0.04, 0.045, h, 10]} />
              <meshStandardMaterial color="#3b2416" roughness={0.9} />
            </mesh>
            <mesh
              position-y={0.7 + h}
              ref={(m) => {
                if (m) {
                  embers.current[i] = m;
                  tips.current[i] = m;
                }
              }}
            >
              <sphereGeometry args={[0.05, 12, 12]} />
              <meshBasicMaterial color="#ff6a20" toneMapped={false} />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[0, 3, 0]} intensity={2} distance={4} decay={1.5} color="#ff8a3a" />
    </group>
  );
}
