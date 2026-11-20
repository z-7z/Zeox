import { useEffect, useState } from 'react';
import type { StudioModal } from '../components/vault/StudioChrome';
import { Workbench } from '../components/vault/Workbench';
import { EnginePanel, SessionPanel } from '../components/vault/EnginePanels';
import { StudioDialog } from '../components/vault/StudioDialog';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import '../components/vault/studio.css';

export function VaultStudio() {
  const session = useVaultTool(), { motion } = useWorkspacePage();
  const [modal, setModal] = useState<StudioModal>(null);
  const forgetPassphrase = session.forgetPassphrase;
  useEffect(() => () => forgetPassphrase(), [forgetPassphrase]);
  return <div className="vt-app" data-motion={motion ? 'on' : 'off'}>
    <div className="ws-pair-grid"><Workbench s={session} /><aside className="vault-side-grid" aria-label="Vault status"><EnginePanel session={session} openGuide={() => setModal('guide')} /><SessionPanel events={session.events} openLog={() => setModal('log')} /></aside></div>
    {modal && <StudioDialog kind={modal} close={() => setModal(null)} events={session.events} clearLog={session.clearLog} />}
  </div>;
}
