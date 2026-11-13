import type { MouseEvent } from 'react';

export function scrollToSection(event: MouseEvent<HTMLAnchorElement>, targetId: string) {
  event.preventDefault();
  const target = document.getElementById(targetId);
  if (!target) return;

  target.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}
