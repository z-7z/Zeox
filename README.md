# Zeox Vault

A mobile-first, client-side file encryption studio for Luau (`.luau`), Lua
5.1 (`.lua`) and Roblox Studio places/models (`.rbxl`, `.rbxlx`, `.rbxm`,
`.rbxmx`). Both `/` and `/dashboard` open the studio. The UI, font and artwork
are served by the site; no account, file-upload API or crypto service is used.

## Using the studio

1. In **Encrypt**, drop or browse for one file up to 25 MB. **Use sample**
   supplies a small Luau configuration file without reading from your device.
2. Enter and confirm a passphrase of at least 12 characters. Encrypt, then
   **Download .zeox**. Keep the passphrase and your original file safe.
3. In **Decrypt**, select the archive, enter its passphrase and download the
   restored bytes under the original filename. Renaming an archive does not
   change the name restored from inside it.

This is encryption **at rest**, not a runtime script protector. Archives
must be decrypted before use in Studio. Source files are never interpreted,
executed, overwritten or sent to a server. There is no passphrase reset.
The browser needs Web Crypto in a secure context (HTTPS, or localhost for
development). Operations continue to work offline in an already-loaded tab.

The session log holds metadata for the last 30 successful operations in
memory only. Files, passphrases, keys and log entries are not saved to Web
Storage or IndexedDB. A result's object URL is revoked when the result is
discarded or the studio unmounts. Downloads the user saves are ordinary files.

## Archive format v1

See `src/lib/vault/container.ts`. Web Crypto derives a non-extractable AES-256
key from the UTF-8 passphrase using PBKDF2-SHA-256 (600,000 iterations).
Each encryption independently generates a 16-byte salt and 12-byte GCM IV.
The fixed-size 33-byte header is `ZEOX`, version byte `0x01`, salt, IV. All
header bytes are AES-GCM additional authenticated data. The remainder is the
ciphertext followed by its 16-byte authentication tag.

The plaintext payload is a two-byte, big-endian UTF-8 filename length, the
filename, and the **unmodified file bytes**. Version, sizes, restored name
and file type are checked before offering a restored file. Incorrect keys
or tampered ciphertext do not produce a download. The suggested outer name
includes the source name; rename the `.zeox` file if that name is sensitive.

## Interface

`src/pages/VaultStudio.tsx` composes the file workbench, illustrated vault
core, cipher diagram, guide and session log. Visual states track file selection,
actual cryptographic phases and completion. Drag feedback, control transitions,
card entrances and button shine respect `prefers-reduced-motion`; **Motion on**
in the footer can also disable animation for the session.

The previous monochrome analytics dashboard and its offline skeleton / CSV
downloads remain at `/dashboard/overview`. The earlier public site is available
at `/showcase`. Both are loaded separately from the vault. The Guide includes
a link to the previous overview.

## Development & deployment

```bash
npm install
npm run dev             # Vite + React 18 + TypeScript
npm run build           # type-check and create dist/
npx playwright install chromium
npm run test:e2e
```

Set `CHROMIUM_PATH` to use an existing compatible Chromium. Tests cover all
six extensions, UTF-8 filenames, independent decryption of the archive format,
offline round trips, validation and tamper rejection, session state, mobile
motion settings, and the archived dashboard workflows.

Deploy `dist/` to a static HTTPS host. `vercel.json` includes explicit SPA
rewrites, a same-origin content security policy and response headers. Other
hosts should serve `index.html` for the three non-root app routes but keep
assets and `/data/overview.json` as static files. No server secrets are needed.
See `DESIGN_WORKFLOW.md` for design guidance; Inter's license is included in
`public/licenses/Inter-OFL.txt`.
