import { Activity, ChartPie, Braces, LockKeyhole } from 'lucide-react';

export const tabs = [
  { url: '/obfuscate', name: 'Obfuscator', icon: Braces, info: 'Obfuscate and download a Lua or Luau script' },
  { url: '/usages', name: 'Usages', icon: Activity, info: 'Inspect or export the local ledger' },
  { url: '/dashboard', name: 'Dashboard', icon: ChartPie, info: 'Resume your script and view build activity' },
] as const;

// File encryption remains reachable without a permanent navigation tab.
export const workspacePages = [
  ...tabs,
  { url: '/encrypt', name: 'Encryption', icon: LockKeyhole, info: 'Encrypt, decrypt and restore a file' },
] as const;
