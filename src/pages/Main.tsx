import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowRight, Plus } from 'lucide-react';
import { LiteralStudy } from '../components/site/LiteralStudy';
import { LiveExample } from '../components/site/LiveExample';
import { Walkthrough } from '../components/site/Walkthrough';
import { useSite } from '../components/site/SiteSession';

const questions = [
  [
    'Is my script uploaded or executed?',
    'No. ZeoxFucator reads your source as text in this browser tab. It never sends your source to a server or runs it.',
  ],
  [
    'Can the result still be read?',
    'Yes. Plain quoted strings can become decimal byte escapes, but identifiers keep their names and Luau interpolated strings stay as written. Obfuscation is not encryption; don’t put secrets in your script.',
  ],
  [
    'What happens when I leave?',
    'Save the copy you want to keep. You can move between workspace pages without losing your script, but refreshing or ending the guest session clears this tab’s build.',
  ],
] as const;

export function Main() {
  const { guest } = useSite();
  const entry = guest ? '/dashboard' : '/login';
  return (
    <>
      <section className="site-width landing-intro" aria-labelledby="landing-title">
        <div>
          <p className="source-imprint">
            <i aria-hidden="true" /> Source processing <span aria-hidden="true">/</span> Lua + Luau
          </p>
          <h1 id="landing-title">
            Lua Obfuscator
            <span aria-hidden="true" />
          </h1>
          <p className="landing-lead">
            Encode strings, strip comments and compact spacing. Download a separate script without uploading your
            source.
          </p>
          <div className="landing-actions">
            <Link className="site-cta" to={entry}>
              {guest ? 'Open dashboard' : 'Obfuscate a script'} <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="site-text-link" to="#quick-start">
              Read guide <ArrowDownRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <LiteralStudy />
      </section>
      <LiveExample />
      <Walkthrough />
      <section id="questions" tabIndex={-1} className="site-width source-notes" aria-labelledby="notes-title">
        <div>
          <header className="manual-heading">
            <div>
              <span className="section-index" aria-hidden="true">
                03
              </span>
              <h2 id="notes-title">Questions?</h2>
            </div>
          </header>
          <p>Ready to work on your own file?</p>
          <Link className="site-text-link" to={entry}>
            {guest ? 'Return to dashboard' : 'Continue to log in'} <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="notes-list">
          {questions.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
