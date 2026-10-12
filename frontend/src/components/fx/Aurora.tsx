/**
 * Slow-moving glow behind dark sections: three blurred colour fields (plum, saffron, kumkum)
 * drifting on CSS keyframes, plus film grain. Pure CSS, so it costs no WebGL context.
 */
export default function Aurora({ tone = 'warm', className = '' }: { tone?: 'warm' | 'cool' | 'pink'; className?: string }) {
  const a = tone === 'cool' ? 'bg-wood-light/70' : tone === 'pink' ? 'bg-maroon/45' : 'bg-saffron/35';
  const b = tone === 'pink' ? 'bg-saffron/25' : 'bg-maroon/35';
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className={`absolute -left-[10%] top-[-20%] h-[70%] w-[60%] rounded-full blur-[120px] ${a} animate-aurora`} />
      <div className={`absolute -right-[15%] bottom-[-25%] h-[75%] w-[65%] rounded-full blur-[140px] ${b} animate-aurora-slow`} />
      <div className="absolute left-[30%] top-[30%] h-[45%] w-[40%] rounded-full bg-wood-light/60 blur-[110px] animate-aurora" />
      <div className="absolute inset-0 grain opacity-70" />
    </div>
  );
}
