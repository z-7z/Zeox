import { useEffect, useRef, useState, type ReactNode } from 'react';

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

/** Reveal on actual viewport entry (including below-the-fold mobile cards).
 * A single RAF coalesces pointer events. Only the hovered card gets a light position. */
export function MotionGrid({ children, enabled, className = 'db-grid' }: { children: ReactNode; enabled: boolean; className?: string }) {
  const grid = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = grid.current; if (!root || !enabled) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(':scope > .db-card'));
    const observer = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(entries => {
      let n = 0;
      for (const entry of entries) {
        const card = entry.target as HTMLElement;
        card.classList.toggle('art-in-view', entry.isIntersecting);
        if (!entry.isIntersecting || card.classList.contains('is-revealed')) continue;
        card.style.setProperty('--entry-delay', `${Math.min(n++, 4) * 45}ms`);
        card.classList.add('is-revealed');
      }
    }, { threshold: .08 }) : null;
    cards.forEach(card => observer ? observer.observe(card) : card.classList.add('art-in-view', 'is-revealed'));
    let frame = 0, latest: { card: HTMLElement; x: number; y: number } | undefined;
    function move(e: PointerEvent) {
      if (e.pointerType !== 'mouse' || !(e.target instanceof Element)) return;
      const card = e.target.closest<HTMLElement>('.db-card'); if (!card) return;
      latest = { card, x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0; if (!latest) return;
        const { card, x, y } = latest, box = card.getBoundingClientRect();
        card.style.setProperty('--art-turn', `${((x - box.left) / box.width * 5 - 2.5).toFixed(2)}deg`);
        card.style.setProperty('--light-x', `${Math.round(x - box.left)}px`);
        card.style.setProperty('--light-y', `${Math.round(y - box.top)}px`);
      });
    }
    root.addEventListener('pointermove', move, { passive: true });
    return () => { observer?.disconnect(); cancelAnimationFrame(frame); root.removeEventListener('pointermove', move); cards.forEach(card => card.classList.remove('art-in-view', 'is-revealed')); };
  }, [enabled]);
  return <div className={`${className} motion-grid`} ref={grid}>{children}</div>;
}
