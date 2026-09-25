'use client';

import { CalendarCheck2, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
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
  const [coachType, setCoachType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      window.scrollTo(0, 70);
    }
  }, []);

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
            Back to home
          </SeemeButton>
        </div>
      </div>

      <section className="hero">
        <motion.div
          className="partner-hero-content"
          variants={heroContentVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="eyebrow" variants={heroItemVariants}>Your coaching, between sessions</motion.div>
          <motion.h1 variants={heroItemVariants}>
            Multiply your impact.
            <br />
            <em>Without multiplying your hours.</em>
          </motion.h1>
          <motion.p variants={heroItemVariants}>
            Keep your clients, their next steps, and your coaching exercises together. Build guided sessions around your approach and give the work room to continue between meetings.
          </motion.p>
          <motion.div className="cta-row" variants={heroItemVariants}>
            <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
          </motion.div>
        </motion.div>
      </section>

      <motion.section
        className="section alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
        aria-labelledby="client-overview-heading"
      >
        <div className="inner partner-feature-row">
          <div className="sh partner-feature-copy">
            <div className="eyebrow">01 / Client overview</div>
            <h2 id="client-overview-heading">See the whole picture.<br /><em>Know what comes next.</em></h2>
            <p>Bring your clients and planned sessions into one clear overview. Assign homework, preparation, and reflections so each client has a next step between meetings.</p>
            <ul className="partner-feature-points">
              <li>Keep track of clients and upcoming work.</li>
              <li>Assign guided sessions to the right person.</li>
              <li>Bring more focus to your next conversation.</li>
            </ul>
            <p className="partner-feature-benefit">Make room for deeper live sessions. Where it suits the client, space meetings out with guided work in between—potentially making room for more clients without crowding your calendar.</p>
          </div>
          <figure className="partner-product-placeholder" aria-label="Client overview image placeholder">
            <CalendarCheck2 size={32} strokeWidth={1.4} aria-hidden="true" />
            <figcaption><strong>Clients &amp; sessions</strong><span>Platform image coming soon</span></figcaption>
          </figure>
        </div>
      </motion.section>

      <motion.section
        className="section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
        aria-labelledby="session-builder-heading"
      >
        <div className="inner partner-feature-row partner-feature-row-reverse">
          <div className="sh partner-feature-copy">
            <div className="eyebrow">02 / Session builder</div>
            <h2 id="session-builder-heading">Your approach.<br /><em>Ready to put into practice.</em></h2>
            <p>Turn an exercise you use in coaching into a guided session. Shape it with AI, try the client experience yourself, and assign it when it fits.</p>
            <ul className="partner-feature-points">
              <li>Build around your prompts and methodology.</li>
              <li>Try and refine the session before assigning it.</li>
              <li>Reuse useful exercises across your practice.</li>
            </ul>
            <p className="partner-feature-benefit">Create once, adapt for the person. Offer more support between meetings without preparing every exercise from scratch.</p>
          </div>
          <figure className="partner-product-placeholder" aria-label="Session builder image placeholder">
            <SlidersHorizontal size={32} strokeWidth={1.4} aria-hidden="true" />
            <figcaption><strong>Session builder</strong><span>Platform image coming soon</span></figcaption>
          </figure>
        </div>
        <div className="inner">
          <p className="partner-client-bridge">Your coaching connects with a personal space for reflection and guided work. <Link href="/">Explore the client experience.</Link></p>
          <p className="partner-preview-note">Pilot direction. The connected client overview and client-approved sharing are still being developed.</p>
        </div>
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
        <p>Join our founding-coach pilot to explore the workspace, bring an exercise you already use, and help shape how it supports your clients. We&apos;ll follow up personally to discuss the fit.</p>

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
