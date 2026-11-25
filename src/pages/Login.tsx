import { Link, Navigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Fingerprint } from 'lucide-react';
import { useSite } from '../components/site/SiteSession';
import { entryDestination } from '../components/site/entry';

export function Login() {
  const { guest, enterGuest } = useSite();
  const { state } = useLocation();
  if (guest) return <Navigate replace to={entryDestination(state)} />;
  return (
    <section className="entry-page" aria-labelledby="entry-title">
      <div className="entry-panel">
        <div className="entry-mark">
          <Fingerprint aria-hidden="true" />
        </div>
        <p className="site-label">Workspace access</p>
        <h1 id="entry-title">
          Log in<span>.</span>
        </h1>
        <p className="entry-intro">Explore ZeoxFucator as a guest. Account sign-in isn’t connected in this preview.</p>
        <button type="button" className="site-cta" onClick={enterGuest}>
          Continue as guest <ArrowRight aria-hidden="true" />
        </button>
        <p className="entry-note">No email or password needed. Your files stay on this device.</p>
        <Link className="site-text-link" to="/">
          <ArrowLeft aria-hidden="true" /> Back to the site
        </Link>
      </div>
    </section>
  );
}
