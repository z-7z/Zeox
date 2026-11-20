# Zeox AI Design Workflow

This document defines the reusable workflow for any AI (or human) changing
Zeox interfaces. It combines the Skeleton Download System, vendored AI Design
Skills, and the matte workspace design system.

## Workflow (run in order, every time)

1. **Inspect the current project structure.** Read `README.md`, `src/`, and
   the component inventory before touching anything. Preserve unrelated
   working code.
2. **Understand the existing Zeox design system.** The active workspace shares
   its opaque surfaces and navigation in `src/components/workspace/` and its
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
   `PanelHeader`, `PanelDialog`, the `.ws-panel` surface, session providers
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

Follow the attached desktop report reference, not its surrounding image matte:
**edge-to-edge viewport, icons-only left rail, three KPIs, wide line chart,
segmented radial summary at right, two compact summaries below**. Use Zeox
file and session data, not imitation sales figures. Clearly distinguish the
dated sample report from live tab-local runs. Match the static skeleton and
script-free export to these panes. Do not restore the old ribbon/pie tiles.

All four routes use the viewport width and at least its height, with natural
scrolling when needed. No inset mock window, desktop max-width, backdrop
filters, shiny borders, glows or shimmer. Use solid graphite active states
and fine rules between panes. Give each nav icon an accessible name and a
native hover title. Keep the toolbar usable when the rail is hidden.

On narrow screens, stack the panes without horizontal scrolling. Obfuscate
is file-only; Vault is a file and passphrase workbench; Usages is an
exportable report. Keep build/encrypt within the first portrait phone screen
without disabling zoom. Respect the motion switch and reduced-motion setting.

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

## One surface system across the workspace

`workspace/material.css` owns opaque fills, type colors, hairlines and the
two desktop splits. Give Dashboard's plot and Vault's file workbench the
space left by a bounded right inspector (`--db-work-columns`). Keep the
wider details column (`--db-columns`) for Obfuscate and Usages. Match each
route's loading geometry to its own split, including when the rail is hidden.
`Shell` owns the viewport, rail and one toolbar H1.
`workspace/panels.css`, `PanelHeader` and `PanelDialog` own shared tool
controls and modals. Individual routes arrange their own contents; never put
example analytics on tool pages to fill space.

Check phone portrait and landscape as well as laptop, 1920px and wider PC
windows. Verify no desktop gutters around the app or horizontal overflow,
with the rail open and closed. Test real uploads, downloads, chart controls,
keyboard focus, readable empty states and direct-entry loading.

## Icons

- Lucide first, official brand icons where appropriate, custom SVG only when
  nothing suitable exists.
- Every icon must match its actual function. No emojis, no decorative icons
  that add no meaning.
