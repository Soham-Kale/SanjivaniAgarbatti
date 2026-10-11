'use client';

import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { MODELS, type ModelSpec } from '@/lib/models';

function useLabel(url: string) {
  const tex = useTexture(url);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Vertical stripes that read as a bundle of incense sticks seen through glass. */
function useStickTexture(color: string) {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 8;
    const g = c.getContext('2d')!;
    g.fillStyle = '#1b130d';
    g.fillRect(0, 0, 256, 8);
    const base = new THREE.Color(color);
    for (let x = 0; x < 256; x += 4) {
      const k = 0.38 + Math.random() * 0.3;
      g.fillStyle = `#${base.clone().multiplyScalar(k).getHexString()}`;
      g.fillRect(x, 0, 3, 8);
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.repeat.set(3, 1);
    return t;
  }, [color]);
}

/** Premium gold-cap jar. The label is the photographed label, wrapped on the front half. */
export function Jar({ spec }: { spec: Extract<ModelSpec, { kind: 'jar' }> }) {
  const label = useLabel(spec.texture);
  const sticks = useStickTexture(spec.sticks);
  const r = 0.5;
  const labelH = 2 * r * spec.aspect; // the crop spans the jar's visible width
  const H = labelH / 0.56;
  const labelY = -H / 2 + H * 0.16 + labelH / 2;

  return (
    <group>
      {/* stick bundle inside */}
      <mesh position-y={-0.02}>
        <cylinderGeometry args={[r * 0.84, r * 0.84, H * 0.95, 48, 1, true]} />
        <meshStandardMaterial map={sticks} roughness={0.9} />
      </mesh>
      {/* glass */}
      <mesh>
        <cylinderGeometry args={[r, r, H, 64, 1, true]} />
        <meshPhysicalMaterial color="#f4f1ea" transparent opacity={0.3} roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.05} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position-y={-H / 2} rotation-x={Math.PI / 2}>
        <circleGeometry args={[r, 48]} />
        <meshStandardMaterial color="#2a1d14" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* label: front = real photo crop, back = plain label paper */}
      <mesh position-y={labelY}>
        <cylinderGeometry args={[r * 1.006, r * 1.006, labelH, 72, 1, true, -Math.PI / 2, Math.PI]} />
        <meshStandardMaterial map={label} roughness={0.5} />
      </mesh>
      <mesh position-y={labelY}>
        <cylinderGeometry args={[r * 1.006, r * 1.006, labelH, 72, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial color="#efe9dc" roughness={0.6} />
      </mesh>
      {/* gold cap */}
      <mesh position-y={H / 2 + 0.13}>
        <cylinderGeometry args={[r * 1.08, r * 1.08, 0.3, 72]} />
        <meshStandardMaterial color="#d6a63f" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position-y={H / 2 + 0.28} rotation-x={Math.PI / 2}>
        <torusGeometry args={[r * 1.04, 0.025, 12, 72]} />
        <meshStandardMaterial color="#e8c26a" metalness={1} roughness={0.18} />
      </mesh>
    </group>
  );
}

/** Dhoop-stick carton: front and back faces are the photographed box front. */
export function Carton({ spec }: { spec: Extract<ModelSpec, { kind: 'box' }> }) {
  const front = useLabel(spec.texture);
  const w = 1.5;
  const h = w * spec.aspect;
  const d = 0.5;
  const mats = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({ color: spec.side, roughness: 0.55 });
    const face = new THREE.MeshStandardMaterial({ map: front, roughness: 0.42 });
    return [side, side, side, side, face, face];
  }, [front, spec.side]);
  return (
    <mesh material={mats}>
      <boxGeometry args={[w, h, d]} />
    </mesh>
  );
}

function pillow(w: number, h: number, bulge: number) {
  const g = new THREE.PlaneGeometry(w, h, 32, 48);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const cx = Math.cos((Math.PI * x) / w);
    const cy = Math.pow(Math.max(Math.cos((Math.PI * y) / h), 0), 0.55);
    p.setZ(i, bulge * cx * cy);
  }
  g.computeVertexNormals();
  return g;
}

/** Foil pouch: two bulged panels with crimped seals, printed with the real pouch front. */
export function Pouch({ spec }: { spec: Extract<ModelSpec, { kind: 'pouch' }> }) {
  const tex = useLabel(spec.texture);
  const w = 1.5;
  const h = w * spec.aspect;
  const geo = useMemo(() => pillow(w, h, 0.11), [h]);
  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial map={tex} roughness={0.32} metalness={0.05} />
      </mesh>
      <mesh geometry={geo} rotation-y={Math.PI}>
        <meshStandardMaterial map={tex} roughness={0.32} metalness={0.05} />
      </mesh>
      {[h / 2 - 0.04, -h / 2 + 0.04].map((y) => (
        <mesh key={y} position-y={y}>
          <boxGeometry args={[w * 1.005, 0.08, 0.012]} />
          <meshStandardMaterial color="#ebe7df" roughness={0.4} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

/** Overall model height in scene units, so different packs can be shown at a common size. */
export function modelHeight(spec: ModelSpec) {
  return spec.kind === 'jar' ? (2 * 0.5 * spec.aspect) / 0.56 + 0.43 : 1.5 * spec.aspect;
}

export function ProductModel({ slug, fitHeight }: { slug: string; fitHeight?: number }) {
  const spec = MODELS[slug];
  if (!spec) return null;
  const node = spec.kind === 'jar' ? <Jar spec={spec} /> : spec.kind === 'box' ? <Carton spec={spec} /> : <Pouch spec={spec} />;
  return fitHeight ? <group scale={fitHeight / modelHeight(spec)}>{node}</group> : node;
}

/** Preload textures for models that are about to be shown. */
export function preloadModels(slugs: string[]) {
  slugs.forEach((s) => MODELS[s] && useTexture.preload(MODELS[s].texture));
}
