const fmt = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 });

/** "₹1,250" with Indian digit grouping, or '' when no price is set. */
export function rupees(n: number | null | undefined): string {
  return typeof n === 'number' && Number.isFinite(n) ? `₹${fmt.format(n)}` : '';
}
