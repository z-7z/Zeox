import { ShieldCheck, KeyRound, FileCode2, Globe, Server, Cpu, Folder, FileText, Film, Music, Archive } from 'lucide-react';

/** All data below is prototype/mock data only — no backend is connected. */

export const services = [
  { icon: ShieldCheck, name: 'Zeox Protect', description: 'LuaU script protection and obfuscation tools.', status: 'Available' },
  { icon: KeyRound, name: 'Zeox Keys', description: 'License key management and access control.', status: 'Available' },
  { icon: FileCode2, name: 'Zeox Script Protect', description: 'Script protection and management tools.', status: 'Prototype' },
];

export const platformStatus = [
  { icon: Globe, title: 'Platform Status', state: 'Operational', level: 'operational' as const, metadata: 'uptime 99.98% · 30d' },
  { icon: Server, title: 'API Status', state: 'Operational', level: 'operational' as const, metadata: 'avg latency 42ms · v1' },
  { icon: Cpu, title: 'Protection Engine', state: 'Operational', level: 'operational' as const, metadata: 'engine build 2.4.1' },
];

export const account = {
  plan: 'Developer',
  planDescription: 'Core services with monthly credits',
  renewal: 'Dec 12, 2026',
  credits: { used: 760, total: 2000 },
  usage: [
    { label: 'Protection operations', value: '412 runs', pct: 68 },
    { label: 'License key operations', value: '1,890 keys', pct: 54 },
    { label: 'API requests', value: '12,437 calls', pct: 41 },
  ],
};

export const operationsChart = {
  total: '30,240', delta: '+7.5% vs last month',
  data: [42, 48, 45, 58, 52, 66, 60, 74, 68, 80, 72, 86, 78, 92, 84, 96, 88, 100, 90, 95, 86, 92, 98, 94],
  labels: ['Feb 14', 'Feb 17', 'Feb 20', 'Feb 25', 'Mar 3', 'Mar 9', 'Mar 15'],
  highlightIndex: 1, tooltipLabel: 'Tue, Feb 17', tooltipValue: '28,917',
};

export const usageServices = [
  { label: 'Zeox Protect', pct: 68, color: '#5CD4E6', amount: '1,204 ops' },
  { label: 'Zeox Keys', pct: 54, color: '#FF9150', amount: '890 ops' },
  { label: 'Script Protect', pct: 41, color: '#F2A6C7', amount: '612 ops' },
  { label: 'API Requests', pct: 27, color: '#8BCBDD', amount: '776 ops' },
];

export const usageDonut = {
  total: '3,482', sub: 'total operations',
  segments: [
    { label: 'Protect', value: 1204, color: '#5CD4E6' },
    { label: 'Keys', value: 890, color: '#FF9150' },
    { label: 'Scripts', value: 612, color: '#F2A6C7' },
    { label: 'API', value: 776, color: '#8BCBDD' },
  ],
};

export const storageCards = [
  { icon: Folder, name: 'Zeox Protect', sub: '1,204 operations', color: '#5CD4E6' },
  { icon: KeyRound, name: 'Zeox Keys', sub: '890 operations', color: '#FF9150' },
  { icon: FileCode2, name: 'Script Protect', sub: '612 operations', color: '#F2A6C7' },
];

export const categories = [
  { icon: ShieldCheck, name: 'Protect', count: '1,204 ops', pct: 68, color: '#5CD4E6' },
  { icon: KeyRound, name: 'Keys', count: '890 ops', pct: 54, color: '#FF9150' },
  { icon: FileCode2, name: 'Scripts', count: '612 ops', pct: 41, color: '#F2A6C7' },
  { icon: Cpu, name: 'Engine', count: '438 ops', pct: 33, color: '#FFB364' },
  { icon: Globe, name: 'Others', count: '338 ops', pct: 21, color: '#8BCBDD' },
];

export const operationsTable = {
  columns: ['#', 'Type', 'Name', 'Service', 'Status', 'Created', ''],
  rows: [
    { type: 'Protect', name: 'main-script.lua', service: 'Zeox Protect', status: 'Done', created: '12-11-2026', color: '#5CD4E6' },
    { type: 'Keys', name: 'batch-25-keys', service: 'Zeox Keys', status: 'Done', created: '12-11-2026', color: '#FF9150' },
    { type: 'Script', name: 'loader-v2.lua', service: 'Script Protect', status: 'Running', created: '11-11-2026', color: '#F2A6C7' },
    { type: 'Protect', name: 'game-core.lua', service: 'Zeox Protect', status: 'Done', created: '11-11-2026', color: '#5CD4E6' },
    { type: 'API', name: 'sync-report', service: 'API', status: 'Done', created: '10-11-2026', color: '#8BCBDD' },
    { type: 'Keys', name: 'revoke-expired', service: 'Zeox Keys', status: 'Queued', created: '10-11-2026', color: '#FF9150' },
  ],
};

export const uptime = {
  rate: '95%', delta: '+12% vs last month', legend: ['This week', 'Last week'],
  values: [55, 70, 48, 90, 62, 75, 58, 82, 66, 92, 71, 60, 84, 68, 95, 73, 57, 88, 64, 78, 52, 86, 70, 94, 61, 80, 67, 91], highlight: 3,
};

export const activities = [
  { icon: ShieldCheck, title: 'Protection operation completed', description: 'main-script.lua · 128 KB processed', timestamp: '2m ago', status: 'success' as const },
  { icon: KeyRound, title: 'License keys generated', description: 'Batch of 25 keys · prototype sample', timestamp: '18m ago', status: 'success' as const },
  { icon: Globe, title: 'Account activity', description: 'New sign-in from web dashboard', timestamp: '1h ago', status: 'success' as const },
  { icon: FileCode2, title: 'Script Protect session started', description: 'loader-v2.lua · sample data', timestamp: '3h ago', status: 'pending' as const },
  { icon: Server, title: 'Service usage report', description: 'Weekly usage summary available', timestamp: '1d ago', status: 'success' as const },
];

export { FileText, Film, Music, Archive };
