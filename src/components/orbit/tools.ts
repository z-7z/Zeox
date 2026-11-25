import { Activity, ChartPie, House, LayoutGrid, LockKeyhole } from 'lucide-react';

export const tabs = [
  { url: '/', name: 'Main', icon: House, info: 'Start here: illustrated guides to the local file tools' },
  { url: '/obfuscate', name: 'Obfuscator', icon: LayoutGrid, info: 'Attach and build a Lua or Luau script' },
  { url: '/usages', name: 'Usages', icon: Activity, info: 'Inspect or export the local ledger' },
  { url: '/dashboard', name: 'Dashboard', icon: ChartPie, info: 'Explore the dated sample report' },
] as const;

// Standalone tools have page titles and finder entries, but aren't dock tabs.
export const tools = [
  ...tabs,
  { url: '/encrypt', name: 'Encryption', icon: LockKeyhole, info: 'Encrypt, decrypt and restore a file' },
] as const;
