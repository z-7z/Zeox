// 64 symbols: each independently sampled byte selects one of them uniformly.
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
export function generatePassphrase(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (byte) => alphabet[byte & 63]).join('');
}
