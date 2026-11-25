import { useId, useLayoutEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Native top layer keeps the page (including the fixed phone dock) inert. */
export function Dialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null),
    id = useId();
  useLayoutEffect(() => {
    const el = ref.current!,
      opener = document.activeElement,
      overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = 'hidden';
    el.querySelector<HTMLElement>('[data-first]')?.focus();
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="sheet"
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="sheet-inner">
        <header>
          <h2 id={id}>{title}</h2>
          <button className="round" type="button" aria-label="Close dialog" onClick={close}>
            <X aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
