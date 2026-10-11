import Link from 'next/link';
import T from '@/components/T';

export default function NotFound() {
  return (
    <section className="wrap grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <div className="eyebrow justify-center">404</div>
        <h1 className="h-section mt-3"><T mr="हे पान सापडले नाही" en="Page not found" /></h1>
        <Link href="/" className="btn-primary mt-8"><T mr="मुख्य पानावर जा" en="Go to home" /></Link>
      </div>
    </section>
  );
}
