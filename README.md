# Zeox Workspace

A monochrome, dashboard-first workspace. The four labeled sections are real routes with the same navigation on desktop and phones. All tools run in the browser; no account, upload API or server secret is required.

| Section | Route | What it does |
| --- | --- | --- |
| **Dashboard** | `/`, `/dashboard` | The six-card overview: conversion funnel, hatched order mix, traffic, team, hourly heatmap and quick actions. The figures are a **demo snapshot**, not tool usage. Open **Downloads** for the script-free HTML skeleton or hourly sales CSV. |
| **Obfuscate** | `/obfuscate` | Edit or open a UTF-8 `.lua` / `.luau` script (512 KiB max) with live syntax highlighting. Pick build settings, then preview, copy or download the separate output file. |
| **Usages** | `/usages` | Actual successful source builds, encryptions and decryptions **in this tab**. Counters cover all successful runs; the filterable ledger and CSV contain the last 50 runs, with times and byte counts only. |
| **Vault** | `/vault` | Encrypt and restore Luau, Lua 5.1 and Roblox Studio files byte-for-byte. |

`/dashboard/overview` redirects to Dashboard for existing bookmarks. The earlier product showcase is still at `/showcase`. Open workspace search with `/` or `Ctrl/⌘ K`; use `Esc` to close a dialog.

## Motion and surfaces

The overview preserves the original narrow rail and two wide status cards above four widgets. The cards have soft borders; their **artwork**, not the card hit targets or metrics, moves: light travels along the funnel, the hatched pie gently turns, and the portraits float. Below-the-fold artwork reveals on entry; continuous overview effects pause offscreen. The footer motion switch applies across workspace sections, and the OS reduced-motion preference takes precedence.

## Source tools and local state

The source studio has three panels in reading order: **Source → Build settings → Output file**. Only the input editor is visible before a build. Both code views scroll internally; long files do not grow the page. The CodeMirror editor and Lua/Luau highlighter are bundled with this route. They do not fetch a grammar, run a script, or contact a language server. Use `Ctrl/⌘ Enter` in the editor to build, and `Tab` to leave it. Editing invalidates the old output. **Open file**, **Example** and **Clear** start a fresh undo history.

Obfuscate offers three independent source transformations: express plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. The lexical pass leaves identifiers, existing escapes, bracket strings and entire Luau interpolations alone. It keeps directive comments and copyright/SPDX notices. There is no VM, runtime loader or execution step. This is **not encryption or a guarantee of secrecy**; the output remains source code. For encrypted storage, use Vault.

Changing workspace sections preserves the source draft and completed downloads. Vault clears passphrase inputs when leaving its section. A workspace reload or leaving for the showcase drops tool state, including the Usages counters. No source text, user files, passphrases or tool logs are written to Web Storage. Only separate, explicitly changed dashboard demo settings (team invitations, campaigns, fulfillment and workspace name/activity) use `localStorage`.

## Vault and archive compatibility

1. In **Encrypt**, select one `.luau`, `.lua`, `.rbxl`, `.rbxlx`, `.rbxm` or `.rbxmx` file up to 25 MB (or choose **Use sample**).
2. Set and confirm a passphrase of at least 12 characters; encrypt and download the `.zeox` archive. Keep your passphrase and original safe. There is no recovery mechanism.
3. In **Decrypt**, open that archive, enter the same passphrase and download the original name and bytes. Archives must be restored before use in Roblox Studio. Source and binary assets are opaque to the cipher.

The v1 `.zeox` format is unchanged (`src/lib/vault/container.ts`). PBKDF2-SHA-256 (600,000 iterations) derives a non-extractable AES-256-GCM key. Each archive has a fresh 16-byte salt and 12-byte IV. Its 33-byte authenticated header is `ZEOX`, version `0x01`, salt and IV; the ciphertext ends in a 16-byte authentication tag. The plaintext is a 2-byte big-endian UTF-8 filename length, filename and unmodified file bytes. Incorrect keys and tampering do not yield downloads. The suggested outer archive name includes the original name; it can be renamed without affecting restoration.

Vault needs HTTPS (or localhost) and Web Crypto. Source and Vault operations work offline after their respective pages have loaded. The Vault log keeps metadata including filenames for its last 30 successful operations in memory, separate from the name-free Usages ledger. Object URLs are revoked when discarded.

## Develop, test and deploy

```sh
npm install
npm run dev
npm run build
npx playwright install chromium
npm run test:e2e
```

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. The suite covers routed navigation, mobile widths, motion preferences, data retry and skeleton/CSV downloads, live token styling, editor undo and size limits, source transformations, local usage accounting, and independent decryption / offline round trips for all six Vault file types.

Deploy `dist/` to a static HTTPS host. `vercel.json` rewrites the application routes to `index.html`, serves assets and `/data/overview.json` unchanged, and sets a same-origin content security policy. The font and imagery are served locally. See `DESIGN_WORKFLOW.md` for the design contract and `public/licenses/` for the font and editor notices.
