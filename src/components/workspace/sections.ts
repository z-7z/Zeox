import { Braces, ChartNoAxesColumnIncreasing, LayoutGrid, LockKeyhole } from 'lucide-react';

export const sections = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutGrid, hint: 'Overview, analytics and quick actions' },
  { id: 'obfuscate', path: '/obfuscate', label: 'Obfuscate', icon: Braces, hint: 'Build locally obfuscated Lua and Luau source' },
  { id: 'usages', path: '/usages', label: 'Usages', icon: ChartNoAxesColumnIncreasing, hint: 'View local tool activity and byte totals' },
  { id: 'vault', path: '/vault', label: 'Vault', icon: LockKeyhole, hint: 'Encrypt and restore files' },
] as const;
export type Section = typeof sections[number];
export function sectionFor(path: string): Section {
  return sections.find(section => path.toLowerCase().replace(/\/$/, '') === section.path) ?? sections[0];
}
