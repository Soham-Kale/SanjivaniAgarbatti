'use client';

import Link from 'next/link';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="eyebrow justify-center">त्रुटी · Error</p>
        <h1 className="h-section mt-3">काहीतरी चुकले</h1>
        <p className="lede mx-auto mt-3">पान लोड होऊ शकले नाही. पुन्हा प्रयत्न करा किंवा आम्हाला WhatsApp वर संपर्क करा.</p>
        <div className="mt-8 flex justify-center gap-3">
          <button type="button" onClick={reset} className="btn-primary">पुन्हा प्रयत्न करा</button>
          <Link href="/" className="btn-outline">मुख्य पान</Link>
        </div>
      </div>
    </section>
  );
}
