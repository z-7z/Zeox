import { useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToolSessions } from './components/workspace/ToolSessions';
import { UsageProvider } from './components/workspace/UsageSession';
import type { SamplePeriod } from './components/dashboard/period';
import { Obfuscate } from './pages/Obfuscate';
import { Encryption } from './pages/Encryption';
import { Usages } from './pages/Usages';
import { Dashboard } from './pages/Dashboard';
import { Workspace } from './components/orbit/Workspace';
import { PageTitle } from './components/orbit/Panels';

function LegacyVaultLink() {
  const { hash, search } = useLocation();
  return <Navigate replace to={{ pathname: '/encrypt', hash, search }} />;
}

export default function App() {
  const [period, setPeriod] = useState<SamplePeriod>(30);
  return (
    <BrowserRouter>
      <UsageProvider>
        <ToolSessions>
          <Routes>
            <Route element={<Workspace />}>
              <Route index element={<Obfuscate />} />
              <Route path="obfuscate" element={<Obfuscate />} />
              <Route path="encrypt" element={<Encryption />} />
              <Route path="vault" element={<LegacyVaultLink />} />
              <Route path="usages" element={<Usages />} />
              <Route path="dashboard" element={<Dashboard period={period} setPeriod={setPeriod} />} />
              <Route path="dashboard/overview" element={<Navigate replace to="/dashboard" />} />
              <Route path="showcase" element={<Navigate replace to="/dashboard" />} />
              <Route
                path="*"
                element={
                  <>
                    <PageTitle title="Page not found" kicker="Workspace navigation" />
                    <section className="card">
                      <p>This tool does not exist.</p>
                      <Link className="pill paper" to="/">
                        Return to Obfuscator
                      </Link>
                    </section>
                  </>
                }
              />
            </Route>
          </Routes>
        </ToolSessions>
      </UsageProvider>
    </BrowserRouter>
  );
}
