export default function Loading() {
  return (
    <div className="wrap grid grid-cols-2 gap-6 py-16 lg:grid-cols-4" aria-busy="true" aria-label="लोड होत आहे">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[3/5] animate-pulse rounded-[22px] bg-ivory-3" />
      ))}
    </div>
  );
}
