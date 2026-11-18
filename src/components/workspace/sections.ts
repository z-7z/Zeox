import { Braces, ChartNoAxesColumnIncreasing, LayoutGrid, LockKeyhole } from 'lucide-react';

export const sections = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'obfuscate', path: '/obfuscate', label: 'Obfuscate', icon: Braces },
  { id: 'usages', path: '/usages', label: 'Usages', icon: ChartNoAxesColumnIncreasing },
  { id: 'vault', path: '/vault', label: 'Vault', icon: LockKeyhole },
] as const;
export type Section = typeof sections[number];
export function sectionFor(path: string): Section {
  return sections.find(section => path.toLowerCase().replace(/\/$/, '') === section.path) ?? sections[0];
}
