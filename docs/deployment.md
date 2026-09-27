# Website production deployment

Verified through authenticated Cloudflare CLI and dashboard inspection on 2026-09-27.

- Provider: Cloudflare Pages, account `9f8465e30ee4bb2cae1954b8737c974d`.
- Existing project: `seemelandingpage`; production branch `main`.
- Domains: `https://seemeai.app` and `https://www.seemeai.app`.
- Git integration: `SankrityaT/SeeMeLandingPage`, automatic deployments enabled.
- Dashboard build: `npx @cloudflare/next-on-pages@1`; output `.vercel/output/static`.
- Runtime: compatibility date `2025-12-17`, `nodejs_compat`.
- Prior production rollback candidate: `360c4af5-b4f1-4c5c-9a8e-b492a162ceb3`, source `6afa569`.
- Vercel project is a separate deployment and does not own these custom domains.

## Assets

Current B2C images and coach screenshots are bundled from `public/` and served by Cloudflare Pages. Keep responsive image sources and full-size screenshot links together in each release. Existing legacy videos use the `seeme-vids` R2 bucket. No bucket upload or DNS change is needed for this image release.

## Release procedure

1. Verify account, project, current production deployment, branch, and source revision.
2. Run `suite.py check website` from the shared engineering suite.
3. Build an isolated copy of committed source with installed locked npm dependencies. Inject production variables from the existing Pages project into the build process; never print or commit their values. Downloaded provider configuration may contain plaintext secrets and must remain outside the repository with restricted file permissions.
4. Use `@cloudflare/next-on-pages@1.13.16`. Its legacy optional peer dependency resolution currently needs `npm_config_legacy_peer_deps=true`. In the isolated build only, use a Vercel build configuration with `installCommand: true`, `buildCommand: npm run build`, and `framework: nextjs` after dependencies are supplied. This avoids the old pnpm lockfile selecting an unavailable pnpm binary. It does not link or deploy to Vercel.
5. Scan public build output for server-only credential values without printing them.
6. Deploy `.vercel/output/static` to the existing Pages project on a named preview branch. Explicitly include `nodejs_compat` in the preview configuration as well as production; the initial preview lacked this flag and returned 503 until corrected. Check both landing pages, desktop/mobile images, form validation, navigation, and protected analytics routes.
7. Deploy the same artifact with explicit `--branch main` and source `--commit-hash`. Record the deployment ID and verify both custom domains. Do not change DNS, bindings, or provider variables incidentally.

The legacy adapter is deprecated upstream but retained for compatibility with this existing Pages project. A platform migration is separate work. Local build success does not verify a live signup write; avoid creating real pilot applications during smoke checks.

## Credential follow-up

An old R2 setup document contained credential values. Current documentation now uses placeholders. Historical Git copies are unchanged; the exposed credential should be rotated by its owner. No credentials were rotated during this website release.
