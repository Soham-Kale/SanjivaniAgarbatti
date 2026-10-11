'use client';

import { motion } from 'framer-motion';
import { SITE, waLink } from '@/lib/site';

export default function FloatButtons() {
  return (
    <div className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] right-4 z-[60] grid gap-2.5">
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={waLink()}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
        className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#1fa855] shadow-[0_10px_30px_rgba(0,0,0,.5)]"
      >
        <svg viewBox="0 0 24 24" fill="#fff" className="h-[26px] w-[26px]">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.6 11.6 0 0 0 4.4 3.9c1.6.7 2.3.8 3.1.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.4-.3z" />
        </svg>
      </motion.a>
      <motion.a
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        href={`tel:${SITE.phones[0].tel}`}
        aria-label="कॉल करा"
        className="grid h-[54px] w-[54px] place-items-center rounded-full bg-gold shadow-[0_10px_30px_rgba(0,0,0,.5)]"
      >
        <svg viewBox="0 0 24 24" fill="#1a1209" className="h-[26px] w-[26px]">
          <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.3 1z" />
        </svg>
      </motion.a>
    </div>
  );
}
