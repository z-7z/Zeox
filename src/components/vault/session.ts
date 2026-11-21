import { useCallback, useEffect, useRef, useState } from 'react';
import { cryptoAvailable, processFile, validateFile, validatePassphrase, type Mode, type Phase, type VaultResult } from '../../lib/vault/container';

export interface SessionEvent { id: number; mode: Mode; name: string; size: number; time: number }
export type Problem = { field: 'file' | 'pass' | 'confirm' | 'operation'; message: string };
export const phaseLabel: Record<Phase, string> = { reading: 'Reading file', deriving: 'Deriving key', sealing: 'Encrypting file', restoring: 'Decrypting file', cleaning: 'Cleaning text' };

// Volatile state only. No uploads, storage, analytics or URLs containing secrets.
export function useVaultSession(onSuccess: (operation: Mode, input: number, output: number) => void) {
  const [mode, setMode] = useState<Mode>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [passphrase, setPassphrase] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [phase, setPhase] = useState<Phase | null>(null);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [result, setResult] = useState<VaultResult | null>(null);
  const [urls, setUrls] = useState<{ original: string; cleaned?: string } | null>(null);
  const [events, setEvents] = useState<SessionEvent[]>([]);
  const id = useRef(0), running = useRef(false), alive = useRef(true);
  const supported = cryptoAvailable();
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => {
    if (!result) { setUrls(null); return; }
    const original = URL.createObjectURL(result.blob);
    const cleaned = result.cleanup?.file && URL.createObjectURL(result.cleanup.file.blob);
    setUrls({ original, cleaned });
    return () => {
      URL.revokeObjectURL(original);
      if (cleaned) URL.revokeObjectURL(cleaned);
    };
  }, [result]);

  function reset() {
    if (running.current) return;
    setResult(null); setFile(null); setPassphrase(''); setConfirmation(''); setProblem(null);
  }
  function switchMode(next: Mode) {
    if (!running.current && next !== mode) { reset(); setMode(next); }
  }
  function selectFile(files: File[]) {
    if (running.current || !files.length) return;
    const message = files.length === 1 ? validateFile(files[0], mode) : 'Choose one file at a time.';
    setResult(null); setFile(message ? null : files[0]); setProblem(message ? { field: 'file', message } : null);
  }
  function sample() {
    if (mode === 'encrypt') selectFile([new File(['-- Sample configuration. This file is never executed.\nreturn {\n    name = "Orbit",\n    theme = "mono",\n}\n'], 'game-config.luau', { type: 'text/plain' })]);
  }
  async function run() {
    if (running.current || result) return;
    let invalid: Problem | null = null;
    const passError = validatePassphrase(passphrase, mode);
    if (!supported) invalid = { field: 'operation', message: 'Open Zeox over HTTPS in a browser with Web Crypto support.' };
    else if (!file) invalid = { field: 'file', message: mode === 'encrypt' ? 'Choose a file first, or try the sample script.' : 'Choose a .zeox archive to decrypt.' };
    else if (passError) invalid = { field: 'pass', message: passError };
    else if (mode === 'encrypt' && confirmation !== passphrase) invalid = { field: 'confirm', message: 'Enter the same passphrase in both fields.' };
    if (invalid || !file) { setProblem(invalid); return; }
    setProblem(null); running.current = true;
    try {
      const output = await processFile(file, mode, passphrase, p => { if (alive.current) setPhase(p); });
      if (!alive.current) return;
      setResult(output); setPassphrase(''); setConfirmation(''); setFile(null);
      const event: SessionEvent = { id: ++id.current, name: mode === 'encrypt' ? file.name : output.name, size: mode === 'encrypt' ? file.size : output.blob.size, time: Date.now(), mode };
      setEvents(list => [event, ...list].slice(0, 30));
      onSuccess(mode, file.size, output.blob.size);
    } catch (error) {
      if (alive.current) setProblem({ field: 'operation', message: error instanceof Error ? error.message : 'The file could not be processed. Try again.' });
    } finally { running.current = false; if (alive.current) setPhase(null); }
  }
  const forgetPassphrase = useCallback(() => { setPassphrase(''); setConfirmation(''); }, []);
  const clearLog = useCallback(() => setEvents([]), []);
  return { mode, switchMode, file, selectFile, removeFile: () => { if (!running.current) { setFile(null); setProblem(null); } }, sample,
    passphrase, editPass: (s: string) => { setPassphrase(s); setProblem(null); }, confirmation, editConfirm: (s: string) => { setConfirmation(s); setProblem(null); },
    phase, problem, result, urls, run, reset, events, clearLog, supported, forgetPassphrase };
}
export type VaultSession = ReturnType<typeof useVaultSession>;
