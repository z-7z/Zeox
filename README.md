# Zeox — zeox.xyz

Premium developer tools and script protection ecosystem. This repository contains the
initial frontend: the **public landing page** and the **dashboard overview**.

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

## Notes

- All data is mock/prototype data. No backend, no Supabase, no OAuth, no payments.
- The Zeox logo is rendered as a vector component in `src/components/ZeoxLogo.tsx`.
  To use the official PNG instead, place it at `src/assets/zeox-logo.png` and swap
  the `<svg>` for an `<img />` in that component.
