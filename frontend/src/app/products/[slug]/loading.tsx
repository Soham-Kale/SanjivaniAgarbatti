export default function Loading() {
  return (
    <div className="wrap grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr]" aria-busy="true" aria-label="लोड होत आहे">
      <div className="aspect-[4/5] animate-pulse rounded-[28px] bg-sage" />
      <div className="grid content-start gap-4">
        <div className="h-4 w-32 animate-pulse rounded bg-ivory-3" />
        <div className="h-12 w-3/4 animate-pulse rounded bg-ivory-3" />
        <div className="h-24 w-full animate-pulse rounded bg-ivory-3" />
        <div className="h-28 w-full animate-pulse rounded-[22px] bg-ivory-3" />
      </div>
    </div>
  );
}
