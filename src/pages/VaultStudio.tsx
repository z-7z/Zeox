import { useEffect, useState } from 'react';
import { BookOpen, History } from 'lucide-react';
import type { StudioModal } from '../components/vault/StudioChrome';
import { Workbench } from '../components/vault/Workbench';
import { EnginePanel, SessionPanel } from '../components/vault/EnginePanels';
import { StudioDialog } from '../components/vault/StudioDialog';
import { useVaultTool } from '../components/workspace/ToolSessions';
import { useWorkspacePage } from '../components/workspace/WorkspaceLayout';
import { PageHeading } from '../components/workspace/PageHeading';
import '../components/vault/studio.css';

export function VaultStudio() {
  const session = useVaultTool(), { motion } = useWorkspacePage();
  const [modal, setModal] = useState<StudioModal>(null);
  const forgetPassphrase = session.forgetPassphrase;
  useEffect(() => () => forgetPassphrase(), [forgetPassphrase]);
  return <div className="vt-app" data-motion={motion ? 'on' : 'off'}>
    <PageHeading title="Vault" eyebrow="Encrypted storage" badge="AES-256-GCM" description="Seal a local file with a passphrase, or restore a .zeox archive." actions={<>
      <button className="ws-button" onClick={() => setModal('log')} aria-label="Open session log"><History size={14} />Session log</button>
      <button className="ws-button" onClick={() => setModal('guide')} aria-label="Open studio guide"><BookOpen size={14} />Guide</button></>} />
    <div className="vt-workspace"><Workbench s={session} /><aside className="vt-aside" aria-label="Vault status"><EnginePanel session={session} /><SessionPanel events={session.events} openLog={() => setModal('log')} /></aside></div>
    {modal && <StudioDialog kind={modal} close={() => setModal(null)} events={session.events} clearLog={session.clearLog} />}
  </div>;
}
