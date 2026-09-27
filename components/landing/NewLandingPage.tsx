// Created by Mohan
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import SeemeButton from '@/components/ui/SeemeButton';
import LandingActionPanel from '@/components/landing/LandingActionPanel';
import { COACH_PARTNERS as COACHES } from '@/lib/coach-partners';

// ========== TYPES ==========
type Phase = 'seeme' | 'content';

// ========== INFINITE CAROUSEL (mobile) ==========
const InfiniteCarousel = ({
  children,
  speed = 30,
  gap = 28,
  className = '',
}: {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    if (!trackRef.current) return;
    const firstSet = trackRef.current.children[0] as HTMLElement;
    if (!firstSet) return;
    const w = firstSet.offsetWidth;
    setDuration(w / speed);
  }, [children, speed, gap]);

  const setStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: `${gap}px`,
    paddingRight: `${gap}px`,
    flexShrink: 0,
  };

  return (
    <div className={`new-landing-carousel-mask ${className}`}>
      <div
        className="new-landing-carousel-track"
        ref={trackRef}
        style={{ animationDuration: `${duration}s` }}
      >
        <div style={setStyle}>{children}</div>
        <div style={setStyle}>{children}</div>
        <div style={setStyle}>{children}</div>
      </div>
    </div>
  );
};

// ========== FADE-IN WRAPPER ==========
const FadeInWhenVisible = ({
  children,
  delay = 0,
  duration = 0.8,
  className = '',
  y = 30,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ========== INTEGRATION ICONS DATA ==========
const INTEGRATION_ICONS = [
  { src: '/MicrosoftOutlookIcon.png', alt: 'Microsoft Outlook', width: 34, height: 34, mobileMaxHeight: 24, compact: true },
  { src: '/Group.png', alt: 'Google Calendar', width: 34, height: 34, mobileMaxHeight: 24, compact: true },
  { src: '/appleHealth.png', alt: 'Apple Health', width: 136, height: 50, wide: true },
  { src: '/AppleCalendar.png', alt: 'Apple Calendar', width: 52, height: 52 },
  { src: '/ScreenTime.png', alt: 'Screen Time', width: 52, height: 52 },
];


// ========== TESTIMONIALS DATA ==========
const TESTIMONIALS = [
  { id: 't1', text: "My journal used to just sit there. Now it talks back — and it actually knows what to say." },
  { id: 't2', text: "I've done therapy, read every self-help book. Nothing actually stuck. This did. First week." },
  { id: 't3', text: "It's like texting a friend who actually has their life together and genuinely wants to help with yours." },
  { id: 't4', text: "I check in every morning now. It's the ten minutes that make the rest of the day make sense." },
  { id: 't5', text: "Went in thinking I just needed to be more productive. Came out understanding myself a lot better than that." },
];

// ========== NOTIFICATION FRAME IMAGES ==========
const NOTIF_FRAMES = [
  { id: 'session', src: '/Frame1.png', alt: 'Upcoming Session notification', hasSlider: false },
  { id: 'charlotte', src: '/Frame2.png', alt: 'From Charlotte notification', hasSlider: true },
  { id: 'mo', src: '/Frame3.png', alt: 'From Mo notification', hasSlider: false },
];

const HERO_MOCKUPS = [
  { src: '/FirstMockupUpdated.png', alt: 'Check-in', initialX: 372, initialY: 18, initialRotate: -20, initialScale: 0.82, delay: 0.88, zIndex: 1 },
  { src: '/updatedmockup2.png', alt: 'Capacity View', initialX: 196, initialY: 10, initialRotate: -11, initialScale: 0.88, delay: 0.8, zIndex: 2 },
  { src: '/updatedmockup3.png', alt: 'Affirmation', initialX: 0, initialY: 36, initialRotate: 0, initialScale: 0.86, delay: 0.72, zIndex: 5 },
  { src: '/updatedmockup4.png', alt: 'Voice Call', initialX: -196, initialY: 10, initialRotate: 11, initialScale: 0.88, delay: 0.8, zIndex: 2 },
  { src: '/updatedmockup5.png', alt: 'Chat', initialX: -372, initialY: 18, initialRotate: 20, initialScale: 0.82, delay: 0.88, zIndex: 1 },
] as const;

const MOBILE_HERO_SEQUENCE = [2, 1, 3, 0, 4] as const;
const MOBILE_HERO_INTERVAL_MS = 4000;
const MOBILE_HERO_FADE_MS = 950;

// ========== MAIN COMPONENT ==========
export const NewLandingPage = () => {
  const [phase, setPhase] = useState<Phase>('seeme');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileHeroIndex, setMobileHeroIndex] = useState(0);
  const [mobileHeroPreviousIndex, setMobileHeroPreviousIndex] = useState<number | null>(null);
  const [seemeSize, setSeemeSize] = useState<number | null>(null);
  const knowsYouRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const mobileHeroResetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileHeroPreviousIndex(null);
      }
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      window.scrollTo(0, 70);
    }
  }, []);

  // Measure container height (set by sizer) and sync SeeMe font-size to it exactly
  useEffect(() => {
    if (!textContainerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setSeemeSize(entry.contentRect.height);
    });
    ro.observe(textContainerRef.current);
    return () => ro.disconnect();
  }, []);

  const scrollToNextSection = () => {
    knowsYouRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Timed hero animation:
  // Phase 1: "SeeMe" shows for 2.5s, then fades up
  // Phase 2: "Private. Personal. Intelligent." + tagline + mockups appear together
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('content'), 2500);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      if (mobileHeroResetTimeoutRef.current !== null) {
        window.clearTimeout(mobileHeroResetTimeoutRef.current);
        mobileHeroResetTimeoutRef.current = null;
      }
      return;
    }

    const interval = window.setInterval(() => {
      setMobileHeroIndex((current) => {
        setMobileHeroPreviousIndex(current);
        return (current + 1) % HERO_MOCKUPS.length;
      });
      if (mobileHeroResetTimeoutRef.current !== null) {
        window.clearTimeout(mobileHeroResetTimeoutRef.current);
      }
      mobileHeroResetTimeoutRef.current = window.setTimeout(() => {
        setMobileHeroPreviousIndex(null);
        mobileHeroResetTimeoutRef.current = null;
      }, MOBILE_HERO_FADE_MS);
    }, MOBILE_HERO_INTERVAL_MS);

    return () => {
      window.clearInterval(interval);
      if (mobileHeroResetTimeoutRef.current !== null) {
        window.clearTimeout(mobileHeroResetTimeoutRef.current);
        mobileHeroResetTimeoutRef.current = null;
      }
    };
  }, [isMobile]);

  return (
    <div className="new-landing-root">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          <Image src="/SeeMeB2CIcon.png" alt="SeeMe" width={22} height={22} style={{ display: 'block' }} />
        </Link>
        <div className="new-landing-topbar-actions">
          <SeemeButton href="/partner" variant="unfilled" size="sm" className="new-landing-topbar-cta">
            I am a coach
          </SeemeButton>
        </div>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section className="new-landing-hero">
        <div className="new-landing-hero-bg">
          <img
            src="/updatedB2CBackground.png"
            alt=""
            className="new-landing-hero-bg-image new-landing-hero-bg-image-desktop"
          />
          <img
            src="/b2c-mobile-hero-current.png"
            alt=""
            className="new-landing-hero-bg-image new-landing-hero-bg-image-mobile"
          />
          <div className="new-landing-hero-overlay" />
        </div>

        {/* Hero content wrapper — mockups persist across phases */}
        <div className="new-landing-mockups-wrapper">
          {/* Text container — height locked by invisible sizer matching title+subtitle */}
          <div className="new-landing-text-container" ref={textContainerRef}>
            {/* Sizer: always rendered, invisible — defines stable container height */}
            <div className="new-landing-text-sizer" aria-hidden="true">
              <h2 className={isMobile ? 'new-landing-mockups-title-mobile' : 'new-landing-mockups-title'}>
                {isMobile ? (<>Private.<br />Personal.<br />Intelligent.</>) : 'Private. Personal. Intelligent.'}
              </h2>
              <p className="new-landing-mockups-tagline">
                AI built around how you think, reflect, and grow -
                {isMobile ? '\n' : ' '}
                with expert coaches in your corner.
              </p>
            </div>

            {/* Animated overlay — both phases absolutely fill the sizer */}
            <AnimatePresence mode="wait">
              {phase === 'seeme' ? (
                <motion.div
                  key="seeme-text"
                  className="new-landing-text-abs"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                        when: 'beforeChildren',
                      },
                    },
                    exit: {
                      opacity: 0,
                      transition: {
                        duration: 0.3,
                        ease: [0.22, 1, 0.36, 1],
                        when: 'afterChildren',
                      },
                    },
                  }}
                >
                  <motion.h1
                    className="new-landing-seeme-title"
                    variants={{
                      hidden: { opacity: 0, filter: 'blur(10px)', scale: 0.985 },
                      visible: {
                        opacity: 1,
                        filter: 'blur(0px)',
                        scale: 1,
                        transition: { duration: 1.35, ease: [0.22, 1, 0.36, 1], delay: 0.18 },
                      },
                      exit: {
                        opacity: 0,
                        filter: 'blur(10px)',
                        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                      },
                    }}
                    style={seemeSize ? { fontSize: `${Math.round(seemeSize * (isMobile ? 0.45 : 1))}px` } : undefined}
                  >
                    SeeMe
                  </motion.h1>
                </motion.div>
              ) : (
                <motion.div
                  key="content-text"
                  className="new-landing-text-abs"
                  initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h2 className={isMobile ? 'new-landing-mockups-title-mobile' : 'new-landing-mockups-title'}>
                    {isMobile ? (
                      <>
                        Private.<br />
                        Personal.<br />
                        Intelligent.
                      </>
                    ) : (
                      'Private. Personal. Intelligent.'
                    )}
                  </h2>
                  <motion.p
                    className="new-landing-mockups-tagline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.35 }}
                    style={{ textAlign: 'center' }}
                  >
                    AI built around how you think, reflect, and grow -
                    {isMobile ? '\n' : ' '}
                    with expert coaches in your corner.
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Phone Mockups — center mockup appears first, others fan out from behind it */}
          <div className="new-landing-phones">
            {isMobile ? (
              <div className="new-landing-phone-stage">
                {mobileHeroPreviousIndex !== null ? (
                  <motion.div
                    key={`previous-${HERO_MOCKUPS[MOBILE_HERO_SEQUENCE[mobileHeroPreviousIndex]].src}`}
                    className="new-landing-phone new-landing-phone-single new-landing-phone-layer"
                    initial={{ opacity: 1, x: 0, scale: 1 }}
                    animate={{ opacity: 0, x: -240, scale: 0.2 }}
                    transition={{ duration: MOBILE_HERO_FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden="true"
                  >
                    <Image
                      src={HERO_MOCKUPS[MOBILE_HERO_SEQUENCE[mobileHeroPreviousIndex]].src}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 180px, 280px"
                      quality={90}
                      style={{ objectFit: 'contain', borderRadius: '22px' }}
                    />
                  </motion.div>
                ) : null}
                <motion.div
                  key={`current-${HERO_MOCKUPS[MOBILE_HERO_SEQUENCE[mobileHeroIndex]].src}`}
                  className="new-landing-phone new-landing-phone-single new-landing-phone-layer"
                  initial={mobileHeroPreviousIndex === null ? false : { opacity: 0, x: 240, scale: 0.2 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: MOBILE_HERO_FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={HERO_MOCKUPS[MOBILE_HERO_SEQUENCE[mobileHeroIndex]].src}
                    alt={`SeeMe App - ${HERO_MOCKUPS[MOBILE_HERO_SEQUENCE[mobileHeroIndex]].alt}`}
                    fill
                    sizes="(max-width: 768px) 180px, 280px"
                    quality={90}
                    style={{ objectFit: 'contain', borderRadius: '22px' }}
                  />
                </motion.div>
              </div>
            ) : (
              <>
                {HERO_MOCKUPS.map((mock) => (
                  <motion.div
                    key={mock.src}
                    className="new-landing-phone"
                    style={{ zIndex: mock.zIndex }}
                    initial={{
                      opacity: 0,
                      x: mock.initialX,
                      y: mock.initialY,
                      scale: mock.initialScale,
                      rotate: mock.initialRotate,
                      filter: 'blur(10px)',
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      scale: 1,
                      rotate: 0,
                      filter: 'blur(0px)',
                    }}
                    transition={{
                      duration: 1.45,
                      delay: mock.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={mock.src}
                      alt={`SeeMe App - ${mock.alt}`}
                      width={220}
                      height={450}
                      quality={90}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </motion.div>
                ))}
              </>
            )}
          </div>

          {/* App Store Button — always present, fades in with phones */}
          <motion.div
            className="new-landing-appstore-btn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <SeemeButton
              href="https://apps.apple.com/us/app/seeme-personal-growth/id6739706517"
              target="_blank"
              rel="noopener noreferrer"
              variant="filled"
              size="lg"
              className="seeme-button--appstore"
            >
              <Image
                src="/appstorebadge.png"
                alt="Download on the App Store"
                width={200}
                height={67}
                className="seeme-button-appstore-image"
              />
            </SeemeButton>
          </motion.div>

          {/* Scroll indicator — always present, fades in with phones */}
          <motion.div
            className="new-landing-scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.7, delay: 1.0 }}
            onClick={scrollToNextSection}
            whileHover={{ scale: 1.1, opacity: 1 }}
            style={{ cursor: 'pointer' }}
          >
            <motion.svg
              width="36"
              height="12"
              viewBox="0 0 36 12"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <polyline points="2 2 18 10 34 2" />
            </motion.svg>
          </motion.div>
        </div>
      </section>

      {/* ==================== SECTION 2: A SYSTEM THAT REALLY KNOWS YOU ==================== */}
      <section ref={knowsYouRef} className="new-landing-section new-landing-knows-you">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            A system that <em>really</em> knows you.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            SeeMe learns how you think, what drives you, and where you get stuck — through daily check-ins, reflections, and your coaching sessions. It also connects with the apps already tracking your life, so it always has the full picture — even on the days you don&apos;t say a word.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <div className="new-landing-integrations-card">
            <span className="new-landing-integrations-label">Connects with</span>
            <div className="new-landing-integrations">
              {INTEGRATION_ICONS.map((icon, i) => (
                isMobile ? (
                  <div
                    key={icon.alt}
                    className={`new-landing-integration-icon${'wide' in icon && icon.wide ? ' wide' : ''}${'compact' in icon && icon.compact ? ' compact' : ''}`}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={icon.width}
                      height={icon.height}
                      style={{ objectFit: 'contain', height: 'auto' }}
                    />
                  </div>
                ) : (
                  <motion.div
                    key={icon.alt}
                    className={`new-landing-integration-icon${'wide' in icon && icon.wide ? ' wide' : ''}${'compact' in icon && icon.compact ? ' compact' : ''}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.5 }}
                  >
                    <Image
                      src={icon.src}
                      alt={icon.alt}
                      width={icon.width}
                      height={icon.height}
                      style={{ objectFit: 'contain', height: 'auto', maxHeight: '48px' }}
                    />
                  </motion.div>
                )
              ))}
            </div>
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 3: EXPERT DESIGNED FRAMEWORKS ==================== */}
      <section className="new-landing-section new-landing-frameworks">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Built with the <em>best</em> in the field.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            We partnered with coaches and experts worldwide to make sure every interaction is grounded in what actually works.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <div className="new-landing-coaches">
            {COACHES.map((coach, i) => {
              const card = isMobile ? (
                <div key={coach.name} className="new-landing-coach-card">
                  <div className="new-landing-coach-avatar">
                    <Image
                      src={coach.img}
                      alt={coach.name}
                      width={64}
                      height={64}
                      style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="new-landing-coach-info">
                    <span className="new-landing-coach-name">{coach.name}</span>
                    <span className="new-landing-coach-role">{coach.role}</span>
                  </div>
                </div>
              ) : (
                <motion.div
                  key={coach.name}
                  className="new-landing-coach-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                >
                  <div className="new-landing-coach-avatar">
                    <Image
                      src={coach.img}
                      alt={coach.name}
                      width={72}
                      height={72}
                      style={{ borderRadius: '50%', objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                  <div className="new-landing-coach-info">
                    <span className="new-landing-coach-name">{coach.name}</span>
                    <span className="new-landing-coach-role">{coach.role}</span>
                  </div>
                </motion.div>
              );
              return coach.link ? (
                <a key={coach.name} href={coach.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{card}</a>
              ) : card;
            })}
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 4: INTEGRATED TO MAKE YOU BETTER ==================== */}
      <section className="new-landing-section new-landing-integrated" style={{ paddingBottom: isMobile ? '14px' : '30px' }}>
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading new-landing-integrated-heading">
            Your coaches are with <em>you</em> every day.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext">
            SeeMe fills the space between your scheduled sessions with the nudges, check-ins, and insights that keep you moving. Your coaches always know what&apos;s next for you — whether that&apos;s a reflection, a new session, or just the right push at the right moment. When your next session comes, nothing has been lost — and you walk in ready.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          {isMobile ? (
            <div className="new-landing-notif-stack">
              {NOTIF_FRAMES.map((frame) => (
                <div key={frame.id} className="new-landing-notif-frame">
                  <div className="new-landing-notif-icon-overlay">
                    <Image
                      src="/SeeMe-iOS-Dark.png"
                      alt="SeeMe"
                      width={28}
                      height={28}
                      style={{ borderRadius: '6px', objectFit: 'cover' }}
                    />
                  </div>
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    width={320}
                    height={180}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                  {frame.hasSlider && (
                    <div className="new-landing-notif-slider-overlay">
                      <Image
                        src="/slider.png"
                        alt="Energy gauge"
                        width={260}
                        height={40}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="new-landing-notif-grid">
              {NOTIF_FRAMES.map((frame, i) => (
                <motion.div
                  key={frame.id}
                  className="new-landing-notif-frame"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 * i, duration: 0.6 }}
                >
                  <div className="new-landing-notif-icon-overlay">
                    <Image
                      src="/SeeMe-iOS-Dark.png"
                      alt="SeeMe"
                      width={28}
                      height={28}
                      style={{ borderRadius: '6px', objectFit: 'cover' }}
                    />
                  </div>
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    width={320}
                    height={180}
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                  {frame.hasSlider && (
                    <div className="new-landing-notif-slider-overlay">
                      <Image
                        src="/slider.png"
                        alt="Energy gauge"
                        width={260}
                        height={40}
                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 5: TESTIMONIALS ==================== */}
      <section className="new-landing-section new-landing-testimonials">
        <FadeInWhenVisible delay={0.15}>
          <InfiniteCarousel speed={36} gap={20} className="new-landing-testimonials-carousel">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="new-landing-testimonial-card"
              >
                <div className="new-landing-testimonial-card-inner">
                  <p>{t.text}</p>
                </div>
              </div>
            ))}
          </InfiniteCarousel>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 6: COMPLETELY PRIVATE ==================== */}
      <section className="new-landing-section new-landing-privacy">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Completely <em>Private</em>
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext new-landing-privacy-subtext">
            We believe privacy is a fundamental human right — so we built SeeMe with it at the core. All your personal data lives solely on your device. Not in the cloud, not on anybody&apos;s servers. And with on-device AI models, your most personal thoughts never even leave your phone.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <div className="new-landing-privacy-lock">
            <Image
              src="/lock.png"
              alt="Privacy Lock"
              width={56}
              height={68}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 7: WORKS WITH YOUR COACH ==================== */}
      <section className="new-landing-section new-landing-coach-section">
        <FadeInWhenVisible>
          <h2 className="new-landing-section-heading">
            Works with your coach. Works without one.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.15}>
          <p className="new-landing-section-subtext new-landing-coach-subtext">
            SeeMe works as your always-on AI guide — but it&apos;s also built to bring real coaches into your journey. Connect with a human coach on the platform and they get a richer picture of you than any coach has ever had before: your patterns, your progress, your history — all shared securely, all context they can actually use.
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.3}>
          <p className="new-landing-b2b-text new-landing-b2b-text-above">
            Are you a coach?
          </p>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.38}>
          <motion.div
            className="new-landing-appstore-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <SeemeButton href="/partner" variant="filled" size="lg">
              I am a coach
            </SeemeButton>
          </motion.div>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.53}>
          <p className="new-landing-b2b-text">
            and explore our coaches platform
          </p>
        </FadeInWhenVisible>
      </section>

      {/* ==================== SECTION 8: TRY FOR FREE ==================== */}
      <LandingActionPanel
        id="try-free"
        title="Try for Free"
        description="No account and signup required."
      >
          <FadeInWhenVisible delay={0.3}>
            <motion.div
              className="new-landing-appstore-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <SeemeButton
                href="https://apps.apple.com/us/app/seeme-personal-growth/id6739706517"
                target="_blank"
                rel="noopener noreferrer"
                variant="filled"
                size="lg"
                className="seeme-button--appstore"
              >
                <Image
                  src="/appstorebadge.png"
                  alt="Download on the App Store"
                  width={200}
                  height={67}
                  className="seeme-button-appstore-image"
                />
              </SeemeButton>
            </motion.div>
          </FadeInWhenVisible>

          <FadeInWhenVisible delay={0.45}>
            <div className="new-landing-disclaimer" role="note" aria-label="Disclaimer">
              <p className="new-landing-disclaimer-title">Disclaimer</p>
              <p className="new-landing-disclaimer-text">
                SeeMe is a personal coaching and wellness platform and is not a substitute for professional medical advice, diagnosis, or treatment. If you are experiencing a mental health crisis or emergency, please contact a qualified healthcare provider or emergency services immediately. Use of SeeMe does not create a therapist-patient or doctor-patient relationship. Results may vary.
              </p>
            </div>
          </FadeInWhenVisible>
      </LandingActionPanel>

      {/* ==================== FOOTER ==================== */}
      <footer className="new-landing-footer">
        <div className="new-landing-footer-links">
          <a href="/privacy" className="new-landing-footer-link">Privacy</a>
          <span className="new-landing-footer-dot">·</span>
          <a href="mailto:info@seemeapp.ai" className="new-landing-footer-link">Contact</a>
          <span className="new-landing-footer-dot">·</span>
          <span className="new-landing-footer-copy">© 2026 SeeMe</span>
        </div>
      </footer>
    </div>
  );
};

export default NewLandingPage;
