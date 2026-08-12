# Warhounds Guide

Independent, evidence-led guides for the 2026 turn-based tactical strategy game Warhounds.

## Site Builder provenance

- Generator: Hot Game Site Factory — Site Builder v0.1
- Run mode: `AUTONOMOUS_PREVIEW`
- Run ID: `warhounds-preview-20260812-r2`
- Template: Game Guide Template materialized from immutable source commit `80580d50bed7fe7f361b939451e48237b87b2b90`
- Target production domain: `warhoundsguide.online`
- Production deployment and domain binding: not authorized by this run
- GA, AdSense, and Adsterra: disabled

The public site source includes page-level evidence packs, plans, and SEO briefs under `research/`.

## Local checks

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```
