// Tiny bridge so the fragrance explorer can recolour the 3D smoke in the hero.
type Listener = (hex: number) => void;
const listeners = new Set<Listener>();
let current = 0xffb46b;

export function setSmokeTint(hex: number) {
  current = hex;
  listeners.forEach((l) => l(hex));
}
export function onSmokeTint(l: Listener) {
  listeners.add(l);
  l(current);
  return () => {
    listeners.delete(l);
  };
}
