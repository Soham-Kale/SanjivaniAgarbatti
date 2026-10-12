'use client';

import { motion } from 'framer-motion';
import { useContent, useWa } from '@/lib/content-context';

export default function FloatButtons() {
  const { site } = useContent();
  const waLink = useWa();
  return (
    <div className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-3 z-40 grid gap-2.5 sm:right-4 sm:gap-3">
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp वर संपर्क करा"
        className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14 rounded-full bg-[#1fa855] shadow-[0_12px_30px_-8px_rgba(0,0,0,.45)]"
      >
        <svg viewBox="0 0 24 24" fill="#fff" className="h-7 w-7" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z" />
        </svg>
      </motion.a>
      <motion.a
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.35, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        href={`tel:${site.phones[0]?.tel}`}
        aria-label="कॉल करा"
        className="grid h-12 w-12 place-items-center sm:h-14 sm:w-14 rounded-full bg-wood text-ivory shadow-[0_12px_30px_-8px_rgba(0,0,0,.45)]"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1z" />
        </svg>
      </motion.a>
    </div>
  );
}
