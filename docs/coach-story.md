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

Mobile uses native mobile captures through a picture source at 600px. Desktop assignment pairs the real session preview with its assignment dialog. Full-size desktop screenshots remain available through keyboard-accessible image links. No product UI was retouched or generated.

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


## Walkthrough cleanup — 2026-09-27

Removed the introductory bridge copy, numeric prefixes from all four section labels, and screenshot footers (including the hero caption). The Explore link now targets the first product section directly; full-size views remain available by activating each image. Static presentation and anchor placement only; no service architecture impact.

## Shared closing invitation — 2026-09-27

Both the client “Try for Free” section and the coach pilot application now use `components/landing/LandingActionPanel.tsx`. The shared component owns the section, heading, description and existing B2C background-card pattern. Matching CSS controls card width, typography, padding, background contrast and responsive corners. The partner-only button overrides and legacy oversized application section styles were removed so both pages use `SeemeButton` consistently.

Coach fields retain their current state and submission handler, with readable sentence-case labels, left alignment, 12px corners, explicit keyboard focus and autofill hints. Error and success messages now have alert/status roles. No Supabase request, payload, persistence, authentication or deployment boundary changed; no architecture diagram change is needed.

Verification: production build/TypeScript and scoped lint passed. Chromium and WebKit compared computed closing-card styles across both routes and checked 1440/390/320 layouts, pilot anchor navigation, empty-form validation and keyboard progression. Desktop/mobile images were visually reviewed. External requests were isolated; no valid application was submitted and backend behavior was not tested.

## Shared hero type scale — 2026-09-27

The coach headline and supporting line now use the active B2C hero's shared CSS size tokens. Desktop titles cap at 2.8rem (44.8px); mobile titles use the existing B2C 1.5rem–2.2rem scale. Weight, line height and tracking also match. Removed independent coach tablet/short-screen size overrides; gradient descender padding remains. This is CSS presentation only, with no architecture or application behavior change.

Production build passed. Chromium and WebKit compared computed title size, weight, line height, tracking and subtitle size on both routes at 1440, 1280, 850, 768, 390 and 320px, including a 720px-tall desktop viewport. All matched with no horizontal overflow; desktop/mobile hero images were visually reviewed.

## Approved main-title scale — 2026-09-27

Supersedes the earlier hero-only size choice. User selected the credibility title as the reference for all main titles. Both sites now use one heading rule: `clamp(2.125rem, 4vw, 3.25rem)` (34–52px), weight 700, line height 1.16 and tracking -0.045em. It covers hero content titles, section titles and closing-card titles; small labels, card titles and the initial SeeMe wordmark retain their own roles. Removed competing per-section/mobile title sizes. Presentation only; no architecture impact.

Build passed. Chromium and WebKit compared every affected main heading at 1440/768/390/320px on both routes; computed typography matched with no horizontal overflow. Reviewed hero and closing-card layouts on desktop/mobile, including the consumer hero after its entrance sequence.

## Hero side-capture alignment — 2026-09-27

Dedicated `clone-hero.png` and `studio-hero.png` captures now include the original “Your digital clone” and “Session studio” screen headings. Both are unretouched 1190×1100 main-canvas crops from the same local demo revision, recorded in provenance. Existing walkthrough crops remain separate. Both hero side panels use the same 22% top position and image ratio, giving equal heights on desktop and mobile. Delayed the start of their existing scroll-exit range to keep the titled panels in view on arrival.

Build and Chromium/WebKit checks passed: images load, both panels have equal top positions and heights at 1440/850/390/320px, and the panels still fade out when navigating past the hero. Visual captures reviewed. Static asset/layout change only; no service architecture impact.

## Mobile performance and layout — 2026-09-27

Mobile uses one centered workspace preview with a full-height cover background, balanced headline, smaller top gap and no floating side cards. Desktop keeps its three-screen composition and scroll exit. Product sections and client bridge render visibly without blur/reveal observers. Touch devices and reduced-motion users use native scrolling; desktop Lenis cleanup cancels the current animation frame correctly. Supabase loads only when a valid pilot application is submitted.

Static WebP derivatives bypass the existing Pages image endpoint, which was returning original PNG bytes. The mobile hero uses a 900px derivative; side-card sources use an inline placeholder below 768px so hidden cards do not download. All original captures and full-size links remain available. Coach portraits now total about 10 KB compared with roughly 2 MB in source PNGs. The optimized background is approximately 27 KB instead of 243 KB. Derivatives are reproducible with `node scripts/prepare-coach-images.mjs` using the installed Next.js sharp dependency; hashes and dimensions are in `public/coach-platform/optimized-images.json`.

Verification: build and scoped ESLint; isolated suite Chromium and WebKit tests at 320, 390, 600, 767, 850 and 1440px, including loaded images, no mobile side-image requests, immediately visible sections, navigation, empty-form validation, native scrolling and reduced motion. Shared smooth-scroll changes also exercised privacy-to-client-home navigation. `tests/coach-mobile.mjs` registers with the shared suite fixture. No live application was submitted. No API, data model, ownership or architecture boundary changed.

Cloudflare preview measurement at 390×844, DPR 2, fresh Chromium context and no scrolling: initial image response bodies dropped from 12,962,996 bytes on the prior live page to 182,252 bytes (98.6% reduction). This is a measured image-payload comparison, not a field Core Web Vitals score. The closing-panel source alone was 8,622,203 bytes; the coach derivative is 37,944 bytes. Preview: `48bbba06.seemelandingpage.pages.dev`.

## Immediate screenshot previews — 2026-09-27

Follow-up to the mobile release: full section screenshots now start loading eagerly at low network priority instead of waiting for lazy-load proximity. Each screenshot has a responsive inline WebP preview, embedded in server-rendered markup, with its dimensions reserved. The preview remains visible until the full image paints, even when the image request is deliberately delayed. All eight inline previews total about 5.5 KB of generated TypeScript before compression; no additional preview requests. Hero keeps high fetch priority.

Verified with eight isolated Chromium/WebKit tests, including a new regression that holds all four mobile screenshot requests, checks a populated preview and reserved height before any full image loads, jumps to the final section, then releases requests and confirms full images decode. Scoped ESLint and production build passed. No API or architecture boundary changes.

## Mobile document painting follow-up — 2026-09-27

Inspected computed styles in Chromium and WebKit after a continued report of whole sections appearing black. Both engines showed `overflow: hidden auto` on the body and full-height coach wrapper, plus inherited `blur(100px)` pseudo-elements on all four product sections. On mobile/touch, the coach page now uses the document scroll surface, horizontal `clip` without a nested vertical scroller, visible section overflow, no unused section glow or label backdrop blur, and a matching document background. Desktop hero scroll tracking is now subscribed only for non-touch desktop users without reduced motion, with cleanup when the media query changes.

Production build/TypeScript, scoped lint and ten Chromium/WebKit checks passed. New coverage checks the document scroll surface, absent blur layers, unchanged hero styles across mobile scroll jumps, and captures each section immediately after jumping. Reviewed the WebKit clone-section capture; text and image are painted. Existing delayed-image checks also pass. These browser checks do not reproduce a physical phone's momentum scrolling, so the exact device-specific symptom remains unconfirmed pending device/browser details. No service or architecture boundary changed.
