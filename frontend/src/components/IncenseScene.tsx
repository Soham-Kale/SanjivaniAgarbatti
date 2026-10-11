'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { onSmokeTint } from '@/lib/smoke';

/**
 * Live 3D hero: a brass incense holder with three burning sticks, rising smoke
 * (custom point shader) and floating gold dust. Follows the pointer gently.
 */
export default function IncenseScene() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let R: THREE.WebGLRenderer;
    try {
      R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    } catch {
      return; // no WebGL: the gradient background still looks fine
    }
    R.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const S = new THREE.Scene();
    S.fog = new THREE.Fog(0x0e0b09, 8, 18);
    const C = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    const G = new THREE.Group();
    S.add(G);
    S.add(new THREE.AmbientLight(0x3a2a1a, 3));
    const key = new THREE.DirectionalLight(0xffd9a0, 3);
    key.position.set(3, 5, 4);
    S.add(key);
    const rim = new THREE.DirectionalLight(0x6a8cff, 1.1);
    rim.position.set(-4, 2, -3);
    S.add(rim);
    const glow = new THREE.PointLight(0xff7b30, 4, 6, 1);
    S.add(glow);

    // brass holder (lathe)
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      pts.push(new THREE.Vector2(0.15 + Math.sin(t * Math.PI * 0.9) * 1.05 + t * 0.2, t * 0.55 - 0.1));
    }
    const brass = new THREE.MeshStandardMaterial({ color: 0xc99a45, metalness: 0.85, roughness: 0.28, side: THREE.DoubleSide });
    G.add(new THREE.Mesh(new THREE.LatheGeometry(pts, 64), brass));
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 0.18, 48), brass);
    base.position.y = -0.18;
    G.add(base);
    const sand = new THREE.Mesh(new THREE.CircleGeometry(1.25, 48), new THREE.MeshStandardMaterial({ color: 0x5a4330, roughness: 1 }));
    sand.rotation.x = -Math.PI / 2;
    sand.position.y = 0.38;
    G.add(sand);

    // sticks
    const tips: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
    const stickMat = new THREE.MeshStandardMaterial({ color: 0x3b2416, roughness: 0.9 });
    const bamboo = new THREE.MeshStandardMaterial({ color: 0xb08850, roughness: 0.7 });
    const sticks: [number, number, number, number][] = [
      [-0.18, 0, 0.08, 0.1],
      [0.12, 0.05, -0.05, -0.06],
      [0.02, -0.12, 0.02, 0],
    ];
    sticks.forEach(([x, z, tx, tz], i) => {
      const h = 2.6 - i * 0.25;
      const s = new THREE.Group();
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.7, 8), bamboo);
      b.position.y = 0.35;
      s.add(b);
      const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, h, 10), stickMat);
      m.position.y = 0.7 + h / 2;
      s.add(m);
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff6a20 }));
      e.position.y = 0.7 + h;
      s.add(e);
      s.position.set(x, 0.35, z);
      s.rotation.set(tz, 0, -tx);
      G.add(s);
      tips.push(e);
    });

    // smoke sprite texture
    const tc = document.createElement('canvas');
    tc.width = tc.height = 64;
    const tx = tc.getContext('2d')!;
    const gr = tx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.4, 'rgba(255,255,255,.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    tx.fillStyle = gr;
    tx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(tc);

    const N = 900;
    const pos = new Float32Array(N * 3);
    const life = new Float32Array(N);
    const seed = new Float32Array(N);
    const src = new Uint8Array(N);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('life', new THREE.BufferAttribute(life, 1));
    const smat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { map: { value: tex }, tint: { value: new THREE.Color(0xffb46b) }, px: { value: R.getPixelRatio() } },
      vertexShader:
        'attribute float life;varying float vL;uniform float px;void main(){vL=life;vec4 mv=modelViewMatrix*vec4(position,1.);gl_PointSize=(50.+life*900.)*px/-mv.z;gl_Position=projectionMatrix*mv;}',
      fragmentShader:
        'uniform sampler2D map;uniform vec3 tint;varying float vL;void main(){vec4 t=texture2D(map,gl_PointCoord);float a=t.a*smoothstep(0.,.08,vL)*(1.-vL)*.18;vec3 c=mix(tint,vec3(.82,.78,.74),smoothstep(0.,.35,vL));gl_FragColor=vec4(c,a);}',
    });
    S.add(new THREE.Points(geo, smat));
    for (let i = 0; i < N; i++) {
      life[i] = Math.random();
      seed[i] = Math.random() * 100;
      src[i] = i % 3;
    }

    // gold dust
    const D = 260;
    const dp = new Float32Array(D * 3);
    for (let i = 0; i < D; i++) {
      dp[i * 3] = (Math.random() - 0.5) * 12;
      dp[i * 3 + 1] = Math.random() * 7 - 1;
      dp[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    const dg = new THREE.BufferGeometry();
    dg.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    S.add(new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xd4ab5a, size: 0.03, transparent: true, opacity: 0.7 })));

    const offTint = onSmokeTint((hex) => smat.uniforms.tint.value.setHex(hex));

    let mx = 0;
    let my = 0;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove);

    const tmp = new THREE.Vector3();
    const size = () => {
      const w = cv.clientWidth;
      const h = cv.clientHeight;
      R.setSize(w, h, false);
      C.aspect = w / h;
      C.updateProjectionMatrix();
      const narrow = w < 700;
      C.position.set(0, 1.2, 8.5);
      // On phones the copy fills the top, so sit the holder on the bottom edge of the hero.
      const halfH = 8.5 * Math.tan(THREE.MathUtils.degToRad(C.fov / 2));
      G.position.set(narrow ? 0.6 : 2.3, narrow ? 1 - halfH * 0.92 : -1.9, 0);
      G.scale.setScalar(narrow ? 0.7 : 1);
    };
    size();
    window.addEventListener('resize', size);

    let t0 = performance.now();
    let vis = true;
    const io = new IntersectionObserver((e) => (vis = e[0].isIntersecting));
    io.observe(cv);

    const frame = (now: number) => {
      const dt = Math.max(0, Math.min((now - t0) / 1000, 0.05));
      t0 = now;
      const t = now / 1000;
      G.rotation.y += (mx * 0.6 - G.rotation.y) * 0.05;
      C.position.y += (1.2 - my * 1.2 - C.position.y) * 0.05;
      C.lookAt(0, 1, 0);
      G.updateMatrixWorld();
      tips.forEach((tp, i) => tp.material.color.setHSL(0.05, 1, 0.5 + Math.sin(t * 6 + i) * 0.08));
      tips[0].getWorldPosition(tmp);
      glow.position.copy(tmp);
      glow.intensity = 4 + Math.sin(t * 7) * 0.8 + Math.sin(t * 13) * 0.4;
      for (let i = 0; i < N; i++) {
        life[i] += dt * (0.17 + (seed[i] % 1) * 0.05);
        if (life[i] >= 1) {
          life[i] = 0;
          tips[src[i]].getWorldPosition(tmp);
          pos[i * 3] = tmp.x;
          pos[i * 3 + 1] = tmp.y;
          pos[i * 3 + 2] = tmp.z;
        } else {
          const L = life[i];
          const k = seed[i];
          pos[i * 3] += (Math.sin(t * 0.8 + k * 0.6 + L * 5) * 1.1 * L + 0.1) * dt * 1.4;
          pos[i * 3 + 1] += dt * (0.42 - L * 0.12);
          pos[i * 3 + 2] += Math.cos(t * 0.6 + k * 0.6 + L * 4) * 0.6 * L * dt * 1.4;
        }
      }
      geo.attributes.position.needsUpdate = true;
      geo.attributes.life.needsUpdate = true;
      for (let i = 0; i < D; i++) {
        dp[i * 3 + 1] += dt * 0.08;
        if (dp[i * 3 + 1] > 6) dp[i * 3 + 1] = -1;
      }
      dg.attributes.position.needsUpdate = true;
      R.render(S, C);
    };

    // warm-up so the first visible frame already has smoke
    for (let i = 0; i < 600; i++) frame(t0 + 16.7);
    t0 = performance.now();

    let raf = 0;
    if (reduce) R.render(S, C);
    else {
      const loop = (n: number) => {
        raf = requestAnimationFrame(loop);
        if (vis) frame(n);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      offTint();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', size);
      S.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      tex.dispose();
      R.dispose();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 h-full w-full" />;
}
