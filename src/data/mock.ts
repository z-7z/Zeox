import {
  ShieldCheck,
  KeyRound,
  FileCode2,
  Activity,
  CreditCard,
  Cpu,
  Server,
  Globe,
  UserRound,
  Zap,
} from 'lucide-react';
import type { ActivityStatus } from '../components/ActivityItem';
import type { StatusLevel } from '../components/StatusCard';

/** All data below is prototype/mock data only — no backend is connected. */

export const services = [
  {
    icon: ShieldCheck,
    name: 'Zeox Protect',
    description: 'LuaU script protection and obfuscation tools.',
    status: 'Available',
  },
  {
    icon: KeyRound,
    name: 'Zeox Keys',
    description: 'License key management and access control.',
    status: 'Available',
  },
  {
    icon: FileCode2,
    name: 'Zeox Script Protect',
    description: 'Script protection and management tools.',
    status: 'Prototype',
  },
];

export const platformStatus = [
  {
    icon: Globe,
    title: 'Platform Status',
    state: 'Operational',
    level: 'operational' as StatusLevel,
    metadata: 'uptime 99.98% · 30d',
  },
  {
    icon: Server,
    title: 'API Status',
    state: 'Operational',
    level: 'operational' as StatusLevel,
    metadata: 'avg latency 42ms · v1',
  },
  {
    icon: Cpu,
    title: 'Protection Engine',
    state: 'Operational',
    level: 'operational' as StatusLevel,
    metadata: 'engine build 2.4.1',
  },
  {
    icon: Activity,
    title: 'Active Services',
    state: '3 of 3 running',
    level: 'operational' as StatusLevel,
    metadata: 'last check 30s ago',
  },
];

export const dashboardStatus = platformStatus.slice(0, 3);

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

export const stats = [
  {
    icon: CreditCard,
    title: 'Current Plan',
    value: 'Developer',
    delta: '2.0%',
    deltaDirection: 'up' as const,
    description: 'Renews Dec 12, 2026',
  },
  {
    icon: Zap,
    title: 'Available Credits',
    value: '1,240',
    delta: '4.0%',
    deltaDirection: 'down' as const,
    description: 'vs last month · resets monthly',
  },
  {
    icon: Activity,
    title: 'Total Operations',
    value: '3,482',
    delta: '7.5%',
    deltaDirection: 'up' as const,
    description: 'vs last month',
  },
  {
    icon: Cpu,
    title: 'Active Services',
    value: '3',
    delta: '0.0%',
    deltaDirection: 'up' as const,
    description: 'Enabled on your plan',
  },
];

export const operationsChart = {
  total: '30,240',
  delta: '+7.5% vs last month',
  data: [42, 48, 45, 58, 52, 66, 60, 74, 68, 80, 72, 86, 78, 92, 84, 96, 88, 100, 90, 95, 86, 92, 98, 94],
  labels: ['Feb 14', 'Feb 17', 'Feb 20', 'Feb 25', 'Mar 3', 'Mar 9', 'Mar 15'],
  highlightIndex: 1,
  tooltipLabel: 'Tue, Feb 17',
  tooltipValue: '28,917',
};

export const keysManagement = {
  tabs: ['Status', 'Sources', 'Usage'],
  groups: [
    { label: 'Active keys', value: '114', sub: 'keys', pct: 64 },
    { label: 'In rotation', value: '62', sub: 'keys', pct: 38 },
  ],
};

export const uptime = {
  rate: '95%',
  delta: '+12% vs last month',
  legend: ['This week', 'Last week'],
  values: [55, 70, 48, 90, 62, 75, 58, 82, 66, 92, 71, 60, 84, 68, 95, 73, 57, 88, 64, 78, 52, 86, 70, 94, 61, 80, 67, 91],
  highlight: 3,
};

export const activities: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  timestamp: string;
  status: ActivityStatus;
}[] = [
  {
    icon: ShieldCheck,
    title: 'Protection operation completed',
    description: 'Sample script · 128 KB processed',
    timestamp: '2m ago',
    status: 'success',
  },
  {
    icon: KeyRound,
    title: 'License keys generated',
    description: 'Batch of 25 keys · prototype sample',
    timestamp: '18m ago',
    status: 'success',
  },
  {
    icon: UserRound,
    title: 'Account activity',
    description: 'New sign-in from web dashboard',
    timestamp: '1h ago',
    status: 'success',
  },
  {
    icon: FileCode2,
    title: 'Script Protect session started',
    description: 'Draft project · sample data',
    timestamp: '3h ago',
    status: 'pending',
  },
  {
    icon: Activity,
    title: 'Service usage report',
    description: 'Weekly usage summary available',
    timestamp: '1d ago',
    status: 'success',
  },
];
