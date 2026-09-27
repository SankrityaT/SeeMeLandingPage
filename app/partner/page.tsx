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
            <motion.div className="eyebrow" variants={heroItemVariants}>For coaches</motion.div>
            <motion.h1 id="coach-hero-heading" variants={heroItemVariants}>Better coaching for clients.<br /><em>More earning potential for you.</em></motion.h1>
            <motion.p variants={heroItemVariants}>Turn your method into guidance clients can use between sessions.</motion.p>
            <motion.div className="partner-hero-actions" variants={heroItemVariants}>
              <SeemeButton href="#apply" variant="filled" size="lg">Join the coach pilot</SeemeButton>
              <Link href="#how-it-works" className="partner-explore-link">See how it works <span aria-hidden="true">↓</span></Link>
            </motion.div>
            <motion.div className="partner-hero-proof" variants={heroItemVariants} aria-label="Coach benefits">
              <span><i aria-hidden="true">✦</i> A richer offer</span>
              <span><i aria-hidden="true">✦</i> Your method, scalable</span>
              <span><i aria-hidden="true">✦</i> Every client, at a glance</span>
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
              initial={prefersReducedMotion ? false : { opacity: 0, y: 36, scale: 0.97, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <a href="/coach-platform/clients-and-sessions.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size client overview screenshot">
                <Image src="/coach-platform/clients-and-sessions.png" alt="SeeMe coaching prototype showing the coach&apos;s client roster, weekly calendar of sessions and exercises, and client records" width={1440} height={1100} sizes="(max-width: 767px) 100vw, 70vw" priority />
              </a>
              <figcaption>Clients &amp; sessions · local prototype with fictional data</figcaption>
            </motion.figure>

            <motion.div className="partner-hero-product partner-hero-product--left" style={{ x: leftSideExitX, opacity: sideExitOpacity }}>
              <motion.figure
                className="partner-platform-image partner-hero-product-inner"
                initial={prefersReducedMotion ? false : { opacity: 0, x: -130, y: 28, rotate: -7, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: -4, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="/coach-platform/session-builder.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size session studio screenshot">
                  <Image src="/coach-platform/session-builder.png" alt="SeeMe session studio creating a guided coaching session" width={1440} height={1100} sizes="(max-width: 767px) 42vw, 28vw" />
                </a>
                <figcaption>Build your method</figcaption>
              </motion.figure>
            </motion.div>

            <motion.div className="partner-hero-product partner-hero-product--right" style={{ x: rightSideExitX, opacity: sideExitOpacity }}>
              <motion.figure
                className="partner-platform-image partner-hero-product-inner"
                initial={prefersReducedMotion ? false : { opacity: 0, x: 130, y: 30, rotate: 7, scale: 0.94, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 4, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="/coach-platform/assignment.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size session assignment screenshot">
                  <Image src="/coach-platform/assignment.png" alt="SeeMe coach prototype assigning a guided exercise to a fictional client" width={1440} height={1050} sizes="(max-width: 767px) 42vw, 28vw" />
                </a>
                <figcaption>Support between sessions</figcaption>
              </motion.figure>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="partner-value-intro" aria-label="What SeeMe adds to your coaching">
        <div className="partner-value-grid">
          <article className="partner-value-card">
            <span>01</span>
            <h2>A richer offer</h2>
            <p>Bring useful coaching support into the days between meetings.</p>
          </article>
          <article className="partner-value-card">
            <span>02</span>
            <h2>Your method, reused</h2>
            <p>Build a guided session once, then assign it where it fits.</p>
          </article>
          <article className="partner-value-card">
            <span>03</span>
            <h2>One clearer view</h2>
            <p>Bring clients, planned sessions, and client updates into one view.</p>
          </article>
        </div>
      </section>

      <motion.section id="how-it-works" className="section partner-product-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionRevealVariants} aria-labelledby="session-builder-heading">
        <div className="inner partner-feature-row">
          <div className="partner-feature-copy">
            <div className="eyebrow">01 · Build</div>
            <h2 id="session-builder-heading">Turn your method into guided practice.</h2>
            <p>Start with a client goal. Shape the exercise, try the experience, and save it for the next time it fits.</p>
          </div>
          <figure className="partner-platform-image">
            <a href="/coach-platform/session-builder.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size session builder screenshot">
              <Image src="/coach-platform/session-builder.png" alt="SeeMe session studio with an editable coaching intention, session length, cover options and a client-facing preview" width={1440} height={1100} sizes="(max-width: 767px) 100vw, 54vw" />
            </a>
            <figcaption>Session studio · local prototype · sample session</figcaption>
          </figure>
        </div>
      </motion.section>

      <motion.section className="section partner-product-section partner-product-section--alt" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionRevealVariants} aria-labelledby="assignment-heading">
        <div className="inner partner-feature-row">
          <div className="partner-feature-copy">
            <div className="eyebrow">02 · Assign</div>
            <h2 id="assignment-heading">Give every client a next step.</h2>
            <p>Choose the guided session that fits and put it on their schedule, ready for the days between meetings.</p>
          </div>
          <figure className="partner-platform-image">
            <a href="/coach-platform/assignment.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size guided exercise assignment screenshot">
              <Image src="/coach-platform/assignment.png" alt="SeeMe coach prototype assigning the guided session Letting go. Leading better. to fictional client Alex Rivera" width={1440} height={1050} sizes="(max-width: 767px) 100vw, 54vw" />
            </a>
            <figcaption>Between-session exercise · fictional client · local demo only</figcaption>
          </figure>
        </div>
      </motion.section>

      <section className="partner-economics" aria-labelledby="partner-economics-heading">
        <div className="partner-economics-copy">
          <div className="eyebrow">A simple example</div>
          <h2 id="partner-economics-heading">A richer offer can add up.</h2>
          <p>If 10 clients chose a $25 monthly support add-on, that would be $250 in additional gross revenue.</p>
        </div>
        <div className="partner-economics-card" aria-label="Illustrative monthly revenue example">
          <div><strong>$250</strong><span>additional gross revenue</span></div>
          <div className="partner-economics-minus">− $99 <span>proposed SeeMe plan</span></div>
          <div className="partner-economics-result"><strong>$151</strong><span>before fees, coach time, other costs, and taxes</span></div>
          <p>Illustrative only: assumes all 10 clients opt in at $25/month. The plan price and client demand are unvalidated. Not a revenue guarantee or net profit.</p>
        </div>
      </section>

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
