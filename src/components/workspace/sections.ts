import { Braces, ChartNoAxesColumnIncreasing, LayoutDashboard, LockKeyhole } from 'lucide-react';

export const sections = [
  { id: 'obfuscate', path: '/obfuscate', label: 'Obfuscator', hint: 'Obfuscate a Lua or Luau file', icon: Braces },
  { id: 'vault', path: '/vault', label: 'Vault', hint: 'Encrypt or restore a file', icon: LockKeyhole },
  { id: 'usages', path: '/usages', label: 'Usages', hint: 'Review or export completed runs', icon: ChartNoAxesColumnIncreasing },
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', hint: 'Explore the sample report', icon: LayoutDashboard },
] as const;
export type Section = typeof sections[number];
export function sectionFor(path: string): Section {
  return sections.find(section => path.toLowerCase().replace(/\/$/, '') === section.path) ?? sections[0];
}
