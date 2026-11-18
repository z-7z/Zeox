# Zeox Workspace

A local, monochrome workspace for Lua source and file protection. It has exactly four destinations in a **vertical left sidebar**. On desktop, the header button hides or restores the rail. On phones, it opens a left-hand drawer; selecting a section, tapping the backdrop or pressing Escape dismisses it. There is no command palette or horizontal tab strip.

| Section | Route | What it does |
| --- | --- | --- |
| **Dashboard** | `/`, `/dashboard` | The reference ribbon and hatched pie above four smaller cards. Inspect the sample charts, see the live session, or open a tool. **Download skeleton** saves the same six-slot loading layout as standalone, script-free HTML. |
| **Obfuscate** | `/obfuscate` | Edit or open a UTF-8 `.lua` / `.luau` script (512 KiB max) with live syntax highlighting. Pick build settings, then preview, copy or download the separate output file. |
| **Usages** | `/usages` | Actual successful source builds, encryptions and decryptions **in this tab**. Counters cover all successful runs; the filterable ledger and CSV contain the last 50 runs, with times and byte counts only. |
| **Vault** | `/vault` | Encrypt and restore Luau, Lua 5.1 and Roblox Studio files byte-for-byte. |

The charts are a **labeled sample**, not telemetry: their fixed values preserve the illustrated export funnel, file mix, dotted input tracks and hourly heatmap even on an empty tab. **This session** (the card with the three original portraits) reads the real Usages ledger and shows up to three recent runs. **Quick actions** opens the editor, Vault, Usages or the offline skeleton; none of these actions simulate an account or a sale.

The former `/dashboard/overview` and `/showcase` URLs redirect to Dashboard. There is no storefront, team/account system, remote analytics or demo sales snapshot.

## Motion and surfaces

The cards use translucent graphite or pearl fills, curved highlight edges and local artwork. Shared material tokens live in `src/components/workspace/material.css`. Browsers without backdrop filtering get solid fills; reduced-transparency and increased-contrast preferences also remove blur. On phones, the charts stack at full width, with the pie beside its legend. The editor scrolls internally and the file picker leaves room for passphrase inputs. The viewport remains zoomable.

The Dashboard's ribbon light, etched pie and portraits move **inside** stationary cards. Continuous artwork pauses offscreen. The sidebar motion switch applies throughout the workspace; the OS reduced-motion preference takes precedence.

## Source tools and local state

The source studio has three panels in reading order: **Source → Build settings → Output file**. Only the input editor is visible before a build. Both code views scroll internally; long files do not grow the page. The CodeMirror editor and Lua/Luau highlighter are bundled with this route. They do not fetch a grammar, run a script, or contact a language server. Use `Ctrl/⌘ Enter` in the editor to build, and `Tab` to leave it. Editing invalidates the old output. **Open file**, **Example** and **Clear** start a fresh undo history.

Obfuscate offers three independent source transformations: express plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. The lexical pass leaves identifiers, existing escapes, bracket strings and entire Luau interpolations alone. It keeps directive comments and copyright/SPDX notices. There is no VM, runtime loader or execution step. This is **not encryption or a guarantee of secrecy**; the output remains source code. For encrypted storage, use Vault.

Changing workspace sections preserves the source draft and completed downloads. Vault clears passphrase inputs when leaving its section. A workspace reload drops tool state, including the Usages counters. Nothing in the workspace reads or writes Web Storage. Dashboard and Usages share the same in-memory counters; neither collects filenames or contents.

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

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. The suite covers rail and drawer navigation, mobile widths, motion/transparency preferences, skeleton and usage CSV downloads, live token styling, editor undo and size limits, source transformations, local usage accounting, and independent decryption / offline round trips for all six Vault file types.

Deploy `dist/` to a static HTTPS host. `vercel.json` rewrites the application routes to `index.html`, serves static assets unchanged, and sets a same-origin content security policy. The font and imagery are served locally. See `DESIGN_WORKFLOW.md` for the design contract and `public/licenses/` for the font and editor notices.
