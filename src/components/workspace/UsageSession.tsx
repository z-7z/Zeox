import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Operation = 'compact' | 'encrypt' | 'decrypt';
export const operationLabels: Record<Operation, string> = { compact: 'Source build', encrypt: 'Encryption', decrypt: 'Decryption' };
export interface UsageRow { id: number; operation: Operation; input: number; output: number; time: number }
interface Ledger { count: number; input: number; output: number; byTool: Record<Operation, number>; recent: UsageRow[] }
const empty = (): Ledger => ({ count: 0, input: 0, output: 0, byTool: { compact: 0, encrypt: 0, decrypt: 0 }, recent: [] });
interface Usage extends Ledger { record: (operation: Operation, input: number, output: number) => void; clear: () => void }
const UsageContext = createContext<Usage | null>(null);

// The ledger never accepts a filename, file, source text, passphrase or key.
export function UsageProvider({ children }: { children: ReactNode }) {
  const [ledger, setLedger] = useState(empty);
  const record = useCallback((operation: Operation, input: number, output: number) => {
    const time = Date.now();
    setLedger(prev => ({ count: prev.count + 1, input: prev.input + input, output: prev.output + output,
      byTool: { ...prev.byTool, [operation]: prev.byTool[operation] + 1 },
      recent: [{ id: prev.count + 1, operation, input, output, time }, ...prev.recent].slice(0, 50) }));
  }, []);
  const clear = useCallback(() => setLedger(empty()), []);
  const value = useMemo(() => ({ ...ledger, record, clear }), [ledger, record, clear]);
  return <UsageContext.Provider value={value}>{children}</UsageContext.Provider>;
}
export function useUsage() {
  const value = useContext(UsageContext);
  if (!value) throw new Error('Missing usage session');
  return value;
}
