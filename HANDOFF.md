# Portfolio Handoff — Anar-Erdene Gantulga

> Last updated: 2026-05-12
> Built by Claude Sonnet 4.6 following `C:\Users\ganar\Downloads\PORTFOLIO_SPEC.md`
> Build status: ✅ Clean — 8 pages, zero errors

---

## 1. What This Is

A fully built personal portfolio at `C:\Users\ganar\dev\portfolio`.
Next.js 16 App Router, Tailwind v4, MDX case studies, no database.

**Live sections:** Hero → Work → About → Skills → Process → Contact → Footer
**Case study routes:** `/work/ctf-mn` · `/work/uudam-network` · `/work/apple-flow` · `/work/mesa-visual`

---

## 2. How to Run

```bash
# Dev server — MUST use subshell syntax (reason explained in §7)
(cd C:/Users/ganar/dev/portfolio && node_modules/.bin/next dev --port 3001)

# Production build
(cd C:/Users/ganar/dev/portfolio && node_modules/.bin/next build)

# Type check only
npx --prefix C:/Users/ganar/dev/portfolio tsc --project C:/Users/ganar/dev/portfolio/tsconfig.json --noEmit
```

---

## 3. Every File Built

### Config
| File | Purpose |
|---|---|
| `next.config.ts` | MDX via `@next/mdx`, `turbopack.root` set to fix workspace detection bug |
| `mdx-components.tsx` | Required by Next.js App Router for MDX to work |
| `app/globals.css` | Tailwind v4 `@theme` tokens — all colors, fonts, radii, easing, durations |
| `app/layout.tsx` | Space Grotesk + Syne Mono + Inter from `next/font/google`, SEO metadata, skip-to-main |

### HUD atoms (`components/hud/`)
| File | Purpose |
|---|---|
| `section-label.tsx` | Renders `LABEL // DESCRIPTION` in Syne Mono, lime 45% opacity |
| `bracket-corners.tsx` | SVG bracket corners — used on featured card and hero viewport |
| `reticle.tsx` | Hero right-column target reticle SVG |
| `scan-line.tsx` | Client component — 1px lime line sweeps top→bottom once on page load (600ms) |

### Components
| File | Client? | Purpose |
|---|---|---|
| `components/fade-up.tsx` | ✅ | IntersectionObserver scroll reveal — `translateY(32px)→0`, 0.15 threshold, 500ms, supports stagger delay |
| `components/nav.tsx` | ✅ | Glass pill nav — hides on scroll down >80px, shows on scroll up; mobile hamburger overlay |
| `components/hero.tsx` | ✅ | Scan-line entrance, typewriter HUD label (30ms/char), dynamic date, reticle, CTAs |
| `components/project-card.tsx` | ✅ | Card with hover lift (-4px), thumbnail scale(1.05), lime glow, FEATURED/CONCEPT badges |
| `components/work-grid.tsx` | — | 63%/35% featured+stack grid, dashed side project card |
| `components/about.tsx` | ✅ | 2-col photo+bio, stats row, CV download link |
| `components/skills.tsx` | — | 3 category rows with accent/standard/learning chip styles |
| `components/process.tsx` | — | 4-step cards, lime arrow connectors, loop arc SVG |
| `components/contact.tsx` | ✅ | Pulse availability dot, email CTA, GitHub link |
| `components/footer.tsx` | — | 3-col Syne Mono footer |

### App routes
| File | Purpose |
|---|---|
| `app/page.tsx` | Assembles all sections with `scan-decorator` dividers |
| `app/work/[slug]/page.tsx` | Dynamic case study — hero image, meta strip, MDX body, image gallery, next-project link |

### Data & utilities
| File | Purpose |
|---|---|
| `lib/projects.ts` | Typed project array + `getProjectBySlug` + `getNextProject` helpers |
| `lib/mdx.ts` | Re-exports slug helpers; thin wrapper |

### Case study content (`content/work/`)
| File | Content |
|---|---|
| `ctf-mn.mdx` | CTF.mn rebrand — problem, 3-phase process, outcome, reflection |
| `uudam-network.mdx` | Uudam Network landing — problem, 3-phase process, outcome, reflection |
| `apple-flow.mdx` | Apple Flow concept — problem, 3-phase process, outcome, reflection |
| `mesa-visual.mdx` | MESA visual design — problem, 3-phase process, outcome, reflection |

---

## 4. Images — What's In Place vs What's Missing

### ✅ In place

| Path | Source |
|---|---|
| `/public/thumbnails/ctf-mn.png` | `ctfmn-land.png` |
| `/public/thumbnails/apple-flow.png` | `appleflow-thumbnail.png` |
| `/public/thumbnails/mesa-visual.png` | `nomadic_masters.png` |
| `/public/hero-images/ctf-mn.png` | `ctfmn-land.png` |
| `/public/hero-images/apple-flow.png` | `appleflow-1.png` (dashboard view) |
| `/public/hero-images/mesa-visual.png` | `nomadic_masters.png` |
| `/public/work/ctf-mn/landing.png` | CTF.mn landing screenshot |
| `/public/work/apple-flow/landing.png` | Apple Flow landing page |
| `/public/work/apple-flow/dashboard.png` | Apple Flow dashboard/admin |
| `/public/work/mesa-visual/landing.png` | Nomadic Masters landing concept |
| `/public/work/mesa-visual/sticker-default.png` | NM25 default sticker |
| `/public/work/mesa-visual/sticker-holo.png` | NM25 holo sticker |
| `/public/work/mesa-visual/sticker-golden.png` | NM25 golden sticker |
| `/public/work/mesa-visual/sticker-silver.png` | NM25 silver sticker |
| `/public/work/mesa-visual/sticker-bronze.png` | NM25 bronze sticker |

### ❌ Missing (must add before launch)

| File | Notes |
|---|---|
| `/public/thumbnails/uudam-network.png` | No image provided — add a screenshot of the Uudam Network design |
| `/public/hero-images/uudam-network.png` | Same — the case study page skips the hero if this is absent |
| `/public/photo.jpg` | Anar-Erdene's photo for the About section |
| `/public/resume.pdf` | Linked from nav "Resume" button and About section "Download CV" |
| `/public/og-image.png` | 1200×630px — social sharing preview image |

---

## 5. Things That Still Need Doing

### High priority (affects live site)
- [ ] Add the 3 missing images above (`uudam-network` thumbnail/hero, `photo.jpg`)
- [ ] Add `resume.pdf`
- [ ] Add `og-image.png`
- [ ] Replace the `[N]` placeholder in `components/about.tsx` (currently hardcoded `4+`) with real project count

### Nice to have
- [ ] **CTF.mn outcome metric** — add a real engagement number (signups, participants, etc.) to replace "Live at ctf.mn" in the OUTCOME cell of the case study meta strip. Edit `getOutcome()` in `app/work/[slug]/page.tsx`
- [ ] **Uudam Network case study gallery** — once you have a screenshot, add it to the `galleries` object in `app/work/[slug]/page.tsx`
- [ ] **Photo for About section** — once `/public/photo.jpg` is added, the grayscale+contrast filter is already applied in code
- [ ] **Domain** — update `metadataBase` in `app/layout.tsx` from `anar-erdene.vercel.app` to real domain when finalized
- [ ] **Vercel deploy** — run `vercel` and `vercel --prod` from the portfolio directory

### Optional future work
- [ ] Add more Apple Flow screenshots to the gallery (more UI screens from the concept)
- [ ] Add the remaining MESA sticker circle variants to the gallery (dark silver, holo circle are copied but not in the gallery array yet)
- [ ] Add CTF.mn additional screenshots if more become available

---

## 6. Design Token Quick Reference

```
Colors:   --color-void #050505 · --color-lime #A3FF47 · --color-chrome #C8C8C8 · --color-platinum #9A9A9A
Fonts:    font-display = Space Grotesk 300 · font-mono = Syne Mono · font-body = Inter 300-400
Spacing:  8px grid · section padding = 120px · hero padding = 160px
Radii:    sm=4 md=8 lg=12 xl=20 full=9999
```

---

## 7. Known Quirks & Gotchas

### Workspace root detection bug
Next.js Turbopack detects multiple `package-lock.json` files and picks the wrong root (Apple-Flow instead of portfolio). Fixed by:
```ts
// next.config.ts
turbopack: {
  root: 'C:/Users/ganar/dev/portfolio',
}
```
All `next` commands must be run from inside the portfolio directory using a subshell `(cd ... && ...)`. Running `npx --prefix` without a subshell causes Turbopack to pick up the wrong root.

### `@mdx-js/loader` is a separate install
It's a peer dependency of `@next/mdx` but not auto-installed. It's already in `node_modules` (installed during this session). If you ever `npm ci` from scratch, you may need `npm install @mdx-js/loader` again.

### `'use client'` requirements
Components with mouse event handlers (`onMouseEnter/Leave`) or browser APIs must be client components. Currently:
- `hero.tsx`, `nav.tsx`, `scan-line.tsx`, `fade-up.tsx`, `project-card.tsx`, `about.tsx`, `contact.tsx` are all `'use client'`
- Server components: `work-grid.tsx`, `skills.tsx`, `process.tsx`, `footer.tsx`, all HUD atoms

### No `onError` on `Image` in server components
Next.js throws if you pass event handlers to `Image` in a server component. The `project-card.tsx` (client) has `onError` removed; about.tsx and the case study page do not use it.

---

## 8. Architecture at a Glance

```
portfolio/
├── app/
│   ├── globals.css          ← Tailwind v4 @theme tokens + custom CSS
│   ├── layout.tsx           ← fonts, metadata, skip-to-main
│   ├── page.tsx             ← assembles all 7 sections
│   └── work/[slug]/page.tsx ← dynamic case study (hero, meta strip, MDX, gallery, next-project)
├── components/
│   ├── hud/                 ← section-label, bracket-corners, reticle, scan-line
│   ├── fade-up.tsx          ← shared scroll reveal wrapper
│   ├── nav.tsx              ← glass pill + scroll hide/show + mobile menu
│   ├── hero.tsx             ← full hero section with all animations
│   ├── project-card.tsx     ← card with hover states
│   ├── work-grid.tsx        ← featured 63% + supporting 35% + side dashed
│   ├── about.tsx / skills.tsx / process.tsx / contact.tsx / footer.tsx
├── content/work/*.mdx       ← 4 case study bodies
├── lib/
│   ├── projects.ts          ← typed project data + slug helpers
│   └── mdx.ts              ← thin re-export
├── public/
│   ├── thumbnails/          ← project card images (ctf-mn, apple-flow, mesa-visual done)
│   ├── hero-images/         ← case study hero images (ctf-mn, apple-flow, mesa-visual done)
│   └── work/                ← case study gallery images
├── mdx-components.tsx       ← required by Next.js App Router for MDX
└── next.config.ts           ← MDX + turbopack root fix
```

---

## 9. Spec Compliance Status

| Spec Section | Status | Notes |
|---|---|---|
| Color palette | ✅ | All tokens in globals.css @theme |
| Typography (Space Grotesk / Syne Mono / Inter) | ✅ | next/font/google, correct weights |
| Spacing 8px grid | ✅ | Tokens defined, used throughout |
| Glass materials | ✅ | L1, L2, accent glass as CSS classes |
| Motion — scan-line reveal | ✅ | Fires once on mount, 600ms |
| Motion — typewriter HUD | ✅ | 30ms/char, hero only |
| Motion — fade-up on scroll | ✅ | IntersectionObserver 0.15 threshold |
| Motion — glass card lift | ✅ | translateY(-4px), thumbnail scale |
| Motion — nav hide/show scroll | ✅ | 300ms ease-out |
| HUD grammar (bracket corners, reticle, section labels, metadata) | ✅ | |
| Nav — glass pill, 4 links, Resume CTA, mobile hamburger | ✅ | |
| Hero — all copy verbatim, CTAs, scroll hint | ✅ | |
| Work grid — 63/35 layout, dashed side card | ✅ | |
| Status badges (CONCEPT) | ✅ | |
| About — 2-col, bio verbatim, stats, CV download | ✅ | Photo pending |
| Skills — 3 categories, accent/standard/learning chips | ✅ | |
| Process — 4 steps, arrow connectors, loop arc | ✅ | |
| Contact — pulse dot, email CTA, GitHub only | ✅ | |
| Footer — 3-col Syne Mono | ✅ | |
| Case study pages — header, hero image, meta strip, MDX, gallery, next-project | ✅ | |
| SEO metadata + metadataBase | ✅ | |
| Skip-to-main a11y link | ✅ | |
| Focus styles (lime outline) | ✅ | |
| prefers-reduced-motion guards | ✅ | pulse, fade-up |
| Responsive — mobile breakpoints | ✅ | All sections stack on ≤768px |
| Dark-only (no light mode toggle) | ✅ | No media query toggle |
