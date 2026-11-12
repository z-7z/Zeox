# Zeox AI Design Workflow

This document defines the reusable workflow for any AI (or human) changing
Zeox interfaces. It combines the Skeleton Download System, vendored AI Design
Skills, and the solid card design system.

## Workflow (run in order, every time)

1. **Inspect the current project structure.** Read `README.md`, `src/`, and
   the component inventory before touching anything. Preserve unrelated
   working code.
2. **Understand the existing Zeox design system.** Surfaces, accents, and
   card roles are defined in `src/index.css` and `tailwind.config.js`.
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
6. **Create the interface using the existing architecture.** Reuse
   `GlassCard`, `StatCard`, `StatusCard`, `ServiceCard`, `AccountCard`,
   `ActivityItem`, and the `.card` / `.card-elevated` surfaces.
7. **Review** visual quality, responsiveness (390px check), accessibility
   (focus rings, semantic HTML, alt text), and consistency.
8. **Report the changes made.**

## Skeleton Download System

Location: `src/lib/skeleton/`. See its JSDoc for the full API.

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

Approved surfaces:

| Token | Value | Use |
|---|---|---|
| Main background | `#000000` | page background |
| Secondary background | `#050507` | nav bars, sidebar, footer |
| Standard card | `#101014` | `.card` |
| Elevated card | `#15141B` | `.card-elevated` |
| Subtle border | `#292333` | all card borders |

Accents: purple `#8B5CF6` dominant, violet `#A855F7`, lavender `#C4B5FD`,
orange `#FF7411` and `#FF963D` used selectively.

Card roles (each has its own identity, never identical):

- **StatCard**: value first, small icon, no decoration. Flat `.card`.
- **ServiceCard**: icon header, name, description, clear action. `.card-elevated`.
- **StatusCard**: colored left edge encodes state (green/yellow/red), animated
  dot, technical metadata.
- **AccountCard**: plan, renewal, credit usage bar, manage action.
- **ActivityItem**: rows inside a shared list card, timestamps and status.

Banned on cards: backdrop-filter blur, frosted glass, excessive transparency,
glow, large diffuse shadows, extra glass layers.

## Icons

- Lucide first, official brand icons where appropriate, custom SVG only when
  nothing suitable exists.
- Every icon must match its actual function. No emojis, no decorative icons
  that add no meaning.
