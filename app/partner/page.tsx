'use client';

import { CalendarCheck2, SlidersHorizontal } from 'lucide-react';
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
  const [preview, setPreview] = useState<'clients' | 'builder'>('clients');
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

      <section className="hero partner-product-hero">
        <motion.div className="partner-hero-content" variants={heroContentVariants} initial="hidden" animate="visible">
          <motion.div className="eyebrow" variants={heroItemVariants}>The SeeMe coach workspace</motion.div>
          <motion.h1 variants={heroItemVariants}>Your clients. Your sessions.<br /><em>Your way of coaching.</em></motion.h1>
          <motion.p variants={heroItemVariants}>See who needs what. Turn your expertise into guided sessions. Give clients a next step—and make more of the time you spend together.</motion.p>
          <motion.div className="cta-row" variants={heroItemVariants}>
            <SeemeButton href="#apply" variant="filled" size="lg">Apply to pilot</SeemeButton>
            <a href="#coach-workspace" className="partner-explore-link">Explore the workspace ↓</a>
          </motion.div>
        </motion.div>

        <div className="partner-workspace-showcase" id="coach-workspace">
          <div className="partner-preview-switch" role="group" aria-label="Choose a workspace preview">
            <button type="button" aria-pressed={preview === 'clients'} onClick={() => setPreview('clients')} aria-controls="workspace-preview"><CalendarCheck2 size={17} aria-hidden="true" />Clients &amp; sessions</button>
            <button type="button" aria-pressed={preview === 'builder'} onClick={() => setPreview('builder')} aria-controls="workspace-preview"><SlidersHorizontal size={17} aria-hidden="true" />Session builder</button>
          </div>
          <div className="partner-preview-frame" id="workspace-preview" role="region" aria-label={preview === 'clients' ? 'Illustrative client overview' : 'Illustrative session builder'}>
            <div className="partner-preview-toolbar"><span className="partner-preview-wordmark">SeeMe<span>.</span></span><span>Coach workspace</span><span className="partner-preview-label">Illustrative preview</span></div>
            {preview === 'clients' ? (
              <div className="partner-product-placeholder partner-client-illustration" aria-label="Client overview image placeholder">
                <div className="partner-preview-sidebar"><span className="active">Clients &amp; sessions</span><span>Session library</span><span>Your approach</span></div>
                <div className="partner-preview-main">
                  <div className="partner-preview-heading"><div><small>YOUR PRACTICE</small><h2>A clear view of the week.</h2></div><span className="partner-preview-date">Mon, 28 Sep</span></div>
                  <div className="partner-preview-client-strip"><span className="selected">AM <b>Alex Morgan</b></span><span>JL <b>Jamie Lee</b></span><span>SR <b>Sam Rivera</b></span></div>
                  <div className="partner-preview-columns">
                    <div><h3>Planned with Alex</h3><div className="partner-preview-event"><span>MON <b>28</b></span><div><strong>Leadership coaching</strong><small>10:00 · Live session</small></div></div><div className="partner-preview-event"><span>WED <b>30</b></span><div><strong>Practice a difficult conversation</strong><small>Guided homework · Assigned</small></div></div><div className="partner-preview-event"><span>FRI <b>02</b></span><div><strong>Reflect on what changed</strong><small>Between-session reflection</small></div></div></div>
                    <div className="partner-preview-context"><small>CLIENT FOCUS</small><h3>Lead with more confidence.</h3><p>Make space for a direct conversation with the team.</p><hr /><small>THE NEXT STEP</small><strong>A guided exercise before you meet again.</strong><span className="partner-preview-action">Choose from your session library ↗</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="partner-product-placeholder partner-builder-illustration" aria-label="Session builder image placeholder">
                <div className="partner-preview-sidebar"><span>Clients &amp; sessions</span><span className="active">Session library</span><span>Your approach</span></div>
                <div className="partner-preview-main">
                  <div className="partner-preview-heading"><div><small>SESSION STUDIO</small><h2>Practice a difficult conversation.</h2></div><span className="partner-preview-date">Draft session</span></div>
                  <div className="partner-preview-columns">
                    <div className="partner-preview-editor"><small>THE OUTCOME</small><p>Help a client name what matters, explore the other perspective, and choose how to begin.</p><h3>Your session structure</h3><ol><li><span>01</span> Set the scene</li><li><span>02</span> Explore what feels difficult</li><li><span>03</span> Rehearse the opening</li></ol><span className="partner-preview-action">Refine with AI · Keep your approach</span></div>
                    <div className="partner-preview-context"><small>TRY THE CLIENT EXPERIENCE</small><h3>How would you like this conversation to go?</h3><p className="partner-preview-bubble">I want to be direct without making the other person defensive.</p><p>What is the one thing you most want them to understand?</p></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="partner-preview-caption">Illustrative layout with fictional content. Actual platform images will replace this preview.</p>
          <div className="partner-showcase-caption" aria-live="polite"><strong>{preview === 'clients' ? 'The overview. The person. The next step.' : 'Build it. Try it. Make it yours.'}</strong><span>{preview === 'clients' ? 'Bring client context, planned meetings, and guided homework into one view.' : 'Turn an exercise you already use into a session clients can work through between meetings.'}</span></div>
        </div>
      </section>

      <motion.section
        className="section alt"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionRevealVariants}
        aria-labelledby="client-overview-heading"
      >
        <div className="inner partner-feature-row partner-detail-row">
          <div className="sh partner-feature-copy">
            <div className="eyebrow">01 / Client overview</div>
            <h2 id="client-overview-heading">See the whole picture.<br /><em>Know what comes next.</em></h2>
            <p>Bring your clients and planned sessions into one clear overview. Assign homework, preparation, and reflections so each client has a next step between meetings.</p>
            <p className="partner-feature-benefit">Make room for deeper live sessions. Where it suits the client, space meetings out with guided work in between—potentially making room for more clients without crowding your calendar.</p>
          </div>
          <div className="partner-workflow-details">
            <article><span>01</span><div><h3>Open your client overview</h3><p>See the people you work with alongside their planned sessions. Keep the next meeting and the work around it connected.</p></div></article>
            <article><span>02</span><div><h3>Give the week a clear next step</h3><p>Choose a preparation exercise, reflection, or homework session from your library and assign it to a client.</p></div></article>
            <article><span>03</span><div><h3>Choose the right rhythm</h3><p>Use guided work to prepare for a deeper live conversation, reinforce a session afterward, or support a longer gap between meetings.</p></div></article>
          </div>
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
        <div className="inner partner-feature-row partner-detail-row">
          <div className="sh partner-feature-copy">
            <div className="eyebrow">02 / Session builder</div>
            <h2 id="session-builder-heading">Your approach.<br /><em>Ready to put into practice.</em></h2>
            <p>Turn an exercise you use in coaching into a guided session. Shape it with AI, try the client experience yourself, and assign it when it fits.</p>
            <p className="partner-feature-benefit">Create once, adapt for the person. Offer more support between meetings without preparing every exercise from scratch.</p>
          </div>
          <div className="partner-workflow-details">
            <article><span>01</span><div><h3>Start with your expertise</h3><p>Define the outcome, prompts, and structure. Bring the exercises, language, and approach you already use with clients.</p></div></article>
            <article><span>02</span><div><h3>Shape it with AI. Test it yourself.</h3><p>Refine your session with AI, then try the conversation as a client. Adjust the wording and flow before you assign it.</p></div></article>
            <article><span>03</span><div><h3>Build a library you can return to</h3><p>Reuse a useful session with another client, or adapt it for a different goal. Your preparation becomes part of your practice.</p></div></article>
          </div>
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
