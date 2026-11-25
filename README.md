# Zeox Obfuscator

Zeox opens directly into a **file-only Lua / Luau obfuscator**. Attach one script, choose source transformations, and download the new file. The browser does the work; there is no editor, account or upload. The Zeox mark always takes you back to this tool.

The **left sidebar** switches between Obfuscator, Vault, Usages and Dashboard. Double chevrons fold the desktop menu into an icon rail; point to an icon or focus it with the keyboard to see its name. The violet, pink and red dots jump to **Source file**, **Build settings** and **Build output**. A phone starts with just the rail: expand it to see the names over the page, then pick a link, tap outside or press Escape. Navigation and folding keep the current file in this tab.

**Find a tool** (`Ctrl`/`⌘` + `K`) searches the four destinations. **Help** explains the file flow and shortcuts; **Settings** shows session information, motion and optional full-screen controls.

| Section | Route | What it does |
| --- | --- | --- |
| **Obfuscator** | `/`, `/obfuscate` | Attach one UTF-8 `.lua` or `.luau` file (512 KiB max), choose settings, build on device and download a separate copy. |
| **Vault** | `/vault` | Encrypt or restore files locally. After a successful decrypt, get a cleaned script or a static EXF reading when supported, alongside the exact original. |
| **Usages** | `/usages` | Actual successful builds, encryptions and decryptions in this tab. Counters cover all successful runs, the plot pairs input/output bytes for the last 16, and the filterable ledger and CSV cover the last 50. |
| **Dashboard** | `/dashboard` | An optional sample report with throughput, recent batches and shortcuts. **Skeleton** downloads the eight-card layout as standalone HTML. |

## Reading the desk

The Dashboard plots a **dated sample**, not uploads from your device. Both the 7- and 30-day windows end May 15, 2026 (UTC). The white trace shows rolling 24-hour input volume from eight-hour samples; its daily closes are the values in the detail table. Compare against the previous window using the green change chips. Point, tap, or focus the chart and use the arrow, Home and End keys to inspect a day. The date rail follows the available plot width. The colored traces, dot index and columns follow the selected period. **This session** alone reads the real Usages ledger. No accounts, financial balances or remote analytics are simulated. `/dashboard/overview` and `/showcase` redirect to Dashboard.

On desktop the throughput, batch tape and action dock share the upper row. The green output card and format columns span the two lower rows. On a phone the trace spans the content column and actions form a horizontal row. When two cards no longer fit beside the rail, the tiles stack. The file stations put intake first in portrait; the two Vault steps sit beside one another in short landscape windows. The page scrolls naturally, including at browser zoom. Keyboard focus, motion preferences and safe-area padding apply throughout.

Shared palette, spacing and opaque surfaces live in `src/components/workspace/material.css`; `workspace.css` owns the shell, `sidebar.css` the navigation, and `panels.css` the station and ledger grids. `src/components/dashboard/layout.css` supplies the grid for the live Dashboard, its loading state and the script-free offline export. `src/components/source/layout.css` reserves the source masthead and three tool panels on both home URLs, including during a cold load. All skeletons are static; chart fills are not glass, glows or moving light effects.

## Source tools and local state

**Attach → Build → Save:** choose or drop one local script. The page starts empty. Three named **Build settings** sit beside the attachment on desktop and below it on phones. A valid attachment shows its name, format and size and enables **Obfuscate file**. The result is a downloadable `.obf.lua` / `.obf.luau` (or `.compact.*` without text encoding), not another code pane. Removing/replacing the attachment or changing a setting clears the previous output. Invalid files produce an inline error without replacing a valid attachment. No source is uploaded, displayed or executed; there is no sample input or account requirement.

Obfuscate offers three independent source transformations: express plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. The lexical pass leaves identifiers, existing escapes, bracket strings and entire Luau interpolations alone. It keeps directive comments and copyright/SPDX notices. There is no VM, runtime loader or execution step. This is **not encryption or a guarantee of secrecy**; the output remains source code. For encrypted storage, use Vault.

Changing workspace sections preserves the attached script and completed downloads. Vault clears passphrase inputs when leaving its section. A workspace reload drops tool state, including the Usages counters. Nothing in the workspace reads or writes Web Storage. Dashboard and Usages share the same in-memory counters; neither collects filenames or contents.

## Vault: restore and automatic cleanup

1. In **Encrypt**, select one `.luau`, `.lua`, `.rbxl`, `.rbxlx`, `.rbxm` or `.rbxmx` file up to 25 MB (or choose **Use sample**). Vault also accepts partial listing exports named `*.partial.lua.txt` / `*.partial.luau.txt`, including numbered copies such as `level.partial.lua (2).txt`. Other `.txt` files are not accepted.
2. Set and confirm a passphrase of at least 12 characters; encrypt and download the `.zeox` archive. Keep your passphrase and original safe. There is no recovery mechanism.
3. In **Decrypt**, open a `.zeox` archive, enter the same passphrase and press **Decrypt file**. After authentication and filename validation, Vault **automatically** cleans supported text in this tab. No second upload, command or settings change is needed. **Download original** always returns the stored name and bytes. Roblox assets must be restored before use in Studio.

| Restored file | Result in addition to the original |
| --- | --- |
| UTF-8 Lua / Luau, up to 1 MiB | **Download cleaned file** (`*.clean.lua` / `*.clean.luau`). Removes ordinary comments and redundant whitespace, retains line indentation, shebangs, directives and license notices, and makes fully decimal-escaped printable UTF-8 strings readable when safe. No symbol renaming or statement reordering in source. If nothing changes, Vault says so instead of offering two identical files. |
| EXF v12 compact partial listing, up to 1 MiB | **Download reading** (`*.reading.txt`). Groups visible calls, writes and returns by prototype, puts referenced helpers first when possible, and folds register setup, labels, jumps and decoy diagnostics into expressions or counts. Names come from visible lookups; line numbers refer to the original. `?` means a value, binding or arity is unknown. This is **not executable Lua**: it does not infer missing paths or bypass the entry guard. |
| Studio place/model (including XML), binary/non-UTF-8 script, oversized script, or unsupported/incomplete listing | Original only, with a reason. A cleanup failure does not turn a successful restore into an error. |

Vault never executes the restored file. A reading may be smaller than a VM listing because it doesn't repeat dispatch scaffolding; that does **not** prove the hidden operations have no effects. Each decrypt records one operation and the original restored byte count, not another operation for the derived copy.

The v1 `.zeox` format is unchanged (`src/lib/vault/container.ts`). PBKDF2-SHA-256 (600,000 iterations) derives a non-extractable AES-256-GCM key. Each archive has a fresh 16-byte salt and 12-byte IV. Its 33-byte authenticated header is `ZEOX`, version `0x01`, salt and IV; the ciphertext ends in a 16-byte authentication tag. The plaintext is a 2-byte big-endian UTF-8 filename length, filename and unmodified file bytes. Incorrect keys and tampering do not yield downloads. The suggested outer archive name includes the original name; it can be renamed without affecting restoration.

Vault needs HTTPS (or localhost) and Web Crypto. Source and Vault operations work offline after their respective pages have loaded. The Vault log keeps metadata including filenames for its last 30 successful operations in memory, separate from the name-free Usages ledger. Object URLs are revoked when discarded.

### Optional: reading an already-decrypted EXF listing without Vault

For a compact v12 listing already on disk, the Node 18+ CLI uses the **same reading pass** and refuses to overwrite anything. It is not a step in the Vault workflow.

```sh
node tools/read-exf.mjs "sample.partial.lua.txt" "sample.reading.txt"
node --test tools/read-exf.test.mjs
```

## Develop, test and deploy

```sh
npm install
npm run dev
npm run build
npx playwright install chromium
npm run test:e2e
```

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. The suite checks edge-to-edge desktop layouts up to 2560px, icon-only accessible navigation, opaque surfaces, sample-period changes and chart inspection across direct routes, and covers the compact tool picker, mobile widths, motion/transparency preferences, skeleton and usage CSV downloads, keyboard file selection, drag/drop, validation and replacement, download bytes and size limits, source transformations, local usage accounting, and independent decryption, offline round trips, automatic cleanup and byte-identical original downloads.

Deploy `dist/` to a static HTTPS host. `vercel.json` rewrites the application routes to `index.html`, serves static assets unchanged, and sets a same-origin content security policy. The font and imagery are served locally. See `DESIGN_WORKFLOW.md` for the design contract and `public/licenses/` for the font license.
