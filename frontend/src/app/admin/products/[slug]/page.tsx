'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/admin/api';
import type { AdminProduct } from '@/lib/admin/types';
import ProductForm from '@/components/admin/ProductForm';
import { Notice } from '@/components/admin/ui';

function EditProduct() {
  const { slug } = useParams<{ slug: string }>();
  const saved = useSearchParams()?.get('saved');
  const [item, setItem] = useState<AdminProduct | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    adminFetch<{ item: AdminProduct }>(`/api/admin/products/${encodeURIComponent(slug)}`)
      .then((d) => setItem(d.item))
      .catch((e) => setError(e.message));
  }, [slug]);
  if (error) return <Notice kind="error">{error}</Notice>;
  if (!item) return <p className="text-stone">Loading…</p>;
  return (
    <>
      {saved && (
        <div className="mb-4">
          <Notice kind="ok">जतन केले · Saved.</Notice>
        </div>
      )}
      <ProductForm key={item.updatedAt} initial={item} />
    </>
  );
}

export default function EditProductPage() {
  return (
    <Suspense>
      <EditProduct />
    </Suspense>
  );
}
