import { useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToolSessions } from './components/workspace/ToolSessions';
import { UsageProvider } from './components/workspace/UsageSession';
import type { SamplePeriod } from './components/dashboard/period';
import { PublicLayout } from './components/site/PublicLayout';
import { SiteProvider, useSite } from './components/site/SiteSession';
import { RouteEffects } from './components/site/RouteEffects';
import { Main } from './pages/Main';
import { Login } from './pages/Login';
import { Obfuscate } from './pages/Obfuscate';
import { Encryption } from './pages/Encryption';
import { Usages } from './pages/Usages';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './components/orbit/Workspace';

function Alias({ to }: { to: string }) {
  const { hash, search } = useLocation();
  return <Navigate replace to={{ pathname: to, hash, search }} />;
}

function StartPage() {
  const { hash } = useLocation();
  // The source workbench used to be the index. Keep its bookmarked sections working.
  if (['#source-file', '#build-settings', '#build-output'].includes(hash)) return <Alias to="/obfuscate" />;
  return <Main />;
}

function WorkspaceEntry() {
  const { guest } = useSite();
  const { pathname, search, hash } = useLocation();
  return guest ? <Workspace /> : <Navigate replace to="/login" state={{ resume: { pathname, search, hash } }} />;
}

function Pages() {
  const [period, setPeriod] = useState<SamplePeriod>(30);
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<StartPage />} />
        <Route path="login" element={<Login />} />
        <Route
          path="*"
          element={
            <section className="entry-page">
              <div className="entry-panel">
                <p className="site-label">404</p>
                <h1>Page not found</h1>
                <Link className="site-cta" to="/">
                  Return to Main
                </Link>
              </div>
            </section>
          }
        />
      </Route>
      <Route element={<WorkspaceEntry />}>
        <Route path="dashboard" element={<Dashboard period={period} setPeriod={setPeriod} />} />
        <Route path="obfuscate" element={<Obfuscate />} />
        <Route path="encrypt" element={<Encryption />} />
        <Route path="usages" element={<Usages />} />
      </Route>
      <Route path="main" element={<Alias to="/" />} />
      <Route path="vault" element={<Alias to="/encrypt" />} />
      <Route path="dashboard/overview" element={<Alias to="/dashboard" />} />
      <Route path="showcase" element={<Alias to="/dashboard" />} />
    </Routes>
  );
}

function SessionPages() {
  const { guest } = useSite();
  // No tool controllers on first arrival. Keep them alive while a guest visits
  // the public site, and discard all file and ledger state when the guest exits.
  return guest ? (
    <UsageProvider>
      <ToolSessions>
        <Pages />
      </ToolSessions>
    </UsageProvider>
  ) : (
    <Pages />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SiteProvider>
        <RouteEffects />
        <SessionPages />
      </SiteProvider>
    </BrowserRouter>
  );
}
