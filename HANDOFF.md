# Portfolio Handoff — Anar-Erdene Gantulga

> Last updated: 2026-05-12
> Session 2 by Claude Sonnet 4.6 — Design direction correction
> Build status: ✅ Clean — TypeScript zero errors, zero console errors

---

## 1. What This Is

A personal portfolio at `C:\Users\ganar\dev\portfolio`.
Next.js 16 App Router, Tailwind v4, MDX case studies, no database.

**Live sections:** Loader → Hero → Work → About → Skills → Interface (Shader) → Process → Contact → Footer
**Case study routes:** `/work/ctf-mn` · `/work/uudam-network` · `/work/apple-flow` · `/work/mesa-visual`

---

## 2. How to Run

```bash
# Dev server — MUST use subshell syntax (Turbopack workspace bug, see §8)
(cd C:/Users/ganar/dev/portfolio && node_modules/.bin/next dev --port 3001)

# Type check
npx --prefix C:/Users/ganar/dev/portfolio tsc --project C:/Users/ganar/dev/portfolio/tsconfig.json --noEmit
```

---

## 3. Session 2 Changes (2026-05-12)

### What was done
This session was a **design direction correction** — moving from generic/template toward cinematic, futuristic, sci-fi UI.

#### New files
| File | Purpose |
|---|---|
| `components/loader.tsx` | Canvas 2D particle globe — 720 Fibonacci sphere particles, 2 tilted orbit rings, atmospheric lime bloom, "INITIALIZING 000/100" counter. Runs ~3.6s then fades. |
| `components/app-shell.tsx` | Client component that coordinates Loader → Hero state handoff. Keeps `page.tsx` a server component. |
| `components/shader-section.tsx` | WebGL `#interface` section — domain-warped FBM fluid shader, mouse warps field, click creates ripple. IntersectionObserver pauses render loop when off-screen. |

#### Modified files
| File | What changed |
|---|---|
| `components/hero.tsx` | **Complete rebuild.** Removed 2-column layout + reticle. New: full-viewport, left-aligned, name ("ANAR-ERDENE" / "GANTULGA") as huge display element (~108px). 10-phase stagger animation fires when `ready` prop becomes true. Atmospheric fog (3 radial gradient layers) + film grain overlay. Kept bracket corners. |
| `components/project-card.tsx` | Removed ALL glow: no `box-shadow`, no lime shadows on featured/hover. `borderRadius` 12px → 4px. Border brightens on hover (no neon). Thumbnail `brightness(0.82)` → `brightness(0.88)` on hover. |
| `app/globals.css` | Removed `box-shadow` from `.glass-accent`. Added `@keyframes grain-shift` (used by loader + hero film grain overlays). |
| `app/page.tsx` | Replaced `<Hero />` + `<Nav />` with `<AppShell />` (which contains Loader + Hero). Added `<ShaderSection />` between Skills and Process. |

#### What was NOT changed
- Nav, About, Skills, Process, Contact, Footer — untouched
- Case study pages — untouched
- All project data in `lib/projects.ts` — untouched
- MDX case study content — untouched

---

## 4. What's Still Needed (User Requests Pending)

The user interrupted the session with new requests. Here's what they want next:

### HIGH PRIORITY — Requested but not yet implemented

1. **Hero page — NOT satisfied yet.** User wants:
   - "Typography based like big ass bold filling the screen" — even bigger than current
   - **Interactive background** (not the current static fog gradients)
   - Specifically mentioned wanting something like **react-three-fiber** for the hero background
   - "Avoid that average safe design" — current version is still too tame

2. **Liquid Glass Navbar** — user wants the Nav to use:
   - GitHub: `https://github.com/dashersw/liquid-glass-js`
   - The nav should look like Apple-style liquid glass, not the current pill nav

3. **react-three-fiber integration** — user mentioned:
   - GitHub: `https://github.com/pmndrs/react-three-fiber`
   - Likely for the hero background / interactive 3D element

4. **ShaderGradient** — user mentioned:
   - GitHub: `https://github.com/ruucm/shadergradient`
   - Interactive animated gradient shader, probably for hero or a section background

5. **Project showcase page redesign** — user said it's "too generic":
   - The individual case study page at `app/work/[slug]/page.tsx` needs a redesign
   - "Avoid standard card layouts and typical Bootstrap-style spacing"
   - "Use extreme typography scaling and brutalist white space"

6. **Work section** (`components/work-grid.tsx`) — probably also needs redesign per the same brief

### Design direction given by user (exact words)
> "Avoid standard card layouts and typical Bootstrap-style spacing. Use extreme typography scaling and brutalist white space."
> "The hero page should be typography based like big ass bold filling the screen with animation, and background is interactive"
> "The navbar should use liquid-glass-js to make it glassy"

---

## 5. Libraries to Install (Next Session)

```bash
# react-three-fiber ecosystem (hero background / 3D)
(cd C:/Users/ganar/dev/portfolio && npm install three @react-three/fiber @react-three/drei)
(cd C:/Users/ganar/dev/portfolio && npm install -D @types/three)

# ShaderGradient (animated gradient background)
(cd C:/Users/ganar/dev/portfolio && npm install shadergradient)

# Liquid Glass (nav material)
# Check the repo first — may need manual integration
# https://github.com/dashersw/liquid-glass-js
```

---

## 6. Every File — Full Map

### Config
| File | Purpose |
|---|---|
| `next.config.ts` | MDX via `@next/mdx`, `turbopack.root` set to fix workspace detection bug |
| `mdx-components.tsx` | Required by Next.js App Router for MDX |
| `app/globals.css` | Tailwind v4 `@theme` tokens + custom CSS + `grain-shift` keyframe |
| `app/layout.tsx` | Space Grotesk + Syne Mono + Inter from `next/font/google`, SEO metadata |

### Components
| File | Client? | Purpose |
|---|---|---|
| `components/app-shell.tsx` | ✅ | Loader → Hero state handoff |
| `components/loader.tsx` | ✅ | Canvas particle globe loading screen |
| `components/shader-section.tsx` | ✅ | WebGL `#interface` section, mouse-reactive |
| `components/hero.tsx` | ✅ | Cinematic full-viewport hero with phase animation |
| `components/nav.tsx` | ✅ | Glass pill nav — scroll hide/show + mobile hamburger |
| `components/project-card.tsx` | ✅ | Card with hover lift, NO glow, 4px radius |
| `components/work-grid.tsx` | — | 63%/35% featured+stack grid |
| `components/about.tsx` | ✅ | 2-col photo+bio, stats row |
| `components/skills.tsx` | — | 3 category chip rows |
| `components/process.tsx` | — | 4-step cards |
| `components/contact.tsx` | ✅ | Pulse dot, email CTA |
| `components/footer.tsx` | — | 3-col Syne Mono footer |
| `components/fade-up.tsx` | ✅ | IntersectionObserver scroll reveal |
| `components/hud/section-label.tsx` | — | `LABEL // DESC` mono text |
| `components/hud/bracket-corners.tsx` | — | SVG bracket corners |
| `components/hud/reticle.tsx` | — | Target reticle SVG (currently unused after hero rebuild) |
| `components/hud/scan-line.tsx` | ✅ | 1px scan line sweep (currently unused after hero rebuild) |

---

## 7. Images Status

### ✅ In place
- `/public/thumbnails/ctf-mn.png`
- `/public/thumbnails/apple-flow.png`
- `/public/thumbnails/mesa-visual.png`
- `/public/hero-images/ctf-mn.png`
- `/public/hero-images/apple-flow.png`
- `/public/hero-images/mesa-visual.png`
- `/public/work/ctf-mn/landing.png`
- `/public/work/apple-flow/landing.png`
- `/public/work/apple-flow/dashboard.png`
- `/public/work/mesa-visual/` — 6 sticker images

### ❌ Missing (needed before launch)
| File | Notes |
|---|---|
| `/public/thumbnails/uudam-network.png` | Still missing |
| `/public/hero-images/uudam-network.png` | Still missing |
| `/public/photo.jpg` | About section photo |
| `/public/resume.pdf` | Linked from nav + about |
| `/public/og-image.png` | Social preview 1200×630px |

---

## 8. Design Tokens (unchanged)

```
Colors:   --color-void #050505 · --color-lime #A3FF47 · --color-chrome #C8C8C8
Fonts:    font-display = Space Grotesk 300 · font-mono = Syne Mono · font-body = Inter
Spacing:  8px grid · section padding 120px · hero padding 160px
Radii:    sm=4 md=8 lg=12 xl=20 full=9999
```

---

## 9. Known Quirks

### Turbopack workspace root bug
Next.js Turbopack picks up the wrong root (Apple-Flow monorepo). Fixed in `next.config.ts`:
```ts
turbopack: { root: 'C:/Users/ganar/dev/portfolio' }
```
**Always run commands from inside portfolio dir using subshell `(cd ... && ...)`.**

### Screenshot tool limitation
The `grain-shift` CSS animation (infinite, on loader + hero grain overlays) prevents the Claude Preview screenshot tool from capturing the page when the WebGL shader section has rendered at least once in the session. Workaround: use the Chrome MCP or computer-use to screenshot instead.

### `@mdx-js/loader` is a peer dep
Not auto-installed with `@next/mdx`. Already in node_modules but if you `npm ci` from scratch, run `npm install @mdx-js/loader`.

### `scan-line.tsx` and `reticle.tsx` are orphaned
These HUD atoms are no longer used after the hero rebuild. They can be deleted or repurposed.
