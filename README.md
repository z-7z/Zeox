# ZeoxFucator

**ZeoxFucator is a browser-based Lua Obfuscator for Lua and Luau.** Choose one script, encode plain quoted strings, strip ordinary comments or compact whitespace, then download the transformed copy. The browser reads the file locally; it never uploads or executes the script.

## Start a script build

1. Open **Main** (`/`). The before/after example uses the actual source pass on a bundled Luau snippet. The guide shows the real build settings and explains what obfuscation can and cannot do.
2. Choose **Obfuscate a script → Continue as guest**. The independent `/login` page opens the Dashboard without asking for an email or password.
3. On **Dashboard**, choose **Obfuscate a script**. Attach one UTF-8 `.lua` or `.luau` file (up to 512 KiB), choose the transforms and select **Obfuscate file → Download file**. Your original is unchanged.

| Route | Function |
| --- | --- |
| `/` (`/main` redirects here) | Public product introduction, illustrated obfuscation guide and FAQ. |
| `/login` | Guest preview entry. No account or credentials. |
| `/dashboard` | Start or resume a build. The current script, transform settings and completed script count come from this tab. A collapsed **Sample report** illustrates script builds for 7 or 30 days ending May 15, 2026 (UTC), separately from the guest session. `/dashboard/overview` and `/showcase` redirect here. |
| `/obfuscate` | Attach, configure, build and download the script. |
| `/usages` | View, filter, export or clear the current tab’s operation metadata. Totals cover all successes; the ledger and CSV cover the last 50. |
| `/encrypt` (`/vault` redirects here) | Separate, optional passphrase-protected archive and restore page. No permanent Encryption tab. |

## Public site and guest workspace

Main and login use public navigation. Neither page renders the workspace rail, phone dock, finder, inbox or file picker. **Main → Log in → Dashboard** is the default path for a fresh visitor. A direct workspace bookmark pauses at login, then resumes only a known internal page (including its search/hash). Old root links to `#source-file`, `#build-settings` and `#build-output` still open the corresponding section at `/obfuscate`.

**This is a guest preview, not account authentication.** A single non-secret `sessionStorage` marker (`zeoxfucator:preview = guest`) remembers entry on refresh. If storage is unavailable, the preview works in memory until reload. There is no external return target. The marker must never be used to grant access to private server data.

Only guests mount the file controllers. The desktop rail contains Obfuscator, Usages, Dashboard and Help; phones have the same four items in a single bottom row, including in landscape. The wordmark returns to the public site; an active guest can resume Dashboard without losing in-memory work. **Local workspace information → End guest session** removes the marker and discards the files, results and ledger.

The site is edge to edge, with no outer window or fullscreen request. The theme applies to both layouts; workspace cards are black in dark mode and white in light mode. The choice resets to dark on reload. Fonts and images ship with the site. **Ctrl/⌘ K** finds workspace pages and **Esc** closes a utility dialog. Dropdowns, switches, the passphrase slider and disclosures are site-styled; the upload button opens the real operating-system file chooser.

## Source files and local state

Choose or drop a single script. The options encode plain quoted strings as three-digit Lua byte escapes, remove ordinary comments and compact whitespace. Identifiers, existing escapes, bracket strings, Luau interpolations, directive comments and copyright/SPDX notices are preserved. This is source transformation, not encryption or a guarantee of secrecy.

**Obfuscate file** produces a downloadable `.obf.lua` or `.obf.luau` (`.compact.*` when text encoding is off). Removing or replacing the attachment, or changing an option, clears the old result. A rejected replacement does not discard the last valid script. Nothing executes the script or displays its contents.

Navigating between pages preserves attachments and results in tab memory. Leaving the encryption page clears its passphrase inputs, including generated values. Reloading the page clears the file sessions and usage counts. No files, passphrases, results or usage data are written to Web Storage or a server.

## Optional file encryption, download and restore

The link below the Obfuscator’s encoding reference opens the separate archive page. Encryption is not a source transform: restore the archive before using its contents. **Encrypt** uses three numbered cards, in the same order on desktop and phone:

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

`CHROMIUM_PATH` can point Playwright at a compatible local Chromium. Tests cover the separation of public and workspace layouts, guest entry/exit, bookmarked routes, local-only session data, the before/after example, the end-to-end obfuscation journey, the file chooser, drag and drop, validation, offline builds, edge-to-edge layout, responsive navigation, card colors in both appearances, keyboard/touch selection and passphrase length, utility dialogs, stage-bound progress and download skeletons, archive options, chart controls, CSV export, independent archive verification, automatic cleanup and exact original downloads.

Deploy `dist/` to a static HTTPS host. `vercel.json` routes direct page URLs to `index.html` and sets a same-origin content security policy.
