import { Activity, ChartPie, LayoutGrid, LockKeyhole } from 'lucide-react';

export const tools = [
  { url: '/obfuscate', name: 'Obfuscator', icon: LayoutGrid, info: 'Attach and build a Lua or Luau script' },
  { url: '/encrypt', name: 'Encryption', icon: LockKeyhole, info: 'Encrypt, decrypt and restore a file' },
  { url: '/usages', name: 'Usages', icon: Activity, info: 'Inspect or export the local ledger' },
  { url: '/dashboard', name: 'Dashboard', icon: ChartPie, info: 'Explore the dated sample report' },
] as const;
