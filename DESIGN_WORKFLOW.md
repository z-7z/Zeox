# Zeox AI Design Workflow

This document defines the reusable workflow for any AI (or human) changing
Zeox interfaces. It combines the Skeleton Download System, vendored AI Design
Skills, and the solid card design system.

## Workflow (run in order, every time)

1. **Inspect the current project structure.** Read `README.md`, `src/`, and
   the component inventory before touching anything. Preserve unrelated
   working code.
2. **Understand the existing Zeox design system.** The active workspace shares
   its card grid/tokens in `src/components/dashboard/layout.css` and its
   section chrome in `src/components/workspace/`.
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
   `PageHeading`, `StatusCard`, `WidgetHeading`, the `.db-card` surface and
   the shared routed sections. The public showcase has separate components.
7. **Review** visual quality, responsiveness (390px check), accessibility
   (focus rings, semantic HTML, alt text), and consistency.
8. **Report the changes made.**

## Dashboard-first workspace

`/` and `/dashboard` open the original six-card overview. Do not substitute
one tool for the whole site. Keep **Dashboard, Obfuscate, Usages and Vault**
visible in the shared header, including at 320px. `/dashboard/overview` is a
compatibility redirect. Keep real session activity in Usages separate from
the demo analytics in the reference dashboard.

Differentiate the four sections by function, not by adding more navigation.
Dashboard keeps the reference grid and its shortcuts. Obfuscate uses a compact
editable source view, a settings panel and a read-only result after a build;
stack them in this order on phones. Use restrained color for syntax tokens
only. Usages is a totals strip and activity ledger, not demo charts. Vault is
a file and passphrase workbench, not a source editor.

Keep the inset frame, icon rail, two wide charts and four smaller widgets.
The loading state and standalone HTML skeleton share the real grid and funnel
geometry. Expose the existing skeleton and CSV through **Downloads**.

Animate artwork **inside** the cards. Keep metrics, hit targets and outer
bounds steady. Clip shine to the ribbon, move the pie texture as a unit,
and stagger the avatar images. Test pointer, keyboard, touch and viewport
entry. Honor both the session switch and `prefers-reduced-motion`; keep all
information readable with movement off. The Vault illustration belongs in
its file card, not in a page-wide hero. Use actual crypto phases, not fake
progress indicators.

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

## Card design system (solid, no blur)

Use a neutral black/white palette throughout the workspace: a charcoal
outer matte, black canvas, near-black panels, white active tabs and text,
and legible grays for metadata. Convey trends with icons and text, not hue.
Use the shared 15–16px card radius, smaller rounded inputs/buttons and soft
pills for compact tags. Match the source reference's spacing and hierarchy,
not its square registration marks. No frosted overlays or colored glows.

## Icons

- Lucide first, official brand icons where appropriate, custom SVG only when
  nothing suitable exists.
- Every icon must match its actual function. No emojis, no decorative icons
  that add no meaning.
