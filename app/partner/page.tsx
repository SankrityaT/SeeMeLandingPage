'use client';

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import SeemeButton from '@/components/ui/SeemeButton';
import { getSupabase } from '@/lib/supabase';

const heroContentVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const sectionRevealVariants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const coachStory = [
  {
    id: 'workspace', label: '01 · Your workspace',
    title: 'Your whole practice. One clear view.',
    description: 'Bring clients, sessions and shared updates together. Know what’s happening and where to focus next.',
    image: 'workspace', width: 1106, height: 736, mobileWidth: 358, mobileHeight: 856,
    caption: 'Clients & sessions',
    alt: 'SeeMe demo client roster and weekly calendar, with coaching meetings, guided exercises, completion indicators and client-shared updates.',
  },
  {
    id: 'clone', label: '02 · Your digital clone',
    title: 'A digital clone. Unmistakably you.',
    description: 'Shape it with your perspective, materials, coaching style and voice. Your approach becomes the foundation.',
    image: 'clone', width: 1106, height: 651, mobileWidth: 358, mobileHeight: 564,
    caption: 'Your digital clone',
    alt: 'Digital coach profile for fictional coach Morgan Lee, shaped by her foundation, coaching materials, style settings and selected voice.',
  },
  {
    id: 'studio', label: '03 · Your sessions',
    title: 'Your method, made repeatable.',
    description: 'Turn what works into guided sessions. Set the intention, shape the experience and preview it before assigning.',
    image: 'studio', width: 1106, height: 816, mobileWidth: 320, mobileHeight: 357,
    caption: 'Session studio',
    alt: 'Session studio for Letting go. Leading better., with a coaching intention and an illustrated preview of the guided session clients will see.',
  },
  {
    id: 'assign', label: '04 · Their next step',
    title: 'Built once. Personal every time.',
    description: 'Choose the session that fits each client and schedule it between meetings. Follow their completion from your workspace.',
    image: 'assign', width: 512, height: 539, mobileWidth: 358, mobileHeight: 559,
    caption: 'Assign a guided session',
    alt: 'Assigning Letting go. Leading better. to fictional client Alex Rivera, with a chosen date and time.',
  },
];

export default function PartnerPage() {
  const prefersReducedMotion = useReducedMotion();
  const heroStageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroStageProgress } = useScroll({
    target: heroStageRef,
    offset: ['start 80%', 'end 30%'],
  });
  const heroStageOpacity = useTransform(
    heroStageProgress,
    prefersReducedMotion ? [0, 1] : [0, 0.28, 0.72, 1],
    prefersReducedMotion ? [1, 1] : [1, 1, 0.62, 0],
  );
  const heroStageScale = useTransform(heroStageProgress, [0, 0.72, 1], prefersReducedMotion ? [1, 1, 1] : [1, 0.985, 0.96]);
  const heroStageY = useTransform(heroStageProgress, [0, 0.72, 1], prefersReducedMotion ? [0, 0, 0] : [0, -12, -42]);
  const sideExitProgress = useTransform(heroStageProgress, [0.12, 0.68, 1], [0, 0.78, 1]);
  const leftSideExitX = useTransform(sideExitProgress, prefersReducedMotion ? [0, 1] : [0, 1], prefersReducedMotion ? [0, 0] : [0, -220]);
  const rightSideExitX = useTransform(sideExitProgress, prefersReducedMotion ? [0, 1] : [0, 1], prefersReducedMotion ? [0, 0] : [0, 220]);
  const sideExitOpacity = useTransform(sideExitProgress, prefersReducedMotion ? [0, 1] : [0, 0.72, 1], prefersReducedMotion ? [1, 1] : [1, 0.35, 0]);
  const [coachType, setCoachType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleApply = async () => {
    if (!name.trim() || !email.trim() || !coachType) {
      setSubmitError('Please fill in your name, email, and coach type before applying.');
      setSubmitted(false);
      return;
    }

    setSubmitError('');
    setSubmitting(true);

    try {
      const supabase = getSupabase();
      if (!supabase) {
        setSubmitError('Unable to connect. Please try again later.');
        setSubmitting(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any).from('partner_applications').insert({
        name: name.trim(),
        email: email.trim(),
        coach_type: coachType,
        selected_mode: 'hybrid',
      });

      if (error) {
        setSubmitError('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      setName('');
      setEmail('');
      setCoachType('');
      setSubmitting(false);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="partner-page">
      <div className="new-landing-topbar is-visible">
        <Link href="/" className="new-landing-topbar-logo" aria-label="SeeMe home">
          <Image src="/SeeMeB2CIcon.png" alt="SeeMe" width={22} height={22} style={{ display: 'block' }} />
        </Link>
        <div className="new-landing-topbar-actions">
          <SeemeButton href="/" variant="unfilled" size="sm" className="new-landing-topbar-cta">
            Client Experience
          </SeemeButton>
        </div>
      </div>

      <section className="partner-simple-hero" aria-labelledby="coach-hero-heading">
        <div className="partner-hero-content">
          <motion.div className="partner-hero-copy" variants={heroContentVariants} initial="hidden" animate="visible">
            <motion.div className="eyebrow" variants={heroItemVariants}>Coaching 3.0</motion.div>
            <motion.h1 id="coach-hero-heading" variants={heroItemVariants}>Your coaching, beyond the hour.<br /><em>Your practice, built to scale.</em></motion.h1>
            <motion.p variants={heroItemVariants}>A digital extension of your coaching, shaped by your methods and guided by you.</motion.p>
            <motion.div className="partner-hero-actions" variants={heroItemVariants}>
              <SeemeButton href="#apply" variant="filled" size="lg">Join the coach pilot</SeemeButton>
              <Link href="#how-it-works" className="partner-explore-link">Explore the platform <span aria-hidden="true">↓</span></Link>
            </motion.div>
          </motion.div>

          <motion.div
            ref={heroStageRef}
            className="partner-hero-stage"
            role="group"
            aria-label="A preview of the SeeMe coaching workspace"
            style={{ opacity: heroStageOpacity, scale: heroStageScale, y: heroStageY }}
          >
            <motion.figure
              className="partner-platform-image partner-hero-product partner-hero-product--main"
              initial={{ opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="/coach-platform/workspace-hero.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size client overview screenshot">
                <Image src="/coach-platform/workspace-hero.png" alt="SeeMe coaching prototype showing the coach&apos;s client roster, weekly calendar of sessions and exercises, and client records" width={1440} height={1100} sizes="(max-width: 767px) 100vw, 70vw" priority />
              </a>
              <figcaption>Clients &amp; sessions · local prototype with fictional data</figcaption>
            </motion.figure>

            <motion.div className="partner-hero-product partner-hero-product--left" style={{ x: leftSideExitX, opacity: sideExitOpacity }}>
              <motion.figure
                className="partner-platform-image partner-hero-product-inner"
                initial={{ opacity: 0, x: -130, y: 28, rotate: -7, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -4, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="/coach-platform/clone-desktop.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size digital clone screenshot">
                  <Image src="/coach-platform/clone-desktop.png" alt="SeeMe digital clone shaped by the coach’s foundation, materials, style and voice" width={1106} height={651} sizes="(max-width: 767px) 42vw, 28vw" />
                </a>
                <figcaption>Your digital clone</figcaption>
              </motion.figure>
            </motion.div>

            <motion.div className="partner-hero-product partner-hero-product--right" style={{ x: rightSideExitX, opacity: sideExitOpacity }}>
              <motion.figure
                className="partner-platform-image partner-hero-product-inner"
                initial={{ opacity: 0, x: 130, y: 30, rotate: 7, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 4, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="/coach-platform/studio-desktop.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size session studio screenshot">
                  <Image src="/coach-platform/studio-desktop.png" alt="SeeMe studio for creating guided coaching sessions" width={1106} height={816} sizes="(max-width: 767px) 42vw, 28vw" />
                </a>
                <figcaption>Your guided sessions</figcaption>
              </motion.figure>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="partner-story-intro" id="how-it-works">
        <p>One workspace. Your approach, at every step.</p>
        <span>A look inside the coach pilot · Demo screens with fictional data</span>
      </div>

      {coachStory.map((step) => (
        <motion.section
          key={step.id}
          className={`section partner-product-section partner-product-section--${step.id}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={sectionRevealVariants}
          aria-labelledby={`${step.id}-heading`}
        >
          <div className="inner partner-feature-row">
            <div className="partner-feature-copy">
              <div className="eyebrow">{step.label}</div>
              <h2 id={`${step.id}-heading`}>{step.title}</h2>
              <p>{step.description}</p>
            </div>
            <figure className={`partner-story-visual partner-story-visual--${step.id}`}>
              <div className="partner-story-frame">
                {step.id === 'assign' && (
                  <div className="partner-assignment-source" aria-hidden="true">
                    <Image src="/coach-platform/studio-mobile.png" alt="" width={320} height={357} sizes="300px" />
                    <span>From your session library <span>→</span></span>
                  </div>
                )}
                <a href={`/coach-platform/${step.image}-desktop.png`} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size ${step.caption.toLowerCase()} screenshot`}>
                  <picture>
                    <source media="(max-width: 600px)" srcSet={`/coach-platform/${step.image}-mobile.png`} width={step.mobileWidth} height={step.mobileHeight} />
                    <Image src={`/coach-platform/${step.image}-desktop.png`} alt={step.alt} width={step.width} height={step.height} sizes={step.id === 'assign' ? '(max-width: 600px) 90vw, 480px' : '(max-width: 600px) 90vw, (max-width: 1200px) 90vw, 1080px'} />
                  </picture>
                </a>
              </div>
              <figcaption><span>{step.caption}</span><a href={`/coach-platform/${step.image}-desktop.png`} target="_blank" rel="noopener noreferrer" aria-label={`View ${step.caption.toLowerCase()} full screen`}>View full screen ↗</a></figcaption>
            </figure>
          </div>
        </motion.section>
      ))}

      <motion.section className="partner-client-bridge" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionRevealVariants} aria-labelledby="client-space-heading">
        <div className="eyebrow">One coaching relationship</div>
        <h2 id="client-space-heading">A clear workspace for you.<br /><em>A personal space for them.</em></h2>
        <p>SeeMe is designed to bring your approach into a client experience built around their own goals. The coach-client connection and client-controlled sharing are in development.</p>
        <Link href="/" className="partner-client-link">See the client experience <span aria-hidden="true">→</span></Link>
      </motion.section>

      <motion.div
        className="apply"
        id="apply"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
      >
        <h2>
          Shape the next chapter
          <br />
          <em>of your coaching.</em>
        </h2>
        <p>We&apos;re inviting a small group of coaches to help shape SeeMe. Bring your approach. We&apos;ll explore the fit together.</p>

        <div className="form">
          <AnimatePresence mode="wait">
            {submitted && !submitError ? (
              <motion.div
                key="success"
                className="partner-success-card"
                initial={{ opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18, scale: 0.98, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="partner-success-mark" aria-hidden="true">✓</div>
                <h3>Application received</h3>
                <p>Thanks. We&apos;ll review your application and follow up personally.</p>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="f-field">
                  <label htmlFor="partner-name">Full name</label>
                  <input id="partner-name" type="text" placeholder="Sarah Kim" value={name} onChange={(event) => setName(event.target.value)} />
                </div>

                <div className="f-field">
                  <label htmlFor="partner-email">Email</label>
                  <input id="partner-email" type="email" placeholder="sarah@yourpractice.com" value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>

                <div className="f-field">
                  <label htmlFor="partner-coach-type">Coach type</label>
                  <select id="partner-coach-type" value={coachType} onChange={(event) => setCoachType(event.target.value)}>
                    <option value="" disabled>Select your primary practice</option>
                    <option value="life">Life Coach</option>
                    <option value="therapist">Therapist</option>
                    <option value="executive">Executive / Leadership Coach</option>
                    <option value="career">Career Coach</option>
                    <option value="health">Health &amp; Wellness Coach</option>
                    <option value="relationship">Relationship Coach</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <SeemeButton
                  type="button"
                  variant="filled"
                  size="lg"
                  fullWidth
                  className="partner-submit-button"
                  onClick={handleApply}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Apply to pilot'}
                </SeemeButton>

                {submitError ? <p className="f-note partner-form-error">{submitError}</p> : null}
                {!submitError ? <p className="f-note">No commitment. We&apos;ll be in touch to discuss the pilot.</p> : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="new-landing-footer">
        <div className="new-landing-footer-links">
          <Link href="/privacy" className="new-landing-footer-link">Privacy</Link>
          <span className="new-landing-footer-dot">·</span>
          <a href="mailto:info@seemeapp.ai" className="new-landing-footer-link">Contact</a>
          <span className="new-landing-footer-dot">·</span>
          <span className="new-landing-footer-copy">© 2026 SeeMe</span>
        </div>
      </footer>
    </div>
  );
}
