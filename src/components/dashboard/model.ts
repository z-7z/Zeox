import { useCallback, useEffect, useRef, useState } from 'react';

export type PanelId = 'search' | 'profile' | 'activity' | 'help' | 'settings' | 'funnel' | 'channels' | 'traffic' | 'team' | 'sales' | 'orders' | 'campaigns' | 'downloads';
export type OpenPanel = (id: PanelId, row?: number) => void;
export interface Overview {
  periodDays: number;
  purchaseChange: number;
  ordersChange: number;
  stages: { name: string; value: number }[];
  channels: { name: string; orders: number }[];
  traffic: { name: string; visits: number }[];
  hourlySales: number[][];
}

export const compact = (n: number) => n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const number = (n: number) => n.toLocaleString('en-US');
export const money = (n: number) => '$' + number(n);
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const hour = (h: number) => `${h % 12 || 12}${h % 24 < 12 ? 'a' : 'p'}`;
export const sum = (values: number[]) => values.reduce((total, next) => total + next, 0);

export function salesSummary(rows: number[][]) {
  const values = rows.flat();
  const peak = Math.max(...values);
  const index = values.indexOf(peak);
  return { peak, day: days[Math.floor(index / 24)], hourIndex: index % 24, average: Math.round(sum(values) / values.length) };
}

const record = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;
const amount = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v) && v >= 0;
function namedSeries(rows: unknown, field: string, count: number) {
  return Array.isArray(rows) && rows.length === count && rows.every(row => record(row) && typeof row.name === 'string' && amount(row[field]));
}
function isOverview(v: unknown): v is Overview {
  return record(v) && amount(v.periodDays) && Number.isFinite(v.purchaseChange) && Number.isFinite(v.ordersChange)
    && namedSeries(v.stages, 'value', 4) && namedSeries(v.channels, 'orders', 5) && namedSeries(v.traffic, 'visits', 5)
    && Array.isArray(v.hourlySales) && v.hourlySales.length === 7 && v.hourlySales.every(row => Array.isArray(row) && row.length === 24 && row.every(amount));
}

export function useOverview(enabled = true) {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => { setData(null); setError(false); setRevision(n => n + 1); }, []);

  useEffect(() => {
    if (!enabled || data || error) return;
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/overview.json`, { signal: controller.signal });
        if (!res.ok) throw new Error('Snapshot unavailable');
        const snapshot: unknown = await res.json();
        if (!isOverview(snapshot)) throw new Error('Invalid overview snapshot');
        if (!controller.signal.aborted) setData(snapshot);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [enabled, revision, data, error]);
  return { data, error, refresh };
}

export interface Invite { email: string; role: string }
export interface Campaign { name: string; channel: string }
interface Workspace {
  name: string;
  invites: Invite[];
  campaigns: Campaign[];
  fulfilled: string[];
  activity: string[];
}
const storageKey = 'zeox.overview.workspace.v1';
const initialWorkspace: Workspace = {
  name: 'Zeox workspace', invites: [], campaigns: [], fulfilled: [], activity: ['Your overview snapshot is ready.'],
};
export function useWorkspace() {
  const dirty = useRef(false);
  const [workspace, setWorkspace] = useState<Workspace>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (record(saved) && typeof saved.name === 'string'
        && Array.isArray(saved.invites) && saved.invites.every(i => record(i) && typeof i.email === 'string' && typeof i.role === 'string')
        && Array.isArray(saved.campaigns) && saved.campaigns.every(c => record(c) && typeof c.name === 'string' && typeof c.channel === 'string')
        && Array.isArray(saved.fulfilled) && saved.fulfilled.every(s => typeof s === 'string')
        && Array.isArray(saved.activity) && saved.activity.every(s => typeof s === 'string')) {
        return { name: saved.name, invites: saved.invites, campaigns: saved.campaigns, fulfilled: saved.fulfilled, activity: saved.activity };
      }
    } catch { /* Private browsing can disable local storage. */ }
    return initialWorkspace;
  });
  useEffect(() => {
    if (!dirty.current) return;
    dirty.current = false;
    try { localStorage.setItem(storageKey, JSON.stringify(workspace)); } catch { /* Session-only fallback. */ }
  }, [workspace]);
  const update = (patch: Partial<Workspace>, event: string) => {
    dirty.current = true;
    setWorkspace(prev => ({
      ...prev, ...patch, activity: [event, ...prev.activity].slice(0, 24),
    }));
  };
  return { workspace, update };
}
export type WorkspaceState = ReturnType<typeof useWorkspace>;
