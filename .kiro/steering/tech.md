# Tech Stack

## Core Framework

- **Next.js 14+** (App Router) — Full-stack React framework
- **TypeScript** — Strict typing throughout
- **Tailwind CSS v3** — Utility-first styling, purged at build time

## Key Libraries

| Library | Purpose |
|---------|---------|
| `iron-session` | Encrypted stateless sessions (admin auth) |
| `bcryptjs` | Password hashing (cost factor ≥ 10) |
| `zod` | Runtime validation and input sanitization |
| `swiper` | Mobile carousel for testimonials |
| `countup.js` | Animated number counting for statistics |

## Dev Dependencies

| Library | Purpose |
|---------|---------|
| `vitest` | Unit and property-based testing |
| `@testing-library/react` | Component testing |
| `fast-check` | Property-based testing |
| `@playwright/test` | End-to-end testing |
| `@types/bcryptjs` | Type definitions |

## Fonts

- **Playfair Display** — Headings (`font-heading`)
- **Poppins** — Body text (`font-body`)
- Loaded via `next/font/google` (self-hosted, no CDN at runtime)

## Deployment

- Target: VPS with `next start` (or `pm2 start npm -- start`)
- No external database — content stored in JSON files on disk

## Common Commands

```bash
# Development
npm run dev          # Start dev server

# Build & Production
npm run build        # Production build (checks TypeScript)
npm start            # Start production server

# Testing
npm run test         # Run Vitest (unit + property-based tests)
npm run test:e2e     # Run Playwright E2E tests

# Linting
npm run lint         # Next.js ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SESSION_SECRET` | Min 32 chars, used by iron-session |
| `NODE_ENV` | `development` or `production` |

Template in `.env.example`. Actual values in `.env.local` (never committed).
