# Coach landing page product story

Updated 2026-09-27. Route: `/partner`.

The product walkthrough follows the coach's workflow: client overview → digital clone → session creation → assignment. Each section has one benefit, a brief explanation and a real demo capture. The hero retains its approved headline and centered pilot CTA, with fresh workspace, clone and studio imagery. The former benefit cards and illustrative revenue calculation have been replaced by the walkthrough.

## Image sources

`public/coach-platform/provenance.json` records the source revision, dimensions and hashes. All product images come from the local coaching prototype with fictional data. Desktop captures use a 1440×1100 viewport; mobile captures use 390px width (1000px or 1600px height), both at 2× resolution. These are demo previews, not release evidence.

Capture states and selectors:

- Workspace: initial Clients & sessions / all clients / week; full viewport for the hero and `.clients-overview` for the walkthrough.
- Clone: Your approach / saved overview; `.twin-composition` on desktop and `.twin-identity` on mobile.
- Studio: edit “Letting go. Leading better.” / Intention; `.session-workshop` on desktop and `.studio-live-card` on mobile.
- Assignment: select Alex Rivera / Schedule a session / Between-session exercise / “Letting go. Leading better.”; the complete dialog on both sizes. No assignment is submitted.

Mobile uses native mobile captures through a picture source at 600px. Desktop assignment pairs the real session preview with its assignment dialog. Full-size desktop screenshots remain available through keyboard-accessible image and caption links. No product UI was retouched or generated.

## Architecture review

This changes marketing copy, static images, responsive presentation and screenshot navigation only. The existing application form, Supabase write, authentication, data ownership and deployment boundaries are unchanged. No architecture diagram change is needed. Product state continues to live entirely in the separate demo; the website does not embed it or access client data.

## Verification

- Website production build, TypeScript and diff checks passed; scoped ESLint passed.
- Chromium and WebKit checked the four-section order and loaded responsive captures at 1440, 768, 390 and 320 CSS pixels, with no horizontal page overflow.
- Explore and pilot anchors reached their destinations; keyboard activation opened a full-size screenshot; hero side panels faded after scrolling; reduced-motion content stayed unblurred. No page or console errors in the final run.
- External browser requests were fulfilled with empty responses to isolate public navigation from analytics. No application was submitted and no backend behavior was claimed as tested.
- Desktop and mobile section screenshots were visually reviewed. Existing Next middleware and browser mapping build warnings remain.

## Credibility and framing update — 2026-09-27

Added a “New coach pilot · 2026” section after the hero. The year describes the pilot, not the company founding date. Coach names, roles, portraits and profile links are reused unchanged from the client landing page through `lib/coach-partners.ts`; the section identifies their connection to that client experience without claiming pilot participation. Numerical community size and coach-waitlist wording await clarification, so current copy uses a general existing-community statement.

Screenshot canvases now include internal padding on desktop/mobile. Assignment dialogs retain their existing internal spacing. Removed both hero side-image labels. No source screenshot pixels, application form behavior, network contracts or architecture boundaries changed.

Verification: website build/TypeScript, scoped ESLint, Chromium and WebKit at 1440/768/390/320 widths passed. Reviewed desktop/mobile section images; all three portraits loaded, profile links are keyboard-focusable, screenshot inset is present, hero labels are absent and there is no horizontal overflow. Browser external requests were isolated with empty responses.
