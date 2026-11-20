import { useEffect, useState } from 'react';

export function useMotion() {
  const [chosen, setChosen] = useState(true);
  const [systemReduced, setSystemReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setSystemReduced(query.matches);
    query.addEventListener('change', change); return () => query.removeEventListener('change', change);
  }, []);
  return { enabled: chosen && !systemReduced, systemReduced, toggle: () => setChosen(v => !v) };
}
export type MotionState = ReturnType<typeof useMotion>;
