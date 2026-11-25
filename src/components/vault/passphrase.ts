// 64 symbols: each independently sampled byte selects one of them uniformly.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
export const generatorLength = { min: 16, default: 24, max: 64 } as const;
export function generatePassphrase(length: number = generatorLength.default): string {
  if (!Number.isInteger(length) || length < generatorLength.min || length > generatorLength.max) {
    throw new RangeError('Choose a passphrase length between 16 and 64 characters.');
  }
  return Array.from(crypto.getRandomValues(new Uint8Array(length)), (byte) => alphabet[byte & 63]).join('');
}
