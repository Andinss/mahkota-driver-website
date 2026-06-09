# Project Structure

```
├── app/
│   ├── page.tsx                         # Landing page (Server Component, reads JSON data)
│   ├── layout.tsx                       # Root layout (fonts, metadata)
│   ├── globals.css                      # Tailwind directives + custom layers
│   ├── admin/
│   │   ├── page.tsx                     # Admin login page
│   │   └── dashboard/page.tsx           # Admin dashboard (Client Component)
│   └── api/
│       ├── content/route.ts             # GET — public content endpoint
│       └── admin/
│           ├── login/route.ts           # POST — admin login
│           ├── logout/route.ts          # POST — admin logout
│           └── content/[category]/route.ts  # PUT — update content by category
├── components/
│   ├── sections/                        # Page section components
│   │   ├── Navbar.tsx                   # Client — sticky nav, scroll detection
│   │   ├── Hero.tsx                     # Server — hero/about section
│   │   ├── Services.tsx                 # Server — service cards + advantages
│   │   ├── Statistics.tsx               # Client — count-up animation
│   │   ├── Testimonials.tsx             # Client — Swiper carousel
│   │   ├── Registration.tsx             # Server — step-by-step signup
│   │   ├── Download.tsx                 # Server — app download section
│   │   └── Footer.tsx                   # Server — contact info
│   ├── ui/                              # Reusable UI primitives
│   │   ├── BackToTop.tsx                # Client — scroll-to-top button
│   │   ├── PlayStoreButton.tsx          # Play Store link (target="_blank")
│   │   ├── StarRating.tsx               # Visual star rating (1-5)
│   │   └── Avatar.tsx                   # Photo with initial fallback
│   └── admin/                           # Admin panel components
│       ├── LoginForm.tsx
│       ├── DashboardTabs.tsx
│       ├── StatisticsTab.tsx
│       ├── TestimonialsTab.tsx
│       ├── ServicesTab.tsx
│       ├── RegistrationTab.tsx
│       └── ContactTab.tsx
├── lib/
│   ├── content.ts                       # Read/write JSON data files
│   ├── auth.ts                          # iron-session config + helpers
│   ├── validation.ts                    # Zod schemas per content category
│   └── rate-limit.ts                    # Login rate limiter
├── types/
│   └── content.ts                       # TypeScript interfaces for all data
├── data/                                # PRIVATE — content JSON (not in public/)
│   ├── statistics.json
│   ├── testimonials.json
│   ├── services.json
│   ├── registration.json
│   └── contact.json
├── config/                              # PRIVATE — admin credentials
│   └── admin.json                       # { username, passwordHash }
├── public/images/                       # Static assets served by Next.js
├── middleware.ts                        # Auth redirect + rate limiting
├── next.config.ts                       # Security headers, image domains
├── tailwind.config.ts                   # Brand colors, fonts
└── .env.local                           # Secrets (never committed)
```

## Architecture Principles

- **Server Components by default** — Only use `'use client'` when browser APIs are needed (scroll events, IntersectionObserver, Swiper, CountUp)
- **Data flows server → props** — `app/page.tsx` reads JSON at request time, passes data as props to section components
- **No client-side fetching on landing page** — All content is in the initial HTML
- **Sensitive files outside `public/`** — `data/` and `config/` are never served as static assets
- **One JSON file per content category** — Enables granular admin updates without touching other data
- **Route Handlers as API layer** — No separate backend server needed

## Conventions

- Section components live in `components/sections/`
- Reusable UI primitives live in `components/ui/`
- Admin-specific components live in `components/admin/`
- All validation logic centralized in `lib/validation.ts`
- TypeScript interfaces centralized in `types/content.ts`
