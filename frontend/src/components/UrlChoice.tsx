'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductGrid from './ProductGrid';
import EnquiryForm from './EnquiryForm';
import type { Category, Product } from '@/lib/types';

/*
 * The products and franchise pages are built once as static pages (so they open instantly);
 * the ?c= category and ?plan= choice are read here in the browser instead of on the server.
 */

const CATS = ['daily', 'premium', 'dhoop', 'cup', 'puja'];
const PLANS = ['mini', 'franchise', 'warehouse'];

function GridFromUrl({ products }: { products: Product[] }) {
  const c = useSearchParams()?.get('c') ?? '';
  const initial = (CATS.includes(c) ? c : 'all') as Category | 'all';
  return <ProductGrid key={initial} products={products} initial={initial} />;
}

export function ProductGridFromUrl({ products }: { products: Product[] }) {
  return (
    <Suspense fallback={<ProductGrid products={products} />}>
      <GridFromUrl products={products} />
    </Suspense>
  );
}

function FormFromUrl() {
  const p = useSearchParams()?.get('plan') ?? '';
  const plan = PLANS.includes(p) ? p : 'franchise';
  return <EnquiryForm key={plan} type="franchise" defaultPlan={plan} />;
}

export function FranchiseFormFromUrl() {
  return (
    <Suspense fallback={<EnquiryForm type="franchise" defaultPlan="franchise" />}>
      <FormFromUrl />
    </Suspense>
  );
}
