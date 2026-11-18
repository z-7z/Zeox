import { ArrowUpRight, AudioLines, BookOpen, Upload, FileCode2, History, PanelTop, ShieldCheck } from 'lucide-react';
import { ZeoxMark } from '../ZeoxMark';
import art from '../../assets/vault/vault-core.webp';

export type StudioModal = 'guide' | 'log' | null;
export function StudioHeader({ open }: { open: (dialog: Exclude<StudioModal, null>) => void }) {
  return <header className="vt-bar"><div className="vt-bar-inner">
    <a className="vt-brand" href="#vault-top" aria-label="Zeox Vault home"><ZeoxMark /><strong>Zeox</strong><span className="vt-brand-slash">/</span><span>Vault</span></a>
    <nav aria-label="Studio navigation" className="vt-nav"><a className="vt-nav-current" href="#workbench" aria-current="page"><PanelTop size={15} />Studio</a>
      <button type="button" onClick={() => open('log')} aria-label="Open session log"><History size={15} /><span>Session log</span></button></nav>
    <div className="vt-tools"><span className="vt-session-label"><i />Local session</span>
      <button className="vt-guide-trigger" type="button" onClick={() => open('guide')} aria-label="Open studio guide"><BookOpen size={14} /><span>Guide</span><ArrowUpRight size={12} /></button>
    </div>
  </div></header>;
}

export function FormatMark({ type }: { type: 'Luau' | 'Lua 5.1' | 'Roblox' }) {
  if (type === 'Roblox') return <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M4.1.7 19.3 4.1 15.9 19.3.7 15.9 4.1.7Zm3.9 6.1-1.2 5.1 5.1 1.2 1.2-5.1L8 6.8Z" /></svg>;
  if (type === 'Luau') return <svg width="15" height="14" viewBox="0 0 22 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden="true"><path d="m1.7 7.4 10.4-5.5 8.2 4.3-10.5 5.7-8.1-4.5Zm.1 4 8 4.5 10.5-5.7m-18.5 5 8 4.2 10.5-5.7" /></svg>;
  return <svg width="15" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="8.4" cy="11.5" r="6.8" stroke="currentColor" strokeWidth="1.5"/><circle cx="11" cy="8.6" r="2.1" fill="currentColor"/><circle cx="17.1" cy="2.8" r="2" fill="currentColor"/></svg>;
}
export function StudioHero({ openGuide, core }: { openGuide: () => void; core: 'idle' | 'loaded' | 'working' | 'sealed' | 'restored' }) {
  const caption = { idle: 'VAULT CORE', loaded: 'SOURCE LOADED', working: 'PROCESSING', sealed: 'ARCHIVE SEALED', restored: 'FILE RESTORED' }[core];
  return <section className="vt-hero" data-core={core} aria-labelledby="studio-title">
    <div className="vt-hero-grid" aria-hidden="true" />
    <div className="vt-hero-art" aria-hidden="true"><img src={art} width="1200" height="800" alt="" decoding="async" /></div>
    <span className="vt-figure" aria-hidden="true"><i />FIG. 01 <b>/</b> {caption}</span>
    <div className="vt-hero-copy"><p className="vt-kicker"><i />PRIVATE WORKSPACE<span>/</span>01</p>
      <h1 id="studio-title">Encryption <em>studio.</em></h1>
      <p className="vt-hero-description">Protect scripts and Roblox projects with a passphrase. Your files stay on this device.</p>
      <div className="vt-formats" aria-label="Supported formats">{(['Luau', 'Lua 5.1', 'Roblox'] as const).map(type => <button key={type} onClick={openGuide} aria-label={`About ${type} file support`}><FormatMark type={type} />{type}</button>)}</div>
    </div>
  </section>;
}

export function StudioFooter({ motion, systemReduced, toggle }: { motion: boolean; systemReduced: boolean; toggle: () => void }) {
  return <footer className="vt-footer"><span className="vt-foot-brand"><ZeoxMark />Zeox Vault <b>/</b> <small>v1.0</small></span>
    <span className="vt-private-note"><ShieldCheck size={13} />No uploads. No account required.</span>
    <button onClick={toggle} aria-pressed={motion && !systemReduced} disabled={systemReduced} aria-label={systemReduced ? 'Motion reduced by system preference' : 'Enable animation'}>
      <AudioLines size={14} />{systemReduced ? 'Reduced motion' : motion ? 'Motion on' : 'Motion off'}</button>
  </footer>;
}

export function FileArt({ selected = false }: { selected?: boolean }) {
  return <span className={`vt-file-art${selected ? ' is-selected' : ''}`} aria-hidden="true">
    <svg width="61" height="48" viewBox="0 0 68 55" fill="none"><path className="vt-file-back" d="m10 10 22-5 7 5 6 28-27 6z" fill="#22202e" stroke="#595169" strokeWidth="1.3" strokeLinejoin="round" />
      <path className="vt-file-front" d="M24 6h19l8 8v30H24z" fill="#292333" stroke="#b09bcf" strokeWidth="1.5" strokeLinejoin="round" /><path d="M43 6v9h8" stroke="#a58cbd" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="m32.5 22-4 4 4 4m10-8 4 4-4 4m-3-9-4 11" stroke="#d5c2f5" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
    </svg><span>{selected ? <FileCode2 size={11} /> : <Upload size={11} />}</span>
  </span>;
}
