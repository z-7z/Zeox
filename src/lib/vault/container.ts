import { cleanRestoredFile, partialListingName, type Cleanup } from './cleanup';

/** The archive codec treats all source files as opaque bytes. */
export type Mode = 'encrypt' | 'decrypt';
export type Phase = 'reading' | 'deriving' | 'sealing' | 'restoring' | 'cleaning' | 'verifying';
export interface OutputFile { blob: Blob; name: string }
export interface VaultResult extends OutputFile { cleanup?: Cleanup }
export const FORMATS = [
  { name: 'Luau', extensions: ['.luau'], description: 'Luau source scripts' },
  { name: 'Lua 5.1', extensions: ['.lua'], description: 'Lua source scripts' },
  { name: 'Roblox', extensions: ['.rbxl', '.rbxlx', '.rbxm', '.rbxmx'], description: 'Studio places and models, binary or XML' },
] as const;
const extensions = FORMATS.flatMap(f => [...f.extensions]);
// File pickers cannot express numbered .partial.lua (2).txt exports. Filter
// these precisely in safeSourceName; do not accept arbitrary .txt archives.
export const SOURCE_ACCEPT = [...extensions, '.txt'].join(',');
export const MAX_BYTES = 25_000_000;
const MAGIC = [0x5a, 0x45, 0x4f, 0x58, 1]; // ZEOX, format version 1
const SALT_SIZE = 16, IV_SIZE = 12, TAG_SIZE = 16, MAX_NAME = 1024;
const HEADER_SIZE = MAGIC.length + SALT_SIZE + IV_SIZE;
export const MAX_ARCHIVE = HEADER_SIZE + TAG_SIZE + 2 + MAX_NAME + MAX_BYTES;
const encoder = new TextEncoder();

export const cryptoAvailable = () => window.isSecureContext && !!globalThis.crypto?.subtle;
export function formatSize(bytes: number) {
  if (bytes < 1000) return `${bytes} B`;
  if (bytes < 1_000_000) return `${(bytes / 1000).toFixed(1)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}
function safeSourceName(name: string) {
  return !!name && !/[\\/\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/u.test(name)
    && encoder.encode(name).length <= MAX_NAME && (extensions.some(ext => name.toLowerCase().endsWith(ext)) || partialListingName.test(name));
}
export function validateFile(file: File, mode: Mode): string | null {
  if (mode === 'encrypt') {
    if (!safeSourceName(file.name)) return 'Choose a .luau, .lua, .partial.lua.txt, .partial.luau.txt, .rbxl, .rbxlx, .rbxm or .rbxmx file with a valid filename.';
    if (file.size > MAX_BYTES) return 'This file is too large. The source file limit is 25 MB.';
  } else {
    if (!file.name.toLowerCase().endsWith('.zeox')) return 'Choose an encrypted .zeox archive to restore.';
    if (file.size > MAX_ARCHIVE) return 'This archive exceeds the 25 MB source file limit.';
    if (file.size < HEADER_SIZE + TAG_SIZE + 3) return 'This file is not a complete .zeox archive.';
  }
  return null;
}
export function validatePassphrase(passphrase: string, mode: Mode): string | null {
  if (!passphrase || passphrase.length > 1024) return 'Enter a passphrase of up to 1,024 characters.';
  if (mode === 'encrypt' && (Array.from(passphrase).length < 12 || !passphrase.trim())) return 'Use a passphrase of at least 12 characters.';
  return null;
}

async function deriveKey(passphrase: string, salt: Uint8Array, usages: Mode[]) {
  const bytes = encoder.encode(passphrase);
  try {
    const material = await crypto.subtle.importKey('raw', bytes, 'PBKDF2', false, ['deriveKey']);
    return await crypto.subtle.deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt: salt.slice(), iterations: 600_000 },
      material, { name: 'AES-GCM', length: 256 }, false, usages);
  } finally { bytes.fill(0); }
}

/** Only a successful, authenticated restore reaches the cleaning pass. Keep
 * the primary bytes exact for downloads, the session log and usage accounting. */
export async function processFile(file: File, mode: Mode, passphrase: string, phase: (p: Phase) => void, verify = false): Promise<VaultResult> {
  const output = await processArchive(file, mode, passphrase, phase, verify);
  if (mode === 'encrypt') return output;
  phase('cleaning');
  return { ...output, cleanup: await cleanRestoredFile(output) };
}

/** V1: authenticated header (magic/version, salt, IV), then AES-GCM ciphertext + tag.
 * The sealed payload contains a two-byte UTF-8 filename length, filename and original bytes.
 * KDF parameters are fixed by the version; untrusted files cannot request expensive KDF settings.
 */
async function processArchive(file: File, mode: Mode, passphrase: string, phase: (p: Phase) => void, verify: boolean): Promise<OutputFile> {
  if (!cryptoAvailable()) throw new Error('Local encryption needs Web Crypto over HTTPS. Open this page in a supported browser.');
  const invalid = validateFile(file, mode) || validatePassphrase(passphrase, mode);
  if (invalid) throw new Error(invalid);
  phase('reading');
  const bytes = new Uint8Array(await file.arrayBuffer());
  try {
    if (mode === 'encrypt') {
      const name = encoder.encode(file.name);
      const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
      const iv = crypto.getRandomValues(new Uint8Array(IV_SIZE));
      const header = new Uint8Array([...MAGIC, ...salt, ...iv]);
      phase('deriving');
      const key = await deriveKey(passphrase, salt, verify ? ['encrypt', 'decrypt'] : ['encrypt']);
      phase('sealing');
      const payload = new Uint8Array(2 + name.length + bytes.length);
      new DataView(payload.buffer).setUint16(0, name.length);
      payload.set(name, 2); payload.set(bytes, 2 + name.length);
      try {
        const algorithm = { name: 'AES-GCM', iv, additionalData: header, tagLength: 128 };
        const ciphertext = await crypto.subtle.encrypt(algorithm, key, payload);
        if (verify) {
          phase('verifying');
          try {
            // Authenticate the newly produced ciphertext and header before releasing it.
            // This is not a second user restore; it must not run cleanup or log a job.
            const check = new Uint8Array(await crypto.subtle.decrypt(algorithm, key, ciphertext));
            check.fill(0);
          } catch { throw new Error('Archive verification failed. No download was created.'); }
        }
        return { name: `${file.name}.zeox`, blob: new Blob([header, ciphertext], { type: 'application/octet-stream' }) };
      } finally { payload.fill(0); }
    }
    if (!MAGIC.every((v, i) => bytes[i] === v)) throw new Error('Unrecognized archive or format version. Select a supported .zeox archive.');
    const header = bytes.subarray(0, HEADER_SIZE);
    const salt = header.subarray(MAGIC.length, MAGIC.length + SALT_SIZE);
    const iv = header.subarray(MAGIC.length + SALT_SIZE);
    phase('deriving');
    const key = await deriveKey(passphrase, salt, ['decrypt']);
    phase('restoring');
    let decrypted: ArrayBuffer;
    try {
      decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, additionalData: header, tagLength: 128 }, key, bytes.subarray(HEADER_SIZE));
    } catch { throw new Error('Could not unlock this archive. The passphrase is incorrect or the file has changed.'); }
    const payload = new Uint8Array(decrypted);
    try {
      const invalidPayload = () => new Error('Invalid file metadata inside this archive.');
      if (payload.length < 3) throw invalidPayload();
      const length = new DataView(payload.buffer).getUint16(0);
      if (!length || length > MAX_NAME || length + 2 > payload.length || payload.length - length - 2 > MAX_BYTES) throw invalidPayload();
      let name: string;
      try { name = new TextDecoder('utf-8', { fatal: true }).decode(payload.subarray(2, 2 + length)); }
      catch { throw invalidPayload(); }
      if (!safeSourceName(name)) throw invalidPayload();
      return { name, blob: new Blob([payload.subarray(2 + length)], { type: 'application/octet-stream' }) };
    } finally { payload.fill(0); }
  } finally { bytes.fill(0); }
}
