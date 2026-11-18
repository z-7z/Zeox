import { createContext, useContext, type ReactNode } from 'react';
import { useVaultSession, type VaultSession } from '../vault/session';
import { useSourceSession } from '../source/session';
import { useUsage } from './UsageSession';

const Vault = createContext<VaultSession | null>(null);
const Source = createContext<ReturnType<typeof useSourceSession> | null>(null);

// Switching sections should not discard an editor draft, in-flight operation or download.
// These controllers live only as long as the workspace is open. Nothing is serialized.
export function ToolSessions({ children }: { children: ReactNode }) {
  const { record } = useUsage();
  const vault = useVaultSession(record), source = useSourceSession();
  return <Vault.Provider value={vault}><Source.Provider value={source}>{children}</Source.Provider></Vault.Provider>;
}
export function useVaultTool() {
  const tool = useContext(Vault); if (!tool) throw new Error('Missing Vault session'); return tool;
}
export function useSourceTool() {
  const tool = useContext(Source); if (!tool) throw new Error('Missing source session'); return tool;
}
