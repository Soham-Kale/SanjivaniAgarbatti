'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { onSmokeTint } from '@/lib/smoke';

/**
 * Lightweight incense smoke: one draw call of soft point sprites in a custom shader.
 * Particles are born at the ember positions and drift up with layered sine "noise", widening
 * and fading as they age, so the plume never repeats exactly.
 */
export default function Smoke({ sources, count = 700, spread = 1 }: { sources: React.MutableRefObject<THREE.Object3D[]>; count?: number; spread?: number }) {
  const { gl } = useThree();
  const { geo, mat, life, seed, src } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const seed = new Float32Array(count);
    const src = new Uint8Array(count);
    for (let i = 0; i < count; i++) {
      life[i] = Math.random();
      seed[i] = Math.random() * 100;
      src[i] = i % 3;
      pos[i * 3 + 1] = -100; // hidden until first respawn
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('life', new THREE.BufferAttribute(life, 1));

    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.4, 'rgba(255,255,255,.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        map: { value: new THREE.CanvasTexture(c) },
        tint: { value: new THREE.Color(0xffd9b0) },
        px: { value: Math.min(gl.getPixelRatio(), 2) },
      },
      vertexShader:
        'attribute float life;varying float vL;uniform float px;void main(){vL=life;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(40.+life*760.)*px/-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader:
        'uniform sampler2D map;uniform vec3 tint;varying float vL;void main(){vec4 t=texture2D(map,gl_PointCoord);float a=t.a*smoothstep(0.,.08,vL)*(1.-vL)*.16;vec3 c=mix(tint,vec3(.9,.88,.84),smoothstep(0.,.4,vL));gl_FragColor=vec4(c,a);}',
    });
    return { geo, mat, life, seed, src };
  }, [count, gl]);

  useEffect(() => onSmokeTint((hex) => mat.uniforms.tint.value.setHex(hex)), [mat]);
  useEffect(
    () => () => {
      geo.dispose();
      (mat.uniforms.map.value as THREE.Texture).dispose();
      mat.dispose();
    },
    [geo, mat]
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);
  const warm = useRef(false);

  const step = (dt: number, t: number, tips: THREE.Object3D[]) => {
    const pos = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      life[i] += dt * (0.13 + (seed[i] % 1) * 0.05);
      if (life[i] >= 1) {
        life[i] = 0;
        const tip = tips[src[i]] ?? tips[0];
        tip.getWorldPosition(tmp);
        pos[i * 3] = tmp.x;
        pos[i * 3 + 1] = tmp.y;
        pos[i * 3 + 2] = tmp.z;
      } else {
        const L = life[i];
        const k = seed[i];
        const sway = Math.sin(t * 0.7 + k * 0.6 + L * 5) + 0.5 * Math.sin(t * 1.3 + k + L * 9);
        pos[i * 3] += (sway * 0.8 * L + 0.06) * dt * 1.4 * spread;
        pos[i * 3 + 1] += dt * (0.4 - L * 0.12);
        pos[i * 3 + 2] += Math.cos(t * 0.5 + k * 0.6 + L * 4) * 0.5 * L * dt * 1.4 * spread;
      }
    }
  };

  useFrame(({ clock }, delta) => {
    const tips = sources.current;
    if (!tips.length) return;
    const t = clock.elapsedTime;
    if (!warm.current) {
      // pre-simulate so the very first frame already shows a full plume
      for (let k = 0; k < 420; k++) step(1 / 60, t - (420 - k) / 60, tips);
      warm.current = true;
    } else step(Math.min(delta, 0.05), t, tips);
    geo.attributes.position.needsUpdate = true;
    geo.attributes.life.needsUpdate = true;
  });

  return <points geometry={geo} material={mat} frustumCulled={false} />;
}
