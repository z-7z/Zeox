# Zeox Workspace

Zeox is a local workspace for Lua scripts and encrypted file archives. The dark **signal desk** fills the window: an icon-only rail on the left, a short utility bar, and a close-set grid of rounded instrument cards. The orange icon marks the active route. Hide the rail for more room, or open it as a drawer on a phone. **Find a tool** (`Ctrl`/`⌘` + `K`) searches the four real routes; the session badge explains what stays in this tab. Full screen is optional and only requested on a button press.

| Section | Route | What it does |
| --- | --- | --- |
| **Dashboard** | `/`, `/dashboard` | Inspect throughput and recent sample batches, compare saved and unexported files, open operation/format details, and jump to a tool. **Skeleton** in the action dock downloads the eight-card layout as standalone HTML. |
| **Obfuscate** | `/obfuscate` | Attach one UTF-8 `.lua` or `.luau` script (512 KiB max), choose settings, build on device and download a separate file. No paste box, editor or source preview. |
| **Usages** | `/usages` | Actual successful builds, encryptions and decryptions in this tab. Counters cover all successful runs, the plot pairs input/output bytes for the last 16, and the filterable ledger and CSV cover the last 50. |
| **Vault** | `/vault` | Encrypt or restore Luau, Lua and Roblox Studio assets, see the active processing stage, read the format guide and inspect the local session log. |

## Reading the desk

The Dashboard plots a **dated sample**, not uploads from your device. Both the 7- and 30-day windows end May 15, 2026 (UTC). The white trace shows rolling 24-hour input volume from eight-hour samples; its daily closes are the values in the detail table. Compare against the previous window using the green change chips. Point, tap, or focus the chart and use the arrow, Home and End keys to inspect a day. The date rail follows the available plot width. The colored traces, dot index and columns follow the selected period. **This session** alone reads the real Usages ledger. No accounts, financial balances or remote analytics are simulated. `/dashboard/overview` and `/showcase` redirect to Dashboard.

On desktop the throughput, batch tape and action dock share the upper row. The green output card and format columns span the two lower rows. On a phone the trace gets both columns, outputs sit beside the batch list, and actions form a horizontal row. The file stations put intake first in portrait; the two Vault steps sit beside one another in short landscape windows. The page scrolls naturally, including at browser zoom. Keyboard focus, motion preferences and safe-area padding apply throughout.

Shared palette, spacing and opaque surfaces live in `src/components/workspace/material.css`; `workspace.css` owns the shell and `panels.css` the station and ledger grids. `src/components/dashboard/layout.css` supplies the grid for the live Dashboard, its loading state and the script-free offline export. All skeletons are static; chart fills are not glass, glows or moving light effects.

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
