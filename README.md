# Zeox Workspace

A local workspace for Lua source and file protection. Its matte canvas fills the browser viewport at every size; there is no framed desktop mockup, width cap, glass, shine or blur. A **vertical icon rail** on the left contains four named links. The header button hides/restores it, or opens the same icon rail as a modal drawer on phones. Current-page state, native hover titles, keyboard focus and Escape/backdrop dismissal work without visible navigation labels. An optional desktop full-screen button uses the browser API only when available and explicitly requested.

| Section | Route | What it does |
| --- | --- | --- |
| **Dashboard** | `/`, `/dashboard` | A three-metric strip above an inspectable daily volume chart. A segmented file gauge, saved-file meter, actions, live session summary and operation mix complete the report. **Download skeleton** saves this layout as static, offline HTML. |
| **Obfuscate** | `/obfuscate` | Attach one UTF-8 `.lua` or `.luau` script (512 KiB max), build it on device, and download a separate file. No paste box, code editor or source preview. |
| **Usages** | `/usages` | Actual successful source builds, encryptions and decryptions **in this tab**. Counters cover all successful runs; the filterable ledger and CSV contain the last 50 runs, with times and byte counts only. |
| **Vault** | `/vault` | Encrypt and restore Luau, Lua 5.1 and Roblox Studio files byte-for-byte. |

The header marks the charts as **sample data**. The 7- and 30-day windows end May 15, 2026; the period picker updates the dates, comparisons, charts and detail tables together. Point at the volume chart or use the arrow, Home and End keys when focused. **This session** is separate: its count and up to three recent runs come from Usages in this tab. Quick actions open the real tools. There are no simulated accounts, sales or remote analytics. `/dashboard/overview` and `/showcase` redirect to Dashboard.

## Layout and surfaces

The desktop reference is a continuous report, not a grid of floating cards. The collapsible 68px rail, top toolbar, full-width content and right inspector use opaque fills and hairline dividers. Source, Vault and Usages use the same desktop columns as Dashboard, with file requirements, cipher status or an operation breakdown in the side pane. At narrow widths the report stacks, file actions stay reachable, and the rail is normally closed. Browser zoom, native scrolling, safe-area insets and forced colors remain supported.

`workspace/material.css` owns the matte tokens; `workspace/workspace.css` owns the viewport shell. `workspace/panels.css` supplies tool surfaces and controls; `dashboard/layout.css` is shared by the real report, its lazy fallback and its offline export. Skeletons are static. The motion switch and the OS reduced-motion preference control interface transitions; neither enables lighting or other glass effects.

## Source tools and local state

**Attach → Build → Save:** choose or drop one local script. The page starts empty, with the optional **Build settings** folded away. A valid attachment shows its name, format and size and enables **Obfuscate file**. The result is a downloadable `.obf.lua` / `.obf.luau` (or `.compact.*` without text encoding), not another code pane. Removing/replacing the attachment or changing a setting clears the previous output. Invalid files produce an inline error without replacing a valid attachment. No source is uploaded, displayed or executed; there is no sample input or account requirement.

Obfuscate offers three independent source transformations: express plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. The lexical pass leaves identifiers, existing escapes, bracket strings and entire Luau interpolations alone. It keeps directive comments and copyright/SPDX notices. There is no VM, runtime loader or execution step. This is **not encryption or a guarantee of secrecy**; the output remains source code. For encrypted storage, use Vault.

Changing workspace sections preserves the attached script and completed downloads. Vault clears passphrase inputs when leaving its section. A workspace reload drops tool state, including the Usages counters. Nothing in the workspace reads or writes Web Storage. Dashboard and Usages share the same in-memory counters; neither collects filenames or contents.

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

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. The suite checks edge-to-edge desktop layouts up to 2560px, icon-only accessible navigation, opaque surfaces, sample-period changes and chart inspection across direct routes, and covers rail and drawer navigation, mobile widths, motion/transparency preferences, skeleton and usage CSV downloads, keyboard file selection, drag/drop, validation and replacement, download bytes and size limits, source transformations, local usage accounting, and independent decryption / offline round trips for all six Vault file types.

Deploy `dist/` to a static HTTPS host. `vercel.json` rewrites the application routes to `index.html`, serves static assets unchanged, and sets a same-origin content security policy. The font and imagery are served locally. See `DESIGN_WORKFLOW.md` for the design contract and `public/licenses/` for the font license.
