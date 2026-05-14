# Portfolio Handoff — Anar-Erdene Gantulga

> Last updated: 2026-05-15
> Session 6 by Claude Sonnet 4.6 — About section overhaul: metallic 3D TV, CRT noise→aurora shader, full-bleed canvas
> Build status: ✅ Clean — TypeScript passes, deployed to Vercel
> Repo: https://github.com/AnrErdn/portfolio (branch: main)

---

> ⚠️ **Standing instruction:** Always update this HANDOFF.md at the end of every session or after any significant change. Include: what was done, what files changed, any new quirks discovered, and current build/deploy status.

---

## 1. What This Is

A personal portfolio at `C:\Users\ganar\dev\portfolio`.
Next.js 16 App Router, Tailwind v4, MDX case studies, no database.

**Live sections:** Loader → Hero → Work → About → Skills → Interface (Shader) → Process → Contact → Footer
**Case study routes:** `/work/ctf-mn` · `/work/uudam-network` · `/work/apple-flow` · `/work/mesa-visual`

---

## 2. How to Run

```bash
# Dev server — run from the main portfolio dir (Turbopack workspace bug, see §10)
(cd C:/Users/ganar/dev/portfolio && node_modules/next/dist/bin/next dev --port 3001)

# If running from inside a worktree, .claude/launch.json already has the correct path:
# node_modules/.bin/next is a bash shebang on Windows — must use the JS file directly:
# node C:/Users/ganar/dev/portfolio/node_modules/next/dist/bin/next dev --port 3001

# Type check
npx --prefix C:/Users/ganar/dev/portfolio tsc --project C:/Users/ganar/dev/portfolio/tsconfig.json --noEmit
```

---

## 3. Session 6 Changes (2026-05-15)

### What was done
Full overhaul of the About section: metallic 3D TV with chrome/titanium materials and lime accents, new CRT shader with visible noise-signal idle state and aurora hover state, floating objects repositioned and redesigned with metallic materials + lime details, canvas moved to full-bleed layout so objects can float freely across both columns, cinematic overlays added (CSS scanlines, film grain, radial vignette, right-side gradient for dossier readability).

#### Modified files
| File | What changed |
|---|---|
| `components/about-tv.tsx` | Complete material overhaul: TV body → titanium gray (`#3C3E44`, metalness 0.82), bezel → `#292B30` metalness 0.88, knobs/chrome → near-mirror metalness 0.96–0.98. Lime accent materials (emissive `#A3FF47`) on indicator LED, bottom strip, VHS spine, cassette screws/stripe, film reel spokes. CRT shader rewritten: idle state = visible phosphor-green noise with VHS lag bands + horizontal glitch + rolling interference band (no longer near-black at idle); hover state = flowing aurora in lime→teal→cyan (5 bands with sinusoidal wave motion, `exp(-dist * 21)` glow, shimmer). Screen glow point light tracks hover: green on idle, teal/cyan on hover. Lighting overhauled: ambient 0.40 + key 3.5 + warm fill 1.6 + lime bounce from below 0.9 + white rim 0.7. Environment changed from "night" to "warehouse" for metallic surface reflections. Floating objects repositioned: VHS `[-3.8, -1.0, 0.4]`, cassette `[3.2, 1.6, 0.3]`, film reel `[3.6, -1.6, 0.5]`. TV group shifted to `[-0.8, 0.12, 0]`. Camera: `fov: 62`, position `[0, 0.3, 7.5]`. Removed `useEffect`/texture loading (no longer needed — shader is fully procedural). |
| `components/about.tsx` | Layout restructured: canvas moved from left grid column to `position:absolute; inset:0` full-bleed behind entire section. Left column replaced with transparent spacer (TV shows through). Removed `overflow:hidden` from tv-wrapper. Added overlays: right-side gradient (`transparent 30% → #0D0D0D 80%`) for dossier readability; CSS scanlines via `repeating-linear-gradient`; film grain; radial vignette centred at `28% 50%`. `zIndex` stacking: canvas 0, gradients 1–2, content 3. |

#### Quirks discovered
| Quirk | Details |
|---|---|
| Worktree preview server must specify dir | The preview tool's existing server (port 3001) runs from the main portfolio dir, not the worktree. Always start a separate server for the worktree using `autoPort: true` and pass the worktree path as the dir argument to `next dev`. |

---

## 3b. Session 5 Changes (2026-05-14)

### What was done
Hero name matrix animation now loops every 7 seconds. Gooey text morphing animation added to work grid project titles.

#### New files created
| File | Purpose |
|---|---|
| `components/ui/gooey-text-morphing.tsx` | GooeyText component — SVG `feColorMatrix` threshold filter creates a liquid gooey morph between two overlapping spans. Uses CSS Grid overlap (both spans `col-start-1 row-start-1`) instead of `absolute` positioning so it flows naturally in layout. Each instance gets a unique filter ID via `React.useId()`. Animation uses `setInterval` + `performance.now()` absolute timestamps for reliable timing across all browser contexts (background tabs, iframes, throttled timers). |

#### Modified files
| File | What changed |
|---|---|
| `components/ui/matrix-text.tsx` | Added `repeatInterval?: number` prop. When set, the `hasRun` one-shot guard is bypassed and the animation re-fires automatically every N milliseconds after it finishes. Used in hero for 7-second repeat cycle. |
| `components/hero.tsx` | Both `MatrixText` instances (`ANAR-ERDENE`, `GANTULGA`) now pass `repeatInterval={7000}` — matrix flash replays every 7 seconds indefinitely. |
| `components/work-grid.tsx` | Project title `h3` and roles row replaced with `GooeyText`. Each row passes `texts={[project.title, project.title]}` (same text morphs into itself for a gooey pulse effect), `morphTime={2.5}`, `cooldownTime={5}`. Roles row removed since GooeyText handles the title display. `GooeyText` imported from `@/components/ui/gooey-text-morphing`. |

#### Bugs fixed during this session
| Bug | Fix |
|---|---|
| SVG `feColorMatrix` filter not applied by Chrome when SVG is 0×0 | Added `overflow: hidden` to the SVG element — standard fix for hidden SVG defs |
| `requestAnimationFrame` completely paused in iframe/background contexts | Switched to `setInterval` at 16ms |
| `Date.now()` clock resolution frozen/throttled in cross-origin iframes, causing `dt` accumulation to stall | Replaced dt accumulation with `performance.now()` absolute `phaseStart` timestamps — `elapsed = (now - phaseStart) / 1000` is always correct regardless of timer throttling |
| Hydration mismatch on SVG `values` attribute | Multiline JSX string → single-line string in the `feColorMatrix` values prop |
| GooeyText spans blank for first 3+ seconds (initial cooldown delay) | Added immediate text initialization before the interval starts |

#### PRs merged this session
- PR #2 — Hero matrix repeat + gooey text animation (merged to main)
- PR #4 — Gooey text animation fix (open, pending merge)

---

## 3b. Session 4 Changes (2026-05-13)

### What was done
Vercel deployment, interactive cursor, shader HUD, text scramble/typewriter animations, process card hover, nav fix.

#### New files created
| File | Purpose |
|---|---|
| `components/cursor.tsx` | Sci-fi custom cursor: 6px lime dot + lagged 38px ring with bracket corners & tick marks. Hides default cursor via CSS `@media (pointer: fine)`. Mounted in `app/layout.tsx`. |
| `components/hero-brush.tsx` | Canvas overlay (mix-blend-mode: screen) — draws lime-green brush strokes along cursor path, elongated along velocity, 3-layer gaussian, fades over ~1s. Listens on `#hero` section. |
| `components/scramble-text.tsx` | Text scramble decode component. Chars shown as `]{$~|@012!3-_\/` etc., revealed left-to-right. Throttled at 85ms flicker rate. Triggered via IntersectionObserver (sections) or `trigger` boolean prop (hero). |
| `components/ui/matrix-text.tsx` | MatrixText component (adapted from Kokonut UI). Per-char 0/1 flash in lime `#A3FF47`, then resolves to real char using `motion/react`. Accepts `trigger` prop for hero phase sync. |
| `components/ui/typewriter.tsx` | Typewriter component (adapted from shadcn community). Types, deletes, cycles through array of strings. Uses `framer-motion`. Blinking cursor. |
| `lib/utils.ts` | `cn()` helper (simple class joiner, no clsx dep needed). |

#### Modified files
| File | What changed |
|---|---|
| `next.config.ts` | Removed hardcoded `turbopack.root: 'C:/Users/ganar/dev/portfolio'` — caused build warnings on Vercel (Linux path mismatch). |
| `app/layout.tsx` | Added `<Cursor />` import + render. |
| `app/globals.css` | Added `@media (pointer: fine) { *, *::before, *::after { cursor: none !important } }` to hide default cursor on mouse devices. |
| `app/page.tsx` | No changes currently (StatCards was added then removed per user request). |
| `components/nav.tsx` | Removed scroll-hide behaviour (`hidden` state + `handleScroll` useEffect + `translateY` on transform). Nav now always stays visible. Mobile menu overlay changed from near-opaque black to liquid glass (`backdrop-filter: blur(64px) saturate(180%) brightness(0.75)` + semi-transparent gradient). |
| `components/hero.tsx` | Added `ScrambleText` to eyebrow, headline, description. Added `MatrixText` for ANAR-ERDENE (phase 3) and GANTULGA (phase 4). Added `HeroBrush` canvas overlay. |
| `components/hud/section-label.tsx` | Wraps label text in `<ScrambleText>` — all section labels now decode on scroll-into-view. |
| `components/about.tsx` | `<ScrambleText>` on h2 "About me". |
| `components/skills.tsx` | `<ScrambleText>` on h2 "Skills & tools". |
| `components/process.tsx` | `<ScrambleText>` on h2 "How I work". Added `process-card` class + `.process-card:hover { border-color: rgba(163,255,71,0.45) }` CSS for green hover border. |
| `components/contact.tsx` | Replaced static "Let's build something." h2 text with `<Typewriter>` cycling 3 phrases at 65ms/char with blinking `_` cursor. |
| `components/shader-section.tsx` | Fixed aspect ratio stretch — added `uResolution` uniform read from `useThree().size`, shader now uses aspect-corrected UV space. Added full interactive HUD overlay: corner brackets, top-left label, top-right `SIG: ACTIVE` with pulse dot, bottom-left live X/Y coordinates, bottom-right specs, targeting reticle + crosshair that follows mouse. |
| `app/work/[slug]/page.tsx` | Fixed TS error: removed invalid `group: 'next'` from inline style object. |

#### Deployment
- Deployed to Vercel. Two build errors fixed before clean deploy:
  1. `group: 'next'` in inline style — not a valid CSS property, TypeScript rejects it
  2. `turbopack.root` hardcoded to Windows path — Vercel's Linux server couldn't resolve it
- Two Vercel projects detected: `anar-erdene` and `portfolio` — both deploy from the same repo/main branch

---

## 3b. Session 3 Changes (2026-05-12)

### What was done
Full visual redesign to match user's direction: **brutalist typography, interactive background, liquid glass nav**.

#### Libraries installed (in main portfolio `node_modules`)
| Package | Version | Purpose |
|---|---|---|
| `three` | ^0.176.0 | WebGL math / scene primitives |
| `@react-three/fiber` | ^9.6.1 | React renderer for Three.js — used in shader section |
| `@react-three/drei` | ^10.x | R3F helpers — installed, available for future use |
| `@types/three` | ^0.176.0 | TypeScript types for three.js |
| `shadergradient` | ^1.3.5 | Animated GLSL gradient — used in hero background |

> **`liquid-glass-js` (dashersw/liquid-glass-js) is NOT on npm.** The liquid glass effect for the nav is implemented manually with CSS `backdrop-filter` + SVG `feTurbulence/feDisplacementMap` + an animated specular highlight strip.

#### Modified files
| File | What changed |
|---|---|
| `next.config.ts` | Added `transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'shadergradient']` |
| `package.json` | Added new deps (three, @react-three/fiber, @react-three/drei, @types/three, shadergradient) |
| `.claude/launch.json` | Fixed `runtimeArgs` path — must use `node_modules/next/dist/bin/next` not `.bin/next` (bash shebang breaks on Windows with `node` executor) |
| `components/hero.tsx` | **Complete rebuild.** ShaderGradient animated background (dark void + lime waterplane), typography scaled to viewport-filling: ANAR-ERDENE at `clamp(56px, 13.5vw, 230px)` and GANTULGA at `clamp(80px, 20vw, 340px)`. Phase-stagger animation retained. Fog overlays removed (ShaderGradient replaces them). Vignette overlay kept. HUD metadata kept. |
| `components/nav.tsx` | Liquid glass material: `backdrop-filter: blur(52px) saturate(200%) brightness(1.08)`, SVG filter (`#liquid-glass-filter`) with feTurbulence displacement on the glass surface, specular highlight `<div>` with `liquid-shimmer` CSS keyframe. SVG filter definition injected as a hidden fixed element. |
| `components/work-grid.tsx` | **Complete redesign.** Card grid removed. Now a brutalist numbered list — each project is a full-width row with: huge ghosted index number (left), oversized title + roles (center), year + "VIEW →" (right). Hover: thumbnail fades in as background of the row (opacity 0.07), index turns lime, "VIEW →" turns lime. Made client component (`'use client'`) for hover state. |
| `components/shader-section.tsx` | **Complete rebuild.** Replaced manual `<canvas>` WebGL with `@react-three/fiber` Canvas + custom GLSL domain-warp FBM shader. Mouse warps the noise field (via R3F `pointer`). Click creates a travelling ripple wave. IntersectionObserver still pauses canvas when off-screen. Dynamic import (`ssr: false`) for SSR safety. |
| `app/work/[slug]/page.tsx` | **Brutalist redesign.** Title at `clamp(56px, 10vw, 160px)` fills the viewport. Back nav is minimal mono text. Meta strip uses raw horizontal rules instead of rounded boxes. All image `borderRadius` removed (0). Next-project link is `clamp(36px, 6vw, 96px)` with hover-to-lime. Padding increased to 56px on desktop. |

#### What was NOT changed this session
- `components/loader.tsx` — untouched
- `components/app-shell.tsx` — untouched
- `components/about.tsx`, `skills.tsx`, `process.tsx`, `contact.tsx`, `footer.tsx` — untouched
- `components/project-card.tsx` — no longer used by work-grid but kept in codebase
- `app/page.tsx` — untouched (still uses AppShell + WorkGrid + ShaderSection etc.)
- `app/globals.css` — untouched
- `lib/projects.ts`, MDX content — untouched

---

## 4. What's Still Needed

### HIGH PRIORITY — Requested and not yet done

1. **Missing images** — pages will 404 on these:
   - `/public/thumbnails/uudam-network.png` (or .jpg — currently showing placeholder error)
   - `/public/hero-images/uudam-network.png`
   - `/public/photo.jpg` (About section)
   - `/public/resume.pdf` (Nav + About CTA)
   - `/public/og-image.png` (Social preview 1200×630)

2. **ShaderGradient SSR/hydration** — the hero background renders after a short flash of black because it's a dynamic import. If the flash is too noticeable after the loader, consider preloading the canvas or keeping the dark background intentionally during the loader phase (it already looks intentional).

3. **About section photo** — still shows a broken image placeholder.

### Lower priority / nice to have
- `components/hud/scan-line.tsx` and `components/hud/reticle.tsx` are orphaned — can be deleted
- `components/project-card.tsx` is no longer used by `work-grid.tsx` but is still imported nowhere — can be deleted or repurposed for future use
- TypeScript: `THREE.Clock` deprecation warning in console (harmless, from shadergradient's internal drei usage) — can suppress with `console.warn` filter or ignore

---

## 5. Every File — Full Map

### Config
| File | Purpose |
|---|---|
| `next.config.ts` | MDX via `@next/mdx`, `turbopack.root` fix, `transpilePackages` for three/r3f/shadergradient |
| `mdx-components.tsx` | Required by Next.js App Router for MDX |
| `app/globals.css` | Tailwind v4 `@theme` tokens + custom CSS + `grain-shift` keyframe |
| `app/layout.tsx` | Space Grotesk + Syne Mono + Inter from `next/font/google`, SEO metadata |

### Components
| File | Client? | Purpose |
|---|---|---|
| `components/app-shell.tsx` | ✅ | Loader → Hero state handoff |
| `components/loader.tsx` | ✅ | Canvas 2D particle globe loading screen (~3.6s) |
| `components/hero.tsx` | ✅ | ShaderGradient background + viewport-filling typography + phase stagger |
| `components/nav.tsx` | ✅ | Liquid glass pill nav — scroll hide/show, SVG distortion, shimmer |
| `components/work-grid.tsx` | ✅ | Brutalist numbered list — hover reveals thumbnail + lime index |
| `components/shader-section.tsx` | ✅ | R3F + custom GLSL FBM shader — mouse warp + click ripple |
| `components/project-card.tsx` | ✅ | Old card component — no longer used, kept for reference |
| `components/about.tsx` | ✅ | 2-col photo+bio, stats row |
| `components/skills.tsx` | — | 3 category chip rows |
| `components/process.tsx` | — | 4-step cards |
| `components/contact.tsx` | ✅ | Pulse dot, email CTA |
| `components/footer.tsx` | — | 3-col Syne Mono footer |
| `components/fade-up.tsx` | ✅ | IntersectionObserver scroll reveal wrapper |
| `components/hud/section-label.tsx` | — | `LABEL // DESC` mono text |
| `components/hud/bracket-corners.tsx` | — | SVG bracket corners |
| `components/hud/reticle.tsx` | — | ⚠️ Orphaned — no longer used |
| `components/hud/scan-line.tsx` | ✅ | ⚠️ Orphaned — no longer used |
| `components/cursor.tsx` | ✅ | Sci-fi global cursor — lime dot + lagged ring with brackets |
| `components/hero-brush.tsx` | ✅ | Canvas brush trail on hero (mix-blend-mode: screen) |
| `components/scramble-text.tsx` | ✅ | Text scramble decode — IntersectionObserver or `trigger` prop |
| `components/ui/matrix-text.tsx` | ✅ | 0/1 matrix flash then resolve — uses `motion/react`. `repeatInterval` prop loops animation every N ms |
| `components/ui/typewriter.tsx` | ✅ | Typewriter with delete/cycle — uses `framer-motion` |
| `components/ui/gooey-text-morphing.tsx` | ✅ | GooeyText — SVG feColorMatrix gooey morph. CSS grid overlap spans, unique filter ID per instance, `performance.now()` timing |
| `lib/utils.ts` | — | `cn()` class name helper |

---

## 6. Images Status

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
| `/public/thumbnails/uudam-network.png` | Still missing — causes Image error in work list row |
| `/public/hero-images/uudam-network.png` | Still missing |
| `/public/photo.jpg` | About section photo |
| `/public/resume.pdf` | Linked from nav + about |
| `/public/og-image.png` | Social preview 1200×630px |

---

## 7. Design Tokens (unchanged)

```
Colors:   --color-void #050505 · --color-lime #A3FF47 · --color-chrome #C8C8C8
Fonts:    font-display = Space Grotesk 300 · font-mono = Syne Mono · font-body = Inter
Spacing:  8px grid · section padding 120px · hero padding 160px
Radii:    sm=4 md=8 lg=12 xl=20 full=9999
```

---

## 8. ShaderGradient Config (hero background)

The hero uses these ShaderGradient props — tweak here to adjust the animated gradient:

```tsx
<ShaderGradient
  type="waterPlane"    // fluid motion
  animate="on"
  uSpeed={0.12}        // slow, cinematic
  uStrength={1.8}      // wave amplitude
  uDensity={1.5}
  uFrequency={5.5}
  color1="#020202"     // near-black
  color2="#0A1500"     // very dark green (lime territory)
  color3="#030303"     // void
  brightness={0.75}    // keep it dark
  grain="on"
  lightType="3d"
  envPreset="city"
  cameraZoom={1.5}
  positionX={0}
  positionY={-1}
  positionZ={0}
/>
```

---

## 9. R3F Shader Section Details

The `#interface` section uses a custom GLSL domain-warp FBM shader written in `shader-section.tsx`. Key points:
- Vertex shader: full-screen quad via `gl_Position = vec4(position.xy, 0.0, 1.0)`
- Fragment shader: 2-pass domain warp (`q1 → q2 → f`) with mouse offset and ripple displacement
- Palette: void black → dark lime → teal accent (three `mix()` bands)
- Mouse: R3F `pointer` mapped to `[0,1]` UV space via `(pointer.x + 1) * 0.5`
- Ripple: `uRipple` (click UV) + `uRippleAge` (seconds since click) — sinusoidal wave that decays
- Off-screen pause: `IntersectionObserver` hides the canvas element when not visible
- Dynamic import with `ssr: false` to avoid hydration mismatch

---

## 10. Known Quirks

### Turbopack workspace root bug
Next.js Turbopack picks up the wrong root (Apple-Flow monorepo). Fixed in `next.config.ts`:
```ts
turbopack: { root: 'C:/Users/ganar/dev/portfolio' }
```

### `.bin/next` is a bash script on Windows
When using `node` as the `runtimeExecutable` in `launch.json`, you cannot use `node_modules/.bin/next` — it's a bash shebang file and Node will throw a syntax error. Use the actual JS entry point:
```
node_modules/next/dist/bin/next
```

### Worktree node_modules resolution
The worktree lives at `.claude/worktrees/gracious-kapitsa-6e3e84` which is INSIDE the main portfolio directory. Node module resolution walks up the tree and finds `C:/Users/ganar/dev/portfolio/node_modules` automatically — no need to `npm install` inside the worktree.

### Screenshot tool + WebGL
The Claude Preview screenshot tool captures a static frame. The ShaderGradient and R3F canvases are animated — the screenshot may show them mid-frame or blank depending on timing. This is cosmetic; the actual browser renders correctly.

### THREE.Clock deprecation warning
`shadergradient` internally uses drei which uses `THREE.Clock`. This logs a console warning but is harmless. It will go away when shadergradient updates its peer deps.

### `@mdx-js/loader` is a peer dep
Not auto-installed with `@next/mdx`. Already in node_modules but if you `npm ci` from scratch, run `npm install @mdx-js/loader`.

### Timer + clock throttling in Claude Preview iframes
The Claude Preview tool runs the page inside a cross-origin iframe. This causes:
- `requestAnimationFrame` → completely paused (0fps). Never use rAF for animations that need to be verified in the preview tool.
- `Date.now()` → clock resolution frozen/throttled. `dt` accumulation gives wrong results.
- `setInterval` at 16ms → throttled but fires. Combined with `performance.now()` absolute timestamps (not delta accumulation), it works correctly.
- The `preview_screenshot` tool times out when WebGL canvases (ShaderGradient, R3F) are present — use `preview_snapshot` for DOM verification instead.

### GooeyText SVG filter must have `overflow: hidden`
Chrome will not apply a `filter: url(#id)` reference if the `<svg>` element containing the `<filter>` defs has `width:0; height:0` without `overflow: hidden`. Always use `style={{ position:'absolute', width:0, height:0, overflow:'hidden' }}` on hidden SVG defs elements.
