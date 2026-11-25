import { Check } from 'lucide-react';

/** Use inside a label. The real checkbox keeps keyboard, label and fieldset behavior. */
export function Toggle({
  checked,
  change,
  labelledBy,
  describedBy,
}: {
  checked: boolean;
  change: (checked: boolean) => void;
  labelledBy: string;
  describedBy?: string;
}) {
  return (
    <span className="zf-toggle">
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => change(e.target.checked)}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
      />
      <span className="toggle-track" aria-hidden="true">
        <i>
          <Check />
        </i>
      </span>
    </span>
  );
}
