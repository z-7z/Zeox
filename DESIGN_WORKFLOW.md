# Zeox AI Design Workflow

This document defines the reusable workflow for any AI (or human) changing
Zeox interfaces. It combines the Skeleton Download System, vendored AI Design
Skills, and the signal desk design system.

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

## The signal desk

Use the latest reference's hierarchy: a near-black frame, compact utilities and an asymmetric grid of opaque rounded cards. The Obfuscator is the product; the sample Dashboard is a secondary destination. Fill the actual browser window; don't reproduce the empty presentation margin in the reference image. Keep tight, consistent gaps, orange active markers, white data lines, lime change chips and red/green chart fills. No glass, reflections, shine sweeps or decorative motion.

- **Desktop Dashboard:** one dominant throughput card at upper left; batch tape and narrow, vertical action dock to its right. Below: the green output card, small red trend above the dot index and local session meter, and wide format columns with an orange accent. Keep the date rail aligned to the actual plot, not the viewport.
- **Phone Dashboard:** a two-column composition, not a scaled desktop. Trace and columns span the width; yield and batches share a row. Turn the action dock horizontally. Keep touch and keyboard inspection, period controls and data tables usable.
- **Navigation:** never reserve a column or tab strip for tools. Use one masthead launcher. Its native dialog contains four icon-only links, Obfuscator first, in a compact 2×2 grid. Keep accessible names, current state, initial focus, Escape, backdrop dismissal and focus return. The same launcher works on touch and desktop. Search is the text-based alternative. Keep one route H1.
- **Data:** only the Dashboard uses the dated sample. Label it as such. The live session tile, file receipts and Usages report reflect actual local successes. Never fill an empty state with invented operations, accounts or balances.

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

`workspace/material.css` owns the tokens and card housing. `Shell`, `PanelHeader`, `PanelDialog` and the layouts in `workspace/panels.css` are shared. The Obfuscator is the landing page on `/` as well as `/obfuscate`. Lead with the source file, its actual build settings and the resulting copy, not an analytics grid or a Vault form. Its three-panel track layout lives in `source/layout.css` so even the cold state opens into the file tool. Accept an attachment only; never add an editor. Vault retains its five-card archive station. Usages uses the same housings for totals, byte trends, operation mix and the exportable ledger.

`dashboard/layout.css` owns **all three** Dashboard layouts: live, lazy fallback and standalone export. Other route fallbacks reserve each station or ledger's tracks. Load layout rules with the shell, not only with a lazy route. The exported skeleton must have no scripts, session data, fonts to download or network requests.

Review the populated and empty states, cold entries, and offline downloads. Compare at laptop, wide Windows and phone portrait/landscape sizes with the tool menu both open and closed. Test the real file picker, download bytes, keyboard shortcuts and modal focus return, and check horizontal overflow with native scrollbars. Keep build/encrypt in reach in the initial phone view without disabling zoom.

## Icons

- Lucide first, official brand icons where appropriate, custom SVG only when
  nothing suitable exists.
- Every icon must match its actual function. No emojis, no decorative icons
  that add no meaning.
