import { useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react';
import { X } from 'lucide-react';

interface Props {
  title: string;
  titleId: string;
  close: () => void;
  closeLabel: string;
  children: ReactNode;
  className?: string;
  initialFocus?: RefObject<HTMLElement>;
  returnFocus?: RefObject<HTMLElement>;
}

export function PanelDialog({
  title,
  titleId,
  close,
  closeLabel,
  children,
  className = '',
  initialFocus,
  returnFocus,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useLayoutEffect(() => {
    const el = ref.current!,
      opener = document.activeElement,
      overflow = document.body.style.overflow;
    el.showModal();
    initialFocus?.current?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    return () => {
      el.close();
      document.body.style.overflow = overflow;
      // A drawer action can remount as an icon in the short, scrollable rail.
      const trigger = returnFocus?.current ?? opener;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: !returnFocus });
    };
  }, [initialFocus, returnFocus]);
  return (
    <dialog
      ref={ref}
      className={`ws-dialog ${className}`}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="ws-dialog-content">
        <header className="ws-dialog-header">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="ws-icon-button" onClick={close} aria-label={closeLabel}>
            <X size={17} />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  );
}
