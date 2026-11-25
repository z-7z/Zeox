import { Fragment, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ToolSessions } from './components/workspace/ToolSessions';
import { UsageProvider } from './components/workspace/UsageSession';
import type { SamplePeriod } from './components/dashboard/period';
import { Obfuscate } from './pages/Obfuscate';
import { VaultStudio } from './pages/VaultStudio';
import { Usages } from './pages/Usages';
import { Dashboard } from './pages/Dashboard';

const tools = [
  ['/obfuscate', 'Obfuscator'], ['/vault', 'Vault'], ['/usages', 'Usages'], ['/dashboard', 'Dashboard'],
] as const;

function Pages() {
  const { pathname, hash, key } = useLocation();
  const previous = useRef(key), main = useRef<HTMLElement>(null);
  const path = pathname.toLowerCase().replace(/\/$/, '') || '/obfuscate';
  const label = tools.find(([url]) => url === path)?.[1] ?? 'Page not found';
  useEffect(() => {
    document.title = label === 'Obfuscator' ? 'Lua Obfuscator — Zeox' : `${label} — Zeox Obfuscator`;
    const anchor = hash && document.getElementById(hash.slice(1));
    if (anchor) { anchor.focus({ preventScroll: true }); anchor.scrollIntoView(); }
    else if (previous.current !== key) { main.current?.focus({ preventScroll: true }); window.scrollTo(0, 0); }
    previous.current = key;
  }, [label, key, hash]);
  return <>
    <nav aria-label="Tools">{tools.map(([url, name], i) => <Fragment key={url}>
      {i > 0 && ' '}<Link to={url} aria-current={url === path ? 'page' : undefined}>{name}</Link>
    </Fragment>)}</nav>
    <main ref={main} tabIndex={-1}><Outlet /></main>
  </>;
}

export default function App() {
  const [period, setPeriod] = useState<SamplePeriod>(30);
  return <BrowserRouter><UsageProvider><ToolSessions><Routes>
    <Route element={<Pages />}>
      <Route index element={<Obfuscate />} />
      <Route path="obfuscate" element={<Obfuscate />} />
      <Route path="vault" element={<VaultStudio />} />
      <Route path="usages" element={<Usages />} />
      <Route path="dashboard" element={<Dashboard period={period} setPeriod={setPeriod} />} />
      <Route path="dashboard/overview" element={<Navigate replace to="/dashboard" />} />
      <Route path="showcase" element={<Navigate replace to="/dashboard" />} />
      <Route path="*" element={<><h1>Page not found</h1><Link to="/">Return to Obfuscator</Link></>} />
    </Route>
  </Routes></ToolSessions></UsageProvider></BrowserRouter>;
}
