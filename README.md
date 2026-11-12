# Zeox — zeox.xyz

Premium developer tools and script protection ecosystem. This repository
contains the initial frontend: the **public landing page** and the
**dashboard overview**.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (icons)
- React Router

## Getting started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
```

## Scope of this phase

Implemented:

- Public landing page (`/`)
- Dashboard overview (`/dashboard`)

Placeholder routes (visual only, planned for later phases):

- `/dashboard/protect` — Zeox Protect
- `/dashboard/keys` — Zeox Keys
- `/dashboard/script-protect` — Script Protect
- `/dashboard/activity` — Activity
- `/dashboard/settings` — Settings

## Design system

Solid premium card system on OLED black. See `DESIGN_WORKFLOW.md` for the
full token table, card roles, and the AI design workflow used to evolve the
interfaces.

Approved surfaces: `#000000`, `#050507`, cards `#101014` / `#15141B`,
borders `#292333`. Accents: purple `#8B5CF6` dominant, orange `#FF7411`
selective. No backdrop blur, no frosted glass, no glow on cards.

## Skeleton Download System

`src/lib/skeleton/` provides a reusable engine for downloading approved UI
skeletons and project templates from GitHub repositories:

- Downloads land in an isolated temporary workspace, never in app code.
- Downloaded structures are inspected before import (layouts, components,
  styles, configs, dependencies, executable files).
- Specific files or folders can be selected for import.
- Conflicts with existing files are detected; nothing is overwritten without
  explicit per-file confirmation.
- Downloaded files are never executed. Cleanup discards the workspace only.

```ts
import { SkeletonDownloader } from './lib/skeleton';

const dl = new SkeletonDownloader({ onStateChange, onProgress });
await dl.download({ kind: 'github', owner, repo });
const report = dl.inspect();
const plan = dl.planImport({ paths }, existingFiles);
await dl.import(plan, resolutions, writeFile);
dl.cleanup();
```

## AI Design Skills

Design skills are vendored in `skills/` (adapted from
[elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills),
MIT). Read `skills/landing-page-design/SKILL.md` before any design task, per
`DESIGN_WORKFLOW.md`. `figma-designer` is used only when Figma work is
required.

## Notes

- All data is mock/prototype data. No backend, no Supabase, no OAuth, no payments.
- The Zeox logo is rendered as a vector component in `src/components/ZeoxLogo.tsx`.
  To use the official PNG instead, place it at `src/assets/zeox-logo.png` and swap
  the `<svg>` for an `<img />` in that component.
