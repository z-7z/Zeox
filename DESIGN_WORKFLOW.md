# Zeox AI Design Workflow

This document defines the reusable workflow for changing Zeox interfaces. It combines the Skeleton Download System, vendored AI Design Skills, and the solid-card design system.

## Workflow

1. Inspect the current project structure and preserve unrelated working code.
2. Review the active tokens in `src/index.css` and `tailwind.config.js` before adding colors or surfaces.
3. Read relevant vendored design skills. Read `skills/landing-page-design/SKILL.md` before landing-page or component design work; adapt its guidance rather than copying a template.
4. Inspect available skeletons only when a suitable approved skeleton is needed.
5. Select layout patterns that fit each page; do not repeat the same card grid everywhere.
6. Reuse shared components where they improve consistency without flattening distinct page roles.
7. Review visual quality, the 390px layout, keyboard focus, semantics, and reduced-motion behavior.
8. Summarize shipped changes and validation.

## Skeleton Download System

Location: `src/lib/skeleton/`.

- Sources: GitHub repositories (`{ kind: 'github', owner, repo, ref?, subdirectory? }`).
- Flow: `download()` → temporary workspace → `inspect()` → `planImport()` → resolve conflicts → `import()` → `cleanup()`.
- Keep downloaded skeletons isolated from production code. Inspect their structure before import, never overwrite an existing file without an explicit resolution, and review dependencies before installing them.
- Downloaded files are not executed automatically. `cleanup()` only discards the temporary workspace.

## Current design system

### Surfaces

| Token | Value | Use |
|---|---|---|
| Main background | `#000000` | OLED page background |
| Secondary background | `#06090B` | navigation, sidebar, footer |
| Standard surface | `#080C0E` | `.card` and panels |
| Elevated surface | `#0C1215` | hover and raised content |
| Subtle border | `#1E292E` | card and section boundaries |

### Accents

Purple and violet are not part of the current Zeox palette. Use cyan `#5CD4E6` for system/data highlights, orange `#FF9150` for primary actions, and pale rose `#F2A6C7` sparingly for secondary distinctions. Keep main copy soft-neutral `#E6ECEE`; avoid large white blocks and all high-intensity glow.

### Surface roles

- **Stat strip**: compact values and labels separated by dividers, not one card per value.
- **Service row**: icon, service name, concise description, and a clear action.
- **Status row**: one meaningful status marker and concise technical metadata.
- **Data table**: dense, aligned rows with restrained hover feedback.
- **Account card**: plan, renewal, credit usage, and manage action when needed.

Avoid backdrop blur, frosted glass, excessive transparency, diffuse shadows, and repeated rounded card grids. Prefer flat black surfaces, thin separators, moderate corner radii, and purposeful use of accent color.

## Icons and motion

- Use Lucide icons where their function is clear. Avoid emoji or decorative icons without meaning.
- Interactive elements need hover, active, and visible focus states. Respect `prefers-reduced-motion` and limit animation to opacity/transform.
