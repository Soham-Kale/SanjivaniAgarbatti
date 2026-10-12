'use client';

import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Nav = Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };

let softwareGL: boolean | undefined;
/**
 * True when WebGL runs on the CPU (no graphics acceleration: SwiftShader, llvmpipe, or WebGL
 * missing). A live 3D scene would make such a device sluggish, so it gets the photo instead.
 */
function hasSoftwareGL() {
  if (softwareGL !== undefined) return softwareGL;
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) return (softwareGL = true);
    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    softwareGL = /swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    softwareGL = true;
  }
  return softwareGL;
}

/** Data-saver mode, a phone with very little memory / few cores, or no graphics acceleration. */
export function isLowEndDevice() {
  if (typeof navigator === 'undefined') return false;
  const n = navigator as Nav;
  return Boolean(n.connection?.saveData) || (n.deviceMemory !== undefined && n.deviceMemory <= 2) || (n.hardwareConcurrency || 8) <= 2 || hasSoftwareGL();
}

/**
 * Starts the hero's 3D scene only after the page has loaded and the browser is idle, so the
 * text and poster photo appear first and the 3D code never delays the first paint.
 */
export function useIdleMount(timeout = 2500) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (isLowEndDevice()) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const go = () => {
      if (w.requestIdleCallback) idle = w.requestIdleCallback(() => setOk(true), { timeout });
      else timer = setTimeout(() => setOk(true), 300);
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (idle !== undefined) w.cancelIdleCallback?.(idle);
      if (timer) clearTimeout(timer);
    };
  }, [timeout]);
  return ok;
}

/**
 * Mounts a decorative 3D scene once its section comes near the screen (its code is downloaded
 * then too); never on low-end devices.
 */
export function useNearMount<T extends Element>(margin = '600px') {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` });
  const [capable, setCapable] = useState(false);
  useEffect(() => setCapable(!isLowEndDevice()), []);
  return { ref, near: inView && capable };
}
