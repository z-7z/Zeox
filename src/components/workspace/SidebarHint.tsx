import { useEffect, useRef, useState, type RefObject } from 'react';

/** The mini rail scrolls independently. Put its visible labels outside the
 * scrollport so even the last item can show an unclipped callout. Links also
 * have an accessible name without relying on hover (notably on touch). */
export function SidebarHint({ rail }: { rail: RefObject<HTMLElement> }) {
  const [hint, setHint] = useState<{ text: string; left: number; top: number } | null>(null);
  const timer = useRef<number>();
  const cancelHide = () => window.clearTimeout(timer.current);
  const hideSoon = () => { cancelHide(); timer.current = window.setTimeout(() => setHint(null), 120); };
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const hide = () => { cancelHide(); setHint(null); };
    function show(target: EventTarget | null) {
      const item = target instanceof Element && target.closest<HTMLElement>('a[aria-label],button[aria-label]');
      if (!item || !el?.contains(item)) { hideSoon(); return; }
      cancelHide();
      const rect = item.getBoundingClientRect();
      setHint({ text: item.getAttribute('aria-label')!, left: el.getBoundingClientRect().right + 6,
        top: Math.min(innerHeight - 24, Math.max(24, rect.top + rect.height / 2)) });
    }
    const point = (e: PointerEvent) => { if (e.pointerType !== 'touch') show(e.target); };
    const focus = (e: FocusEvent) => { if (e.target instanceof Element && e.target.matches(':focus-visible')) show(e.target); };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') hide(); };
    el.addEventListener('pointerover', point); el.addEventListener('pointerout', hideSoon);
    el.addEventListener('focusin', focus); el.addEventListener('focusout', hide);
    el.addEventListener('click', hide); window.addEventListener('keydown', escape);
    window.addEventListener('resize', hide); window.addEventListener('scroll', hide, true);
    return () => {
      cancelHide(); el.removeEventListener('pointerover', point); el.removeEventListener('pointerout', hideSoon);
      el.removeEventListener('focusin', focus); el.removeEventListener('focusout', hide);
      el.removeEventListener('click', hide); window.removeEventListener('keydown', escape);
      window.removeEventListener('resize', hide); window.removeEventListener('scroll', hide, true);
    };
  }, [rail]);
  return hint && <span className="side-hint" role="tooltip" style={{ left: hint.left, top: hint.top }}
    onPointerEnter={cancelHide} onPointerLeave={hideSoon}>{hint.text}</span>;
}
