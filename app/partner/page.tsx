'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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

      <section className="hero partner-simple-hero">
        <motion.div className="partner-hero-content" variants={heroContentVariants} initial="hidden" animate="visible">
          <motion.div className="eyebrow" variants={heroItemVariants}>Your coaching, between sessions</motion.div>
          <motion.h1 variants={heroItemVariants}>Multiply your impact.<br /><em>Without multiplying your hours.</em></motion.h1>
          <motion.p variants={heroItemVariants}>Your clients, your sessions, your approach. Give the work a place to continue between meetings.</motion.p>
          <motion.div className="cta-row" variants={heroItemVariants}><SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton></motion.div>
        </motion.div>
      </section>

      <motion.section className="section alt partner-product-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionRevealVariants} aria-labelledby="client-overview-heading">
        <div className="inner">
          <div className="sh partner-product-heading">
            <div className="eyebrow">Clients &amp; sessions</div>
            <h2 id="client-overview-heading">Your whole practice.<br /><em>One clear view.</em></h2>
            <p>See your clients and upcoming meetings. Assign homework and guided sessions so everyone knows what comes next.</p>
          </div>
          <figure className="partner-platform-image">
            <a href="/coach-platform/clients-and-sessions.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size client overview screenshot">
              <Image src="/coach-platform/clients-and-sessions.png" alt="SeeMe coaching prototype showing a client roster, weekly session calendar and client records" width={1440} height={1100} sizes="(max-width: 767px) 100vw, 1100px" />
            </a>
            <figcaption>Local coach prototype · Fictional clients · Open image to explore</figcaption>
          </figure>
          <p className="partner-product-takeaway">Better-prepared meetings. Support in between.<br />More flexibility in how you make time for your clients.</p>
        </div>
      </motion.section>

      <motion.section className="section partner-product-section" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionRevealVariants} aria-labelledby="session-builder-heading">
        <div className="inner">
          <div className="sh partner-product-heading">
            <div className="eyebrow">Session builder</div>
            <h2 id="session-builder-heading">Your expertise.<br /><em>Ready between sessions.</em></h2>
            <p>Turn your approach into guided exercises. Shape the questions, try the experience, and assign it when a client needs it.</p>
          </div>
          <figure className="partner-platform-image">
            <a href="/coach-platform/session-builder.png" target="_blank" rel="noopener noreferrer" aria-label="Open full-size session builder screenshot">
              <Image src="/coach-platform/session-builder.png" alt="SeeMe session builder with an editable coaching intention, duration, cover and client-facing session preview" width={1440} height={1100} sizes="(max-width: 767px) 100vw, 1100px" />
            </a>
            <figcaption>Local coach prototype · Session editor · Open image to explore</figcaption>
          </figure>
          <p className="partner-product-takeaway">Create once. Make it personal. Use it again.</p>
          <p className="partner-client-bridge"><Link href="/">See the client experience →</Link></p>
          <p className="partner-preview-note">The connected coaching experience and client-approved sharing are in development.</p>
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
