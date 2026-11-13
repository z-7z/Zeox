import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page-enter" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:section" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  );
}
