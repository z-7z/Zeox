import { FileCode2, Upload } from 'lucide-react';
import art from '../../assets/vault/archive.svg';

export type StudioModal = 'guide' | 'log' | null;
export function FormatMark({ type }: { type: 'Luau' | 'Lua 5.1' | 'Roblox' }) {
  if (type === 'Roblox') return <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.1.7 19.3 4.1 15.9 19.3.7 15.9 4.1.7Zm3.9 6.1-1.2 5.1 5.1 1.2 1.2-5.1L8 6.8Z" /></svg>;
  if (type === 'Luau') return <svg width="15" height="14" viewBox="0 0 22 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="m1.7 7.4 10.4-5.5 8.2 4.3-10.5 5.7-8.1-4.5Zm.1 4 8 4.5 10.5-5.7m-18.5 5 8 4.2 10.5-5.7" /></svg>;
  return <svg width="15" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.4" cy="11.5" r="6.8" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="8.6" r="2.1" fill="currentColor"/><circle cx="17.1" cy="2.8" r="2" fill="currentColor"/></svg>;
}

/** Keep the illustration inside the file card, never in the page chrome. */
export function FileArt({ selected = false }: { selected?: boolean }) {
  return <span className={`vt-file-art${selected ? ' is-selected' : ''}`} aria-hidden="true">
    <img src={art} width="128" height="112" alt="" /><span>{selected ? <FileCode2 size={12} /> : <Upload size={12} />}</span>
  </span>;
}
