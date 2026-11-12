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

export const stats = [
  {
    icon: CreditCard,
    title: 'Current Plan',
    value: 'Developer',
    description: 'Renews Dec 12, 2026 · prototype data',
    accent: 'purple' as const,
  },
  {
    icon: Zap,
    title: 'Available Credits',
    value: '1,240',
    description: 'Credits reset monthly · prototype data',
    accent: 'orange' as const,
  },
  {
    icon: Activity,
    title: 'Total Operations',
    value: '3,482',
    description: 'Across all services · prototype data',
    accent: 'purple' as const,
  },
  {
    icon: Cpu,
    title: 'Active Services',
    value: '3',
    description: 'Services enabled on your plan',
    accent: 'orange' as const,
  },
];

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
