import { cleanLuaSource } from '../source/compact';
import { readLift, READING_LIMIT } from '../source/exf-reading.mjs';
import type { OutputFile } from './container';

// A text export may have the numbered suffix a browser adds to a duplicate download.
export const partialListingName = /\.partial\.luau?(?:(?: \(\d+\))?\.txt)?$/i;
const scriptExtension = /\.luau?$/i;
export type Cleanup =
  | { kind: 'source' | 'reading'; file: OutputFile; message: string }
  | { kind: 'skipped' | 'unchanged'; file?: undefined; message: string };

const skip = (message: string): Cleanup => ({ kind: 'skipped', message });

/** Best-effort, local post-processing of an authenticated restore. Never inspect
 * Roblox assets or execute source. A failed reading cannot invalidate the original. */
export async function cleanRestoredFile({ name, blob }: OutputFile): Promise<Cleanup> {
  const listingName = partialListingName.test(name);
  if (!listingName && !scriptExtension.test(name)) return skip('Roblox assets are restored without text cleanup.');
  if (blob.size > READING_LIMIT) return skip('Text cleanup is limited to 1 MiB. The original is ready.');

  let text: string;
  try {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    try { text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes); }
    finally { bytes.fill(0); }
  } catch { return skip('Could not read this file as UTF-8 text. The original is ready.'); }
  if (/[\u0000-\u0008\u000e-\u001f\u007f-\u009f]/u.test(text)) return skip('Binary or control bytes found. The original is ready.');

  // Route by content as well as the inner name. Never strip the header/guard of
  // an unsupported or incomplete partial listing using the ordinary source pass.
  const listing = listingName || /^\uFEFF?-- EXPERIMENTAL PARTIAL LIFT\b/.test(text);
  try {
    if (listing) {
      const stem = name.replace(listingName ? partialListingName : scriptExtension, '') || 'restored';
      const file = { name: `${stem}.reading.txt`, blob: new Blob([readLift(text)], { type: 'text/plain;charset=utf-8' }) };
      return { kind: 'reading', file, message: 'VM labels and register setup folded into a reading outline. Not executable Lua.' };
    }
    const cleaned = cleanLuaSource(text);
    if (cleaned === text) return { kind: 'unchanged', message: 'No cleanup changes needed. The original is ready.' };
    const file = { name: name.replace(scriptExtension, '.clean$&'), blob: new Blob([cleaned], { type: 'text/plain;charset=utf-8' }) };
    return { kind: 'source', file, message: 'Cleaned automatically. The original is also available, byte for byte.' };
  } catch {
    return skip(listing ? 'Incomplete or unsupported EXF listing. The original is ready.' : 'Could not safely clean this script. The original is ready.');
  }
}
