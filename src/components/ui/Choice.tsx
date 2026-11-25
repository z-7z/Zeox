import { useLayoutEffect, useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

type Item<V> = { value: V; label: string };
interface Props<V extends string | number> {
  label: string;
  value: V;
  options: readonly Item<V>[];
  change: (value: V) => void;
  icon?: LucideIcon;
  disabled?: boolean;
  describedBy?: string;
  id?: string;
}

/** The trigger and the open list use the same site controls on desktop and touch.
 * The headless primitive supplies typeahead, option focus, dismissal and collision handling. */
export function Choice<V extends string | number>({
  label,
  value,
  options,
  change,
  icon: Icon,
  disabled,
  describedBy,
  id,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  useLayoutEffect(() => {
    if (!open) return;
    // The options live in a body portal. Radix hides the background from AT;
    // also make it natively inert for the duration of this modal listbox.
    const background = document.getElementById('root');
    if (!background) return;
    const previous = background.inert;
    background.inert = true;
    return () => {
      background.inert = previous;
    };
  }, [open]);
  return (
    <Select.Root
      open={open}
      onOpenChange={setOpen}
      value={String(value)}
      disabled={disabled}
      onValueChange={(key) => {
        const item = options.find((o) => String(o.value) === key);
        if (item) change(item.value);
      }}
    >
      <Select.Trigger
        type="button"
        id={id}
        className="choice-trigger"
        aria-label={label}
        aria-describedby={describedBy}
      >
        {Icon && <Icon aria-hidden="true" />}
        <Select.Value />
        <Select.Icon asChild>
          <ChevronDown className="chevron" aria-hidden="true" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          align="end"
          sideOffset={6}
          collisionPadding={10}
          className="choice-menu"
          aria-label={label}
        >
          <Select.Viewport>
            {options.map((o) => (
              <Select.Item key={o.value} value={String(o.value)} className="choice-option">
                <Select.ItemText>{o.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check aria-hidden="true" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
