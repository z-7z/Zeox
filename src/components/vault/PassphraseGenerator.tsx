import { useState } from 'react';
import { Dices } from 'lucide-react';
import { Dialog } from '../orbit/Dialog';
import { Range } from '../ui/Range';
import { generatePassphrase, generatorLength } from './passphrase';

export function PassphraseGenerator({ apply, close }: { apply: (value: string) => void; close: () => void }) {
  const [length, setLength] = useState<number>(generatorLength.default);
  return (
    <Dialog title="Generate a passphrase" close={close}>
      <p>Create a random passphrase on this device. Save it somewhere safe before you encrypt the file.</p>
      <Range
        label="Passphrase length"
        unit="characters"
        min={generatorLength.min}
        max={generatorLength.max}
        value={length}
        change={setLength}
      />
      <div className="dialog-actions">
        <button type="button" className="pill" onClick={close}>
          Cancel
        </button>
        <button type="button" className="pill paper" onClick={() => apply(generatePassphrase(length))}>
          <Dices aria-hidden="true" /> Generate &amp; use
        </button>
      </div>
    </Dialog>
  );
}
