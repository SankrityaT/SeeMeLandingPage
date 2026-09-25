'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import SmartVideo from '@/components/SmartVideo';
import { videoUrls } from '@/config/videoUrls';
import { REVIEWS } from './data/reviews';

// ========== SHARED ==========

const Reveal = ({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
    transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

const BG = {
  stars: '/backgrounds/backg3.webp',
  clouds: '/backgrounds/backg2.webp',
  city: '/backgrounds/backg4.webp',
  zen: '/backgrounds/backg5.webp',
  island: '/backgrounds/backg6.webp',
  mountain: '/backgrounds/backg1.webp',
};

// ========== TRAILER SLIDES ==========

const TRAILER_SLIDES = [
  { id: 'hook', bg: BG.mountain, duration: 5 },
  { id: 'depth', bg: BG.city, duration: 5 },
  { id: 'promise', bg: BG.clouds, duration: 5.5 },
  { id: 'private', bg: BG.zen, duration: 5.5 },
];

// Mini preview text for the grid
const GRID_PREVIEWS = [
  { line1: 'Imagine someone', line2: 'who truly knows you.' },
  { line1: 'Your habits. Your patterns.', line2: 'What keeps you up at night.' },
  { line1: 'Someone who listens', line2: 'And remembers everything.' },
  { line1: 'Completely private.', line2: 'On your device. Yours alone.' },
];

// ========== ACT 2 SECTIONS ==========

const ACT2_SECTIONS = [
  { id: 'reveal', bg: BG.island },
  { id: 'coaches', bg: '' }, // dark gradient
  { id: 'insights', bg: '' },
  { id: 'strategies', bg: '' },
  { id: 'notifications', bg: '' },
  { id: 'b2b', bg: BG.clouds },
  { id: 'proof', bg: BG.stars },
  { id: 'cta', bg: BG.island },
];

// ========== MAIN COMPONENT ==========

export const CinematicLanding = () => {
  // Phases: trailer → shrink → grid → zoom → product
  // Layers overlap: trailer(z-50) > grid(z-40) > product(z-10)
  const [phase, setPhase] = useState<'trailer' | 'shrink' | 'grid' | 'zoom' | 'product'>('trailer');
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [showUI, setShowUI] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const current = TRAILER_SLIDES[slide];
  const total = TRAILER_SLIDES.length;

  // --- Transition sequence ---
  const startTransition = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPlaying(false);
    if (isMobile) {
      // Mobile: simple fade out to product
      setPhase('shrink');
      setTimeout(() => setPhase('product'), 700);
    } else {
      // Desktop: shrink slide → grid forms → zoom through → product
      setPhase('shrink');                          // slide shrinks, grid appears behind
      setTimeout(() => setPhase('grid'), 900);     // grid fully visible, trailer gone
      setTimeout(() => setPhase('zoom'), 2600);    // grid zooms in, product appears behind
      setTimeout(() => setPhase('product'), 3400); // clean product view
    }
  }, [isMobile]);

  // --- Trailer auto-advance ---
  useEffect(() => {
    if (phase !== 'trailer' || !playing) return;
    timerRef.current = setTimeout(() => {
      if (slide < total - 1) setSlide(s => s + 1);
      else startTransition();
    }, current.duration * 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [slide, playing, phase, current.duration, total, startTransition]);

  const advanceTrailer = useCallback(() => {
    if (phase !== 'trailer') return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (slide < total - 1) setSlide(s => s + 1);
    else startTransition();
  }, [phase, slide, total, startTransition]);

  const skipTrailer = useCallback(() => {
    startTransition();
  }, [startTransition]);

  // Show controls on hover (desktop) / always show on mobile
  useEffect(() => {
    if (isMobile) { setShowUI(true); return; }
    let hide: NodeJS.Timeout;
    const show = () => { setShowUI(true); clearTimeout(hide); hide = setTimeout(() => setShowUI(false), 2500); };
    window.addEventListener('mousemove', show);
    return () => { window.removeEventListener('mousemove', show); clearTimeout(hide); };
  }, [isMobile]);

  // ==========================================
  // LAYER VISIBILITY (overlapping, not sequential)
  // ==========================================
  const showTrailer = phase === 'trailer' || phase === 'shrink';
  const showGrid = !isMobile && (phase === 'shrink' || phase === 'grid' || phase === 'zoom');
  const showProduct = phase === 'zoom' || phase === 'product';

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ===== LAYER 3 (bottom): ACT 2 PRODUCT ===== */}
      {showProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'product' ? 1 : 0.5 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <Act2Product isMobile={isMobile} />
        </motion.div>
      )}

      {/* ===== LAYER 2 (middle): GRID ===== */}
      {showGrid && (
        <motion.div
          className="fixed inset-0 z-40 bg-black flex items-center justify-center p-8 md:p-16"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'zoom' ? 0 : 1,
            scale: phase === 'zoom' ? 1.5 : 1,
            filter: phase === 'zoom' ? 'blur(20px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="grid grid-cols-2 gap-4 md:gap-5 w-full max-w-4xl">
            {TRAILER_SLIDES.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className={`relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border-2 ${
                  i === slide ? 'border-white/30' : 'border-white/8'
                }`}
              >
                <div className="absolute inset-0" style={{ backgroundImage: `url(${s.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="absolute inset-0 bg-black/50" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                  <p className="text-xs md:text-sm font-medium text-center leading-snug">{GRID_PREVIEWS[i].line1}</p>
                  <p className="text-xs md:text-sm font-medium text-white/50 text-center leading-snug">{GRID_PREVIEWS[i].line2}</p>
                </div>
                {/* Highlight current slide */}
                {i === slide && (
                  <motion.div
                    className="absolute inset-0 border-2 border-white/20 rounded-xl md:rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0.5] }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ===== LAYER 1 (top): TRAILER ===== */}
      {showTrailer && (
        <motion.div
          className="fixed inset-0 z-50"
          animate={{
            scale: phase === 'shrink' ? 0.82 : 1,
            opacity: phase === 'shrink' ? 0 : 1,
            filter: phase === 'shrink' ? 'blur(12px)' : 'blur(0px)',
          }}
          transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
          onClick={advanceTrailer}
          style={{ cursor: phase === 'trailer' ? 'pointer' : 'default' }}
        >
          {/* Background */}
          <div className="absolute inset-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute inset-0"
                style={{ backgroundImage: `url(${current.bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)' }} />
          </div>

          {/* Slide content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                {current.id === 'hook' && (
                  <div className="text-center px-8">
                    <Reveal><h2 className="text-3xl md:text-6xl font-bold leading-tight">Imagine someone</h2></Reveal>
                    <Reveal delay={0.5}><h2 className="text-3xl md:text-6xl font-bold leading-tight">who truly <span className="italic">knows</span> you.</h2></Reveal>
                  </div>
                )}
                {current.id === 'depth' && (
                  <div className="text-center px-8 max-w-3xl mx-auto">
                    <Reveal><p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed">Your habits. Your patterns.</p></Reveal>
                    <Reveal delay={0.4}><p className="text-xl md:text-3xl text-white/60 font-light leading-relaxed mt-2">What drives you. What holds you back.</p></Reveal>
                    <Reveal delay={0.9}><p className="text-xl md:text-3xl text-white font-medium leading-relaxed mt-2">What keeps you up at night.</p></Reveal>
                  </div>
                )}
                {current.id === 'promise' && (
                  <div className="text-center px-8 max-w-3xl mx-auto">
                    <Reveal><h2 className="text-3xl md:text-6xl font-bold leading-tight">Someone who listens</h2></Reveal>
                    <Reveal delay={0.4}><h2 className="text-3xl md:text-6xl font-bold leading-tight text-white/50">without judgment.</h2></Reveal>
                    <Reveal delay={1}><h2 className="text-3xl md:text-6xl font-bold leading-tight mt-4">And remembers <span className="font-black">everything.</span></h2></Reveal>
                  </div>
                )}
                {current.id === 'private' && (
                  <div className="text-center px-8 max-w-3xl mx-auto">
                    <Reveal><p className="text-xl md:text-2xl text-white/50 font-light mb-4">Now imagine all of that —</p></Reveal>
                    <Reveal delay={0.5}><h2 className="text-4xl md:text-7xl font-black leading-tight">completely private.</h2></Reveal>
                    <Reveal delay={1.2}><p className="text-lg md:text-xl text-white/40 mt-8">On your device. Yours alone.</p></Reveal>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress */}
          <div className="absolute bottom-0 left-0 right-0 z-30 h-[3px] bg-white/5">
            <motion.div className="h-full bg-white/30" animate={{ width: `${((slide + 1) / total) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>

          {/* Controls */}
          <motion.div
            animate={{ opacity: showUI ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 right-0 z-40 p-5 flex items-center justify-between pointer-events-none"
          >
            <span className="text-white/40 text-sm font-bold tracking-tight">SeeMe</span>
            <div className="flex items-center gap-3 pointer-events-auto">
              <span className="text-white/25 text-xs tabular-nums">{slide + 1}/{total}</span>
              <button onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                {playing ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                )}
              </button>
              <button onClick={(e) => { e.stopPropagation(); skipTrailer(); }} className="text-white/25 hover:text-white/50 transition-colors text-xs">Skip</button>
            </div>
          </motion.div>

          {/* Side dots */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1.5">
            {TRAILER_SLIDES.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'bg-white scale-150' : i < slide ? 'bg-white/35' : 'bg-white/10'}`} />
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

// ========== ACT 2 PRODUCT (own component so useScroll ref is always hydrated) ==========

const Act2Product = ({ isMobile }: { isMobile: boolean }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ['start start', 'end end'] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  useEffect(() => {
    const unsub = smoothProgress.on('change', (v) => {
      const idx = Math.min(ACT2_SECTIONS.length - 1, Math.floor(v * ACT2_SECTIONS.length));
      setActiveSection(idx);
    });
    return unsub;
  }, [smoothProgress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div ref={scrollRef} style={{ height: `${ACT2_SECTIONS.length * (isMobile ? 80 : 100)}vh` }} className="relative">
        <div className="fixed inset-0 z-10">
          {/* Backgrounds */}
          <div className="absolute inset-0">
            {ACT2_SECTIONS.map((sec, i) => (
              <motion.div
                key={sec.id}
                className="absolute inset-0"
                animate={{ opacity: activeSection === i ? 1 : 0 }}
                transition={{ duration: 0.8 }}
                style={sec.bg ? {
                  backgroundImage: `url(${sec.bg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                } : { background: 'linear-gradient(to bottom, #000, #0a0a0a, #000)' }}
              />
            ))}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content layer */}
          <div className="relative z-10 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={ACT2_SECTIONS[activeSection].id}
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                className="w-full h-full flex items-center justify-center"
              >
                <Act2Content id={ACT2_SECTIONS[activeSection].id} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Side progress dots (desktop only) */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-1.5">
            {ACT2_SECTIONS.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeSection ? 'bg-white scale-150' : i < activeSection ? 'bg-white/35' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ========== ACT 2 CONTENT RENDERER ==========

const Act2Content = ({ id }: { id: string }) => {
  switch (id) {
    case 'reveal':
      return (
        <div className="text-center px-6">
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-[11rem] lg:text-[14rem] font-black tracking-tighter"
            style={{ textShadow: '0 0 120px rgba(255,255,255,0.1)' }}
          >
            SeeMe
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="text-base md:text-xl text-white/40 mt-3 tracking-wide font-light"
          >
            Your private personal intelligence
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-16">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
              className="mx-auto w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1.5"
            >
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-0.5 h-1.5 bg-white/40 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      );

    case 'coaches':
      return (
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-6xl mx-auto px-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">A network of expert coaches.</h2>
            <p className="text-white/50 text-base md:text-lg max-w-md leading-relaxed">
              Crafted from real practitioners in life, work, wellness, and mindset — powered by AI that learns from your world.
            </p>
          </div>
          <div className="relative">
            <PhoneMockup video={videoUrls.video1} poster="/mockups/mock1.webp" />
            {[
              { src: '/coaches/c1.png', pos: { top: '-5%', right: '-20%' }, d: 0.6 },
              { src: '/coaches/c2.png', pos: { top: '30%', right: '-25%' }, d: 0.8 },
              { src: '/coaches/c3.png', pos: { bottom: '25%', right: '-18%' }, d: 1 },
              { src: '/coaches/c4.png', pos: { top: '10%', left: '-20%' }, d: 1.2 },
              { src: '/coaches/c5.png', pos: { bottom: '35%', left: '-22%' }, d: 1.4 },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.75, scale: 1 }}
                transition={{ delay: c.d, duration: 0.5 }}
                className="absolute w-11 h-11 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-white/15 shadow-xl hidden md:block"
                style={c.pos as React.CSSProperties}
              >
                <Image src={c.src} alt="" fill className="object-cover" />
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'insights':
      return (
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 max-w-6xl mx-auto px-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">It learns what you can't explain.</h2>
            <p className="text-white/50 text-base md:text-lg max-w-md leading-relaxed mb-6">
              SeeMe connects the dots across your sessions, reflections, calendar, health data, and screen time patterns.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {['Sessions', 'Reflections', 'Calendar', 'Health', 'Screen time'].map((p, i) => (
                <motion.span key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm text-white/50"
                >{p}</motion.span>
              ))}
            </div>
          </div>
          <PhoneMockup video={videoUrls.video3} poster="/mockups/mock3.webp" />
        </div>
      );

    case 'strategies':
      return (
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-6xl mx-auto px-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">Expert strategies, tailored to you.</h2>
            <p className="text-white/50 text-base md:text-lg max-w-md leading-relaxed">
              Evidence-based methods and guided sessions, adapted to your goals and daily reality. Not generic advice — yours.
            </p>
          </div>
          <PhoneMockup video={videoUrls.video5} poster="/mockups/mock5.webp" />
        </div>
      );

    case 'notifications':
      return (
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20 max-w-6xl mx-auto px-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">Rise with daily guidance.</h2>
            <p className="text-white/50 text-base md:text-lg max-w-md leading-relaxed">
              Timely nudges aligned with your mood, energy, and intentions. The right words, at the right moment.
            </p>
          </div>
          <div className="relative">
            <PhoneMockup video={videoUrls.video4} poster="/mockups/mock4.webp" />
            {[
              { src: '/notifications/notif1.png', pos: { top: '8%', right: '-55%' }, d: 0.6 },
              { src: '/notifications/notif3.png', pos: { top: '38%', right: '-50%' }, d: 0.8 },
              { src: '/notifications/notif5.png', pos: { top: '68%', right: '-45%' }, d: 1.0 },
            ].map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 0.85, x: 0 }}
                transition={{ delay: n.d, duration: 0.6 }}
                className="absolute hidden lg:block" style={n.pos as React.CSSProperties}
              >
                <Image src={n.src} alt="" width={220} height={72} className="rounded-xl shadow-lg" />
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'b2b':
      return (
        <div className="text-center px-8 max-w-3xl">
          <p className="text-white/30 text-xs md:text-sm uppercase tracking-[0.25em] mb-8">For coaches & practitioners</p>
          <h2 className="text-3xl md:text-6xl font-bold leading-tight mb-6">
            Give your clients a coach<br /><span className="font-black">in their pocket.</span>
          </h2>
          <p className="text-white/45 text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Your voice. Your methods. Your style.<br />Manage clients, track progress, scale your practice.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {['Custom voice & persona', 'Client management', 'Session insights', 'White-label ready'].map((item, i) => (
              <motion.span key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white/50"
              >{item}</motion.span>
            ))}
          </div>
        </div>
      );

    case 'proof':
      return (
        <div className="max-w-5xl mx-auto px-6 w-full">
          <p className="text-white/30 text-xs md:text-sm uppercase tracking-[0.25em] text-center mb-10">From our early community</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {REVIEWS.slice(0, 4).map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.15 }}
                className="bg-white/[0.03] backdrop-blur-sm border border-white/8 rounded-2xl p-6"
              >
                <p className="text-white/70 text-sm leading-relaxed italic mb-4">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <p className="text-white/30 text-xs">{review.name}</p>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, j) => (
                      <svg key={j} className="w-3 h-3 text-yellow-500 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="text-center px-8">
          <h2 className="text-5xl md:text-8xl font-black mb-4">Begin.</h2>
          <p className="text-base md:text-lg text-white/40 mb-12">Privately. On your terms.</p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-full font-semibold text-base shadow-2xl hover:scale-105 transition-transform"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download for iOS
            </a>
            <a href="mailto:info@seemeapp.ai"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-base text-white/60 border border-white/15 hover:border-white/30 transition-colors"
            >
              I am a coach
            </a>
          </div>
          <div className="mt-16 flex items-center justify-center gap-4 text-xs text-white/20">
            <a href="/privacy" className="hover:text-white/40 transition-colors">Privacy</a>
            <span>·</span>
            <a href="mailto:info@seemeapp.ai" className="hover:text-white/40 transition-colors">Contact</a>
            <span>·</span>
            <span>© 2025 SeeMe</span>
          </div>
        </div>
      );

    default:
      return null;
  }
};

// ========== PHONE MOCKUP ==========

const PhoneMockup = ({ video, poster }: { video: string; poster: string }) => (
  <div className="relative w-[180px] h-[380px] md:w-[260px] md:h-[540px] shrink-0">
    <div className="absolute -inset-6 rounded-[60px] opacity-20 hidden md:block" style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)' }} />
    <div className="absolute inset-0 bg-black rounded-[36px] md:rounded-[46px] border-[5px] md:border-[7px] border-neutral-800 shadow-2xl overflow-hidden">
      <SmartVideo src={video} poster={poster} className="w-full h-full object-cover" priority={false} />
    </div>
  </div>
);

export default CinematicLanding;
