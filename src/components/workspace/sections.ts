import { Braces, ChartNoAxesColumnIncreasing, House, LockKeyhole } from 'lucide-react';

export const sections = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', hint: 'Sample analytics and local session', icon: House },
  { id: 'obfuscate', path: '/obfuscate', label: 'Obfuscate', hint: 'Attach and build a Lua script', icon: Braces },
  { id: 'usages', path: '/usages', label: 'Usages', hint: 'Review or export completed runs', icon: ChartNoAxesColumnIncreasing },
  { id: 'vault', path: '/vault', label: 'Vault', hint: 'Encrypt or restore a file', icon: LockKeyhole },
] as const;
export type Section = typeof sections[number];
export function sectionFor(path: string): Section {
  return sections.find(section => path.toLowerCase().replace(/\/$/, '') === section.path) ?? sections[0];
}
