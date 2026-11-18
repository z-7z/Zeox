import { useEffect, useState } from 'react';
import { StudioFooter, StudioHeader, StudioHero, type StudioModal } from '../components/vault/StudioChrome';
import { Workbench } from '../components/vault/Workbench';
import { EnginePanel, SessionPanel } from '../components/vault/EnginePanels';
import { StudioDialog } from '../components/vault/StudioDialog';
import { useVaultSession } from '../components/vault/session';
import '../components/vault/studio.css';

export function VaultStudio() {
  const session = useVaultSession();
  const [modal, setModal] = useState<StudioModal>(null);
  const [motion, setMotion] = useState(true);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setSystemReduced(media.matches);
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  return <div className="vt-app" id="vault-top" data-motion={motion && !systemReduced ? 'on' : 'off'}>
    <a href="#workbench" className="vt-skip">Skip to file workbench</a>
    <StudioHeader open={setModal} />
    <main className="vt-main"><StudioHero openGuide={() => setModal('guide')} core={session.phase ? 'working' : session.result ? (session.mode === 'encrypt' ? 'sealed' : 'restored') : session.file ? 'loaded' : 'idle'} />
      <div className="vt-workspace"><Workbench s={session} /><aside className="vt-aside" aria-label="Workspace status"><EnginePanel session={session} /><SessionPanel events={session.events} openLog={() => setModal('log')} /></aside></div>
      <StudioFooter motion={motion} systemReduced={systemReduced} toggle={() => setMotion(enabled => !enabled)} />
    </main>
    {modal && <StudioDialog kind={modal} close={() => setModal(null)} events={session.events} clearLog={session.clearLog} />}
  </div>;
}
