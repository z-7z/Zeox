import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Braces, Cpu, Plus, ShieldCheck } from 'lucide-react';
import { Walkthrough } from '../components/site/Walkthrough';
import { useSite } from '../components/site/SiteSession';
import flux from '../assets/guide/flux.webp';
import fluxSmall from '../assets/guide/flux-small.webp';

const facts = [
  ['Source formats', 'Lua + Luau', Braces],
  ['Archive cipher', 'AES-256-GCM', ShieldCheck],
  ['Processing', 'On your device', Cpu],
] as const;
const questions = [
  [
    'Do my files leave my device?',
    'No. The browser reads and processes the file locally. The studio never uploads it or executes the script.',
  ],
  [
    'Is obfuscation the same as encryption?',
    'No. A source build rewrites readable text. To protect a file with a passphrase, create a .zeox archive and restore it before use.',
  ],
  [
    'What happens when I leave?',
    'Save any downloads you want to keep. Moving between pages keeps your attachments, but refreshing or ending the guest session clears the files and run history.',
  ],
] as const;

export function Main() {
  const { guest } = useSite();
  const entry = guest ? '/dashboard' : '/login';
  return (
    <>
      <section className="launch" aria-labelledby="launch-title">
        <div className="site-width launch-inner">
          <div className="launch-copy">
            <p className="site-label">
              <i aria-hidden="true" /> Browser-native file studio
            </p>
            <h1 id="launch-title">
              Lua tools.
              <br />
              <em>No uploads.</em>
            </h1>
            <p className="launch-lead">
              Transform a Lua script or seal a Roblox file with a passphrase. Your browser does the work. Your original
              stays yours.
            </p>
            <div className="launch-actions">
              <Link className="site-cta" to={entry}>
                {guest ? 'Open dashboard' : 'Get started'} <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="site-text-link" to="#quick-start">
                Explore the guide <ArrowDown aria-hidden="true" />
              </Link>
            </div>
          </div>
          <figure className="flux-scene">
            <span className="flux-cross" aria-hidden="true">
              +
            </span>
            <img
              src={flux}
              srcSet={`${fluxSmall} 640w, ${flux} 1220w`}
              sizes="(max-width: 680px) 94vw, (max-width: 1500px) 51vw, 730px"
              width="1220"
              height="976"
              alt="An orbital sculpture formed from twisting silver and violet ribbons."
            />
            <figcaption>
              <span>FIG. 01</span> Signal study
            </figcaption>
          </figure>
        </div>
      </section>
      <div className="spec-band">
        <dl className="site-width spec-row">
          {facts.map(([label, value, Icon]) => (
            <div key={label}>
              <dt>
                <Icon aria-hidden="true" />
                {label}
              </dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Walkthrough />
      <section id="questions" tabIndex={-1} className="faq-section" aria-labelledby="faq-title">
        <div className="site-width faq-inner">
          <div>
            <p className="site-label">
              <i aria-hidden="true" /> 02 / Notes
            </p>
            <h2 id="faq-title">
              Questions<span>?</span>
            </h2>
          </div>
          <div className="faq-list">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <Plus aria-hidden="true" />
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <div className="site-width closing">
        <p>Ready to start?</p>
        <Link className="site-cta" to={entry}>
          {guest ? 'Open dashboard' : 'Continue to log in'} <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
