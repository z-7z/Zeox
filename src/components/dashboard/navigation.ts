import {
  Activity, ChartColumn, CircleHelp, Clock3, Database, FileDown, Files, Keyboard,
  Megaphone, PieChart, Settings, ShoppingCart, Terminal, TrendingUp, UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { PanelId } from './model';

export interface Destination { id: PanelId; label: string; icon: LucideIcon; hint: string }
export const chartCommands: Destination[] = [
  { id: 'funnel', label: 'Purchase funnel', icon: TrendingUp, hint: 'Views, carts, checkouts and purchases' },
  { id: 'sales', label: 'Sales by hour', icon: ChartColumn, hint: 'Explore the last seven days' },
  { id: 'channels', label: 'Order distribution', icon: Database, hint: 'Orders by acquisition channel' },
];
export const navGroups: Destination[][] = [
  [
    { id: 'orders', label: 'Review unfulfilled', icon: ShoppingCart, hint: 'Orders waiting to ship' },
    { id: 'traffic', label: 'Traffic sources', icon: PieChart, hint: 'Compare visits by source' },
    { id: 'team', label: 'Team members', icon: UsersRound, hint: 'Invite members and review invitations' },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, hint: 'Create and manage campaign drafts' },
  ], [
    { id: 'activity', label: 'Activity log', icon: Activity, hint: 'Recent workspace updates' },
    { id: 'downloads', label: 'Downloads', icon: FileDown, hint: 'Sales CSV and dashboard skeleton' },
    { id: 'search', label: 'Command menu', icon: Terminal, hint: 'Search workspace commands' },
  ],
];
export const utilities: Destination[] = [
  { id: 'help', label: 'Help & shortcuts', icon: CircleHelp, hint: 'About this workspace' },
  { id: 'settings', label: 'Workspace settings', icon: Settings, hint: 'Workspace name and team access' },
];
export const quickActions = [
  { id: 'campaigns', name: 'Add Campaign', description: 'Create a campaign.' },
  { id: 'orders', name: 'Review unfulfilled', description: 'Orders waiting to ship.' },
  { id: 'settings', name: 'Workspace settings', description: 'Team, roles, permissions.' },
  { id: 'export', name: 'Export sales', description: 'CSV for accounting.' },
] as const;
export const panelIcons: Record<PanelId, LucideIcon> = {
  search: Terminal, profile: UsersRound, activity: Clock3, help: Keyboard, settings: Settings, funnel: TrendingUp,
  channels: Database, traffic: PieChart, team: UsersRound, sales: ChartColumn, orders: ShoppingCart, campaigns: Megaphone, downloads: Files,
};
