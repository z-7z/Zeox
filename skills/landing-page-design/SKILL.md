---
name: landing-page-design
description: "Zeox-vendored design guidance for building and editing landing pages, marketing sites, web UI, and components. Adapted (condensed) from elayadesign/ai-design-skills, MIT licensed. Consult before choosing page sections, headlines, CTAs, spacing, radius, backgrounds, icons, or motion for any Zeox interface."
source: https://github.com/elayadesign/ai-design-skills
license: MIT
---

# Landing Page Design (Zeox vendored copy)

This is a condensed, Zeox-adapted version of the `landing-page-design` skill.
Where Zeox branding rules (OLED black, purple/orange, Lucide icons) conflict
with this file, the Zeox branding rules win. Read the full original at the
source link above for the complete system.

## Part A — Strategy and structure

- A landing page wins ONE intent: one offer, one audience, one primary action.
- Above the fold: headline (outcome + audience), subheadline, one primary CTA,
  one proof signal, hero visual.
- Mid page: problem to solution, benefits (3 to 5, outcome driven), how it
  works, social proof.
- Bottom: FAQ / objection handling, risk reversal, final CTA identical to top.
- Build section by section (hero, benefits, how it works, proof, FAQ, final
  CTA). Never rebuild the whole page per iteration; keep diffs reviewable.
- Copy: benefit first, be specific ("cut weekly reporting from 4 hours to 15
  minutes", not "save time"). CTA = verb + what you get. Never "Learn more".
- Never invent facts. Missing prices, stats, or testimonials become clearly
  marked placeholders (`{{price}}`) or explicitly labeled prototype data.

## Part B — Visual rules applied at Zeox

- Typography: weights capped at semibold; no italics; no ultra bold. Headings
  and body use `text-wrap: balance` / `text-wrap: pretty` where supported.
  (Zeox keeps Inter as its typeface; the skill's font list is advisory.)
- Type sizes land on Tailwind's default scale; snap to the closest step below
  when in doubt. No arbitrary pixel sizes like `text-[19px]`.
- Spacing uses Tailwind's scale; main buttons: 8px vertical, 12px horizontal
  padding minimum.
- Nested radius: inner radius = outer radius − gap (only when result > 2).
- Card borders go all the way around, never one side only (status cards are
  the single deliberate exception: their colored left edge encodes state, not
  decoration).
- Backgrounds are flat. Gradients are allowed only on text and the primary
  button, per Zeox branding.
- Hero heading gradient: `#FFFFFF` → `#9B9B9B` left to right on dark theme,
  OR the Zeox purple-to-orange text gradient for brand moments. Never gradient
  backgrounds.
- Motion: `cubic-bezier(0.22, 1, 0.36, 1)` with 500ms for layout/position,
  300ms for color/opacity. Animate only `transform` and `opacity`. Respect
  `prefers-reduced-motion`.
- Scroll reveals: rise 32px, fade in over 600 to 800ms, trigger once via
  IntersectionObserver. Never attach work to unthrottled scroll listeners.

## States (required for every interactive element)

Hover (background shift or translate), active (`scale(0.98)` or
`translateY(1px)`), focus (visible ring, accessibility requirement), loading
(skeleton loaders shaped like the real layout), empty (composed getting
started view), error (inline and specific, never `window.alert()`).

No dead links. The current page is indicated in navigation.

## Content realism

- Real draft copy in the product's voice; no lorem ipsum.
- Sample numbers in prototypes avoid suspiciously round figures.
- Banned filler words: "revolutionize", "supercharge", "cutting edge",
  "effortless", "transform your workflow", "harness the power", "world class".
- Sentence case for headings and buttons.

## Ship checklist

- Privacy policy and terms links in the footer
- Custom branded 404
- Client side form validation
- Skip to content link for keyboard users
- Branded favicon, `<title>`, meta description, og tags
- Alt text on every meaningful image
- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- A way back from every page
- 390px check: no horizontal overflow, primary action visible in first screen

## Skill selection rules for Zeox

- Use `landing-page-design` for any landing page, marketing page, component,
  or dashboard design work.
- Use `figma-designer` ONLY when Figma-related work is required. It is not
  vendored here because Zeox has no Figma workspace connected.
- Never blindly apply every available skill. Read the relevant SKILL
  instructions before starting a design task. Skills are design guidance, not
  ready-made designs to copy.
