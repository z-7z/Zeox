import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { VaultStudio } from './pages/VaultStudio';

// The independent showcase pages keep their old data and styles out of the vault bundle.
const Overview = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Showcase = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));

export default function App() {
  return <BrowserRouter><Suspense fallback={<main role="status" className="p-6 text-sm text-neutral-400">Opening workspace…</main>}>
    <Routes>
      <Route path="/" element={<VaultStudio />} />
      <Route path="/dashboard" element={<VaultStudio />} />
      <Route path="/dashboard/overview" element={<Overview />} />
      <Route path="/showcase" element={<Showcase />} />
    </Routes>
  </Suspense></BrowserRouter>;
}
