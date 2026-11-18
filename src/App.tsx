import { lazy } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { WorkspaceLayout } from './components/workspace/WorkspaceLayout';
import { UsageProvider } from './components/workspace/UsageSession';
import { ToolSessions } from './components/workspace/ToolSessions';

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Obfuscate = lazy(() => import('./pages/Obfuscate').then(m => ({ default: m.Obfuscate })));
const Usages = lazy(() => import('./pages/Usages').then(m => ({ default: m.Usages })));
const Vault = lazy(() => import('./pages/VaultStudio').then(m => ({ default: m.VaultStudio })));

export default function App() {
  return <BrowserRouter><Routes>
    <Route element={<UsageProvider><ToolSessions><WorkspaceLayout /></ToolSessions></UsageProvider>}>
      <Route index element={<Dashboard />} /><Route path="dashboard" element={<Dashboard />} />
      <Route path="obfuscate" element={<Obfuscate />} /><Route path="usages" element={<Usages />} /><Route path="vault" element={<Vault />} />
    </Route>
    <Route path="dashboard/overview" element={<Navigate replace to="/dashboard" />} />
    <Route path="showcase" element={<Navigate replace to="/dashboard" />} />
    <Route path="*" element={<main className="ws-not-found"><small>ZEOX / 404</small><h1>Page not found</h1><Link to="/dashboard">Return to Dashboard →</Link></main>} />
  </Routes></BrowserRouter>;
}
