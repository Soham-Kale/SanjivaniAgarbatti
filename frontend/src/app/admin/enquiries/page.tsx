'use client';

import { Suspense } from 'react';
import EnquiryList from '@/components/admin/EnquiryList';

export default function EnquiriesPage() {
  return (
    <Suspense>
      <EnquiryList />
    </Suspense>
  );
}
