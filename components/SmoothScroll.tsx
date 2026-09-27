'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const nativeScroll = window.matchMedia('(max-width: 767px), (pointer: coarse), (prefers-reduced-motion: reduce)');
    let lenis: Lenis | undefined;
    let rafId = 0;

    const stop = () => {
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = undefined;
    };
    const update = () => {
      stop();
      if (nativeScroll.matches) return;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    };

    update();
    nativeScroll.addEventListener('change', update);
    return () => {
      nativeScroll.removeEventListener('change', update);
      stop();
    };
  }, []);

  return <>{children}</>;
}
