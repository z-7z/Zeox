# Zeox AI Design Workflow

This document defines the reusable workflow for any AI (or human) changing
Zeox interfaces. It combines the Skeleton Download System, vendored AI Design
Skills, and the glass card design system.

## Workflow (run in order, every time)

1. **Inspect the current project structure.** Read `README.md`, `src/`, and
   the component inventory before touching anything. Preserve unrelated
   working code.
2. **Understand the existing Zeox design system.** The active workspace shares
   its material and navigation in `src/components/workspace/` and its
   dashboard/skeleton grid in `src/components/dashboard/layout.css`.
3. **Read relevant AI Design Skills.** Vendored skills live in `skills/`.
   Read `skills/landing-page-design/SKILL.md` before any landing page, page
   section, or component design work. Use `figma-designer` (external,
   [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills))
   only when Figma work is required. Never apply every skill blindly; never
   copy skill outputs as ready-made designs.
4. **Inspect available skeletons when needed.** Use the Skeleton Download
   System (below) to bring in approved UI skeletons or templates.
5. **Select suitable design patterns and components.** Match patterns to the
   actual purpose of each page. Do not reuse one layout everywhere.
6. **Create the interface using the existing architecture.** Reuse `Shell`,
   `PanelHeader`, `PanelDialog`, the `.glass-card` material, session providers
   and the four routed sections.
7. **Review** visual quality, responsiveness (390px check), accessibility
   (focus rings, semantic HTML, alt text), and consistency.
8. **Report the changes made.**

## Dashboard-first workspace

`/` and `/dashboard` open the tool overview. Use one left-hand navigation
landmark with exactly **Dashboard, Obfuscate, Usages and Vault**. Keep it
vertical on every screen. The desktop rail can disappear completely; on
phones (including short landscape viewports) it becomes a normally closed modal drawer. Keep a labeled trigger,
current-page indication, Escape/backdrop dismissal and keyboard focus return.
Never add a second top strip, command search, simulated accounts or sales.
`/dashboard/overview` and `/showcase` are compatibility redirects.

Keep the reference Dashboard composition: **two large charts above four small
cards**, in order: layered funnel, hatched pie with legend, dotted tracks,
three portraits, 7×24 heatmap, quick-action rows. Reuse the drawings in
`src/components/dashboard/`; change the material on the cards, not the art.
The charts are visibly marked as samples; the portrait card shows actual
in-tab runs, and quick actions lead to real tools. The loading state and
offline HTML export use the same grid and static six-slot template.

Keep the inset desktop frame and one left rail. On a phone, stack the
charts full width, keep pie and legend side by side, and keep the active page title in
the compact toolbar on every route. Do not substitute tool posters or a top tab strip.
Obfuscate keeps input, settings and read-only output in order on phones;
Vault is a file and passphrase workbench; Usages is an exportable report.
Keep build/encrypt within the first phone screen without disabling zoom.
Animate **artwork inside cards**, not metrics, text, hit targets or bounds.
Honor both the sidebar motion switch and `prefers-reduced-motion`.

## Skeleton Download System

Design contract for an external template importer (not shipped in the dashboard UI):

- Sources: GitHub repositories (`{ kind: 'github', owner, repo, ref?, subdirectory? }`).
- Flow: `download()` → temp workspace → `inspect()` → `planImport()` →
  conflict confirmation → `import()` → `cleanup()`.
- Downloaded skeletons always stay in an isolated temporary workspace,
  separate from production application code.
- Folder structures are inspected before import: layouts, components, styles,
  dependency manifests, configs, assets, and executable files are classified
  and reported with warnings.
- Specific components or folders can be selected for import.
- Conflicts with existing project files are detected in `planImport()`.
- Existing files are **never** overwritten without an explicit per-file
  `overwrite` resolution. `skip` and `rename` are the safe defaults.
- Downloaded files are **never executed** automatically. Executable files are
  quarantined and listed in `StructureReport.executableFiles`.
- External dependencies found in skeletons must be reviewed before any
  package installation. Avoid unnecessary installations.
- `cleanup()` discards the temp workspace and never touches imported files.

## One Dashboard style across every section

Treat the approved Dashboard as the baseline, not another page to restyle.
`workspace/material.css` owns graphite fills, 8px corners, hairlines, corner
marks, density and reduced-transparency/contrast fallbacks. `Shell` owns the
frame, gutters and one toolbar H1. `workspace/panels.css`, `PanelHeader` and
`PanelDialog` own widget type, toolbars, buttons, segmented tracks and modal
presentation. Import them through the shared layout, not a lazy page.

Pair tool panels on desktop and stack them when narrow. Different data and
workflows are appropriate; separate themes, pearl summary strips, oversized
page intros, and local overrides of the card material are not. Keep readable
syntax ink, opaque editor/password surfaces, real session data and native
controls. Do not copy sample charts onto tool pages to fill empty space.
Inspect at 320px, 390px, a short landscape height and desktop; check focus,
touch targets, safe-area padding, contrast, scroll and visible text.

## Icons

- Lucide first, official brand icons where appropriate, custom SVG only when
  nothing suitable exists.
- Every icon must match its actual function. No emojis, no decorative icons
  that add no meaning.
