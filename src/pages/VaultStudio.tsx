import { useEffect, useState } from 'react';
import type { StudioModal } from '../components/vault/StudioChrome';
import { Workbench } from '../components/vault/Workbench';
import { EnginePanel, SessionPanel } from '../components/vault/EnginePanels';
import { StudioDialog } from '../components/vault/StudioDialog';
import { CapacityTile } from '../components/workspace/InstrumentTiles';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { MAX_ARCHIVE, MAX_BYTES } from '../lib/vault/container';
import '../components/vault/studio.css';

export function VaultStudio() {
  const session = useVaultTool(),
    [modal, setModal] = useState<StudioModal>(null),
    forget = session.forgetPassphrase;
  useEffect(() => () => forget(), [forget]);
  return (
    <>
      <div className="station-board vt-app">
        <Workbench s={session} />
        <EnginePanel session={session} openGuide={() => setModal('guide')} />
        <CapacityTile
          limit={session.mode === 'encrypt' ? MAX_BYTES : MAX_ARCHIVE}
          label="25 MB"
          archive={session.mode === 'decrypt'}
          size={session.file?.size ?? null}
        />
        <section className="ws-panel station-flow container-map">
          <small className="eyebrow">ARCHIVE / V1</small>
          <h2>Container map</h2>
          <div aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p>
            <span>Header</span>
            <span>Payload</span>
            <span>Tag</span>
          </p>
        </section>
        <SessionPanel events={session.events} openLog={() => setModal('log')} />
      </div>
      {modal && (
        <StudioDialog
          kind={modal}
          close={() => setModal(null)}
          events={session.events}
          clearLog={session.clearLog}
        />
      )}
    </>
  );
}
