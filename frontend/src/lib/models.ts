/**
 * 3D pack models built from the client's real product photos. Each texture in
 * /public/textures is a straight crop of the photographed pack front (no redrawn artwork),
 * mapped onto simple procedural geometry: a jar, a carton, or a pillow pouch.
 */
export type ModelSpec =
  | { kind: 'jar'; texture: string; aspect: number; sticks: string }
  | { kind: 'box'; texture: string; aspect: number; side: string }
  | { kind: 'pouch'; texture: string; aspect: number };

const jar = (id: string, aspect: number, sticks: string): ModelSpec => ({ kind: 'jar', texture: `/textures/premium-jar-${id}.webp`, aspect, sticks });
const box = (id: string, aspect: number, side: string): ModelSpec => ({ kind: 'box', texture: `/textures/dhoop-box-${id}.webp`, aspect, side });
const pouch = (id: string, aspect: number): ModelSpec => ({ kind: 'pouch', texture: `/textures/pouch-${id}.webp`, aspect });

// aspect = texture height / width
export const MODELS: Record<string, ModelSpec> = {
  'premium-kasturi': jar('kasturi', 725 / 384, '#2f7a5c'),
  'premium-mogra': jar('mogra', 792 / 384, '#d24d7f'),
  'premium-kewda': jar('kewda', 704 / 384, '#c8452c'),
  'premium-gulab': jar('gulab', 683 / 384, '#2f8a7a'),
  'premium-jaswand': jar('jaswand', 651 / 384, '#c9a46a'),
  'premium-chandan': jar('chandan', 774 / 384, '#6b4630'),
  'dhoop-box-kewda-bel': box('kewda-bel', 692 / 512, '#c9d43a'),
  'dhoop-box-jaswand': box('jaswand', 693 / 512, '#e8746f'),
  'dhoop-box-chandan': box('chandan', 735 / 512, '#e0a24c'),
  'dhoop-box-chafa': box('chafa', 705 / 512, '#f0cf5a'),
  'dhoop-box-gulab': box('gulab', 633 / 512, '#e7a3c2'),
  'dhoop-box-rui': box('rui', 787 / 512, '#e8b88a'),
  'dhoop-box-mogra': box('mogra', 678 / 512, '#8fbf5a'),
  'pouch-kewda': pouch('kewda', 982 / 512),
  'pouch-mogra': pouch('mogra', 926 / 512),
  'pouch-chandan': pouch('chandan', 953 / 512),
  'pouch-gulab': pouch('gulab', 1020 / 512),
  'pouch-kasturi': pouch('kasturi', 1007 / 512),
  'pouch-jaswand': pouch('jaswand', 984 / 512),
};

export const hasModel = (slug: string) => slug in MODELS;
