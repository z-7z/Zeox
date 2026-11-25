# ZeoxFucator

A local file studio: build a separate Lua/Luau script or protect a file in a passphrase-encrypted archive. No account, server upload or editor is involved.

| Route | Function |
| --- | --- |
| `/`, `/obfuscate` | Build one UTF-8 `.lua` or `.luau` script (512 KiB max). |
| `/encrypt` (also accessible from the old `/vault` link) | Encrypt or restore a file. An authenticated restore offers the exact original and, when available, a cleaned script or static reading. |
| `/usages` | View, filter, export or clear the current tab's operation metadata. Totals cover all successes; the ledger and CSV cover the last 50. |
| `/dashboard` | Read a separate dated sample report for 7 or 30 days ending May 15, 2026 (UTC). `/dashboard/overview` and `/showcase` redirect here. |

## Workspace

ZeoxFucator extends edge to edge on every route, without an outer window, letterboxing or a browser fullscreen request. Desktop navigation is a vertical rail on the left. On phones the same links and Help form a single labeled row fixed to the bottom, including in landscape. Search tools with **Ctrl/⌘ K**; **Esc** closes a utility dialog. The appearance switch changes the surrounding workspace and resets to dark on reload. All four tools use the Dashboard’s white cards, dark card text, underlined headings and pill buttons in either appearance. Fonts, icons and chart surfaces ship with the app; no external font or chart service is needed.

The archive-name, report-period and usage-filter menus are site-styled listboxes with keyboard, touch and focus support. Switches, segmented controls, the passphrase length slider and disclosures share site styles; the upload button still opens the real operating-system file chooser.

The start page puts a single file chooser, the three source transforms and the download together. Its **File encryption** link opens a separate tool, not a dashboard widget. A collapsible encoding reference illustrates a bundled string, never the attached script. Usages is the real session ledger; Dashboard is a separate dated sample report.

## Source files and local state

Choose or drop a single script. The options encode plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. Identifiers, existing escapes, bracket strings, Luau interpolations, directive comments and copyright/SPDX notices are preserved. This is source transformation, not encryption or a guarantee of secrecy.

**Obfuscate file** produces a downloadable `.obf.lua` or `.obf.luau` (`.compact.*` when text encoding is off). Removing or replacing the attachment, or changing an option, clears the old result. A rejected replacement does not discard the last valid script. Nothing executes the script or displays its contents.

Navigating between tools preserves attachments and results in tab memory. Leaving the encryption page clears its passphrase inputs, including generated values. Reloading the page clears the tool sessions and usage counts. There is no Web Storage or server-side ledger.

## File encryption, download and restore

**Encrypt** uses three numbered cards, in the same order on desktop and phone:

1. **Choose a file.** Upload or drop one `.luau`, `.lua`, `.rbxl`, `.rbxlx`, `.rbxm` or `.rbxmx` file up to 25 MB (or choose **Use sample**). The tool also accepts partial listings named `*.partial.lua.txt` / `*.partial.luau.txt`, including numbered copies such as `level.partial.lua (2).txt`. Other `.txt` files are not accepted.
2. **Set a passphrase.** Enter at least 12 characters and confirm them. Alternatively, **Generate** opens a local generator: set the length (16–64 characters, default 24), then **Generate & use**, save the passphrase and confirm it. Optional **Archive options** let you choose the outer filename or verify the new archive before download. Press **Encrypt file**.
3. **Download your archive.** The card shows actual processing stages (read, derive key, encrypt, optional verification, prepare download), with a reduced-motion-aware skeleton only while working. Web Crypto does not expose within-stage percentages. **Download .zeox** appears only when the blob URL exists. Failed jobs have no download. Keep the passphrase; there is no password reset.

To restore a file, choose **Decrypt**, attach a `.zeox` archive, enter its passphrase and press **Decrypt file**. After authentication and filename validation, the tool **automatically** cleans supported text in this tab. No second upload, command or settings change is needed. **Download original** always returns the stored name and bytes. Roblox assets must be restored before use in Studio.

| Restored file | Result in addition to the original |
| --- | --- |
| UTF-8 Lua / Luau, up to 1 MiB | **Download cleaned file** (`*.clean.lua` / `*.clean.luau`). Removes ordinary comments and redundant whitespace, retains line indentation, shebangs, directives and license notices, and makes fully decimal-escaped printable UTF-8 strings readable when safe. No symbol renaming or statement reordering in source. If nothing changes, the tool says so instead of offering two identical files. |
| EXF v12 compact partial listing, up to 1 MiB | **Download reading** (`*.reading.txt`). Groups visible calls, writes and returns by prototype, puts referenced helpers first when possible, and folds register setup, labels, jumps and decoy diagnostics into expressions or counts. Names come from visible lookups; line numbers refer to the original. `?` means a value, binding or arity is unknown. This is **not executable Lua**: it does not infer missing paths or bypass the entry guard. |
| Studio place/model (including XML), binary/non-UTF-8 script, oversized script, or unsupported/incomplete listing | Original only, with a reason. A cleanup failure does not turn a successful restore into an error. |

The encryption tool never executes the restored file. A reading may be smaller than a VM listing because it doesn't repeat dispatch scaffolding; that does **not** prove the hidden operations have no effects. Each decrypt records one operation and the original restored byte count, not another operation for the derived copy.

The v1 `.zeox` format is unchanged (`src/lib/vault/container.ts`). PBKDF2-SHA-256 (600,000 iterations) derives a non-extractable AES-256-GCM key. Each archive has a fresh 16-byte salt and 12-byte IV. Its 33-byte authenticated header is `ZEOX`, version `0x01`, salt and IV; the ciphertext ends in a 16-byte authentication tag. The plaintext is a 2-byte big-endian UTF-8 filename length, filename and unmodified file bytes. Incorrect keys and tampering do not yield downloads. By default the suggested archive name includes the original name. Choosing a neutral name, or renaming the archive later, does not affect restoration.

File encryption needs HTTPS (or localhost) and Web Crypto. Source and encryption operations work offline after their respective pages have loaded. The encryption log keeps metadata including filenames for its last 30 successful operations in memory, separate from the name-free Usages ledger. Object URLs are revoked when discarded.

### Optional: reading an already-decrypted EXF listing without the web tool

For a compact v12 listing already on disk, the Node 18+ CLI uses the **same reading pass** and refuses to overwrite anything. It is not a step in the encryption workflow.

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

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. Tests cover the file chooser, drag and drop, validation, offline builds, edge-to-edge layout, responsive navigation, white cards in both appearances, keyboard/touch selection and passphrase length, utility dialogs, stage-bound progress and download skeletons, archive options, chart controls, CSV export, independent archive verification, automatic cleanup and exact original downloads.

Deploy `dist/` to a static HTTPS host. `vercel.json` routes direct tool URLs to `index.html` and sets a same-origin content security policy.
