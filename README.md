# Zeox — zeox.xyz

React 18, TypeScript and Vite frontend for the Zeox public site and workspace.
Tailwind CSS is used on the landing page; the dashboard has its own scoped
monochrome design system and uses Lucide icons.

## Run locally

```bash
npm install
npm run dev             # / is the public site; /dashboard is the workspace
npm run dev:dashboard   # optional preview that opens the workspace from /
npm run build           # type-check and create a production build in dist/
```

`vercel.json` rewrites `/dashboard` to `/index.html` so direct visits and
refreshes load the workspace. On other static hosts configure the same
rewrite. Serve `/data/overview.json` and the assets as normal static files.

## Dashboard overview

The desktop layout follows the supplied reference: a narrow icon rail, compact
header, two status cards and four smaller widgets on a charcoal canvas.
It reflows into two columns on tablets and one on phones. Inter, the three
avatar illustrations and both SVG charts are served locally; there are no
chart-library or external asset requests.

- **Purchase funnel:** continuous layered ribbon, four stage totals and shares.
- **Orders:** five hatched pie sectors, linked legend highlights and channel details.
- **Traffic, team, hourly sales, quick actions:** segmented traffic bars, an
  invitation empty state, a 7 × 24 sales heatmap and working action controls.
- **Command menu:** press `/`, `Ctrl+K` or `⌘K`; navigate with the arrow keys
  and Enter. Escape closes dialogs and restores focus to the activating control.
- **Workspace actions:** save draft campaigns, prepare invitations, rename
  the workspace and mark sample orders fulfilled. These changes persist on
  this device using `localStorage`. No emails, ads or shipping requests are sent.

All metrics come from the local demonstration fixture `public/data/overview.json`.
The charts, detail tables and 168 hourly rows in the sales CSV use that same
snapshot. A failed fetch displays a retry action. No backend or credentials
are required.

## Skeleton download & shine

The loading state uses six card-shaped placeholders with the same responsive
grid as the loaded dashboard. It is tied to the actual snapshot request, not
a simulated progress timer. The quiet loading shimmer and card-hover shine
are disabled by `prefers-reduced-motion`.

Open **Downloads → Download skeleton** from the rail (or search for
“Download skeleton”). `zeox-overview-skeleton.html` contains the actual
loading component's markup, layout CSS and animation. It works offline with
no scripts, dependencies or external template imports. **Export sales**
downloads `zeox-hourly-sales.csv`.

Components and styles live in `src/components/dashboard/`; `src/pages/Dashboard.tsx`
composes the workspace. The public page keeps its existing route and links to
the real workspace through a lightweight preview thumbnail.

## Browser tests

```bash
npx playwright install chromium
npm run test:e2e
```

The suite covers loading and error states, chart details, focus restoration,
local invitations, both downloads and the 390px reduced-motion layout. Set
`CHROMIUM_PATH` to use an existing compatible Chromium executable instead.

See `DESIGN_WORKFLOW.md` for the project's design guidance. The self-hosted
Inter font's license is in `public/licenses/Inter-OFL.txt`.
