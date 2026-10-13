'use client';

import { Suspense } from 'react';
import EnquiryList from '@/components/admin/EnquiryList';

/** Franchise applications from the website form, with the applicant's details and call / WhatsApp links. */
export default function FranchisePage() {
  return (
    <Suspense>
      <EnquiryList only="franchise" title={{ mr: 'फ्रँचायझी अर्ज', en: 'Franchise applications from the website' }} />
    </Suspense>
  );
}
