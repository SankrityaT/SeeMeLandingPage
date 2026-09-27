import type { ReactNode } from 'react';

type LandingActionPanelProps = {
  id: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
};

/** Shared closing invitation for the client and coach landing pages. */
export default function LandingActionPanel({ id, title, description, children }: LandingActionPanelProps) {
  return (
    <section id={id} className="new-landing-section new-landing-try-free landing-action-section" aria-labelledby={`${id}-heading`}>
      <div className="new-landing-try-free-content landing-action-panel">
        <h2 id={`${id}-heading`} className="new-landing-section-heading new-landing-try-free-heading">{title}</h2>
        <p className="new-landing-section-subtext new-landing-try-free-subtext">{description}</p>
        {children}
      </div>
    </section>
  );
}
