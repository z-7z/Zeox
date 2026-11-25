import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, Braces, Cpu, FileCode2, Plus } from 'lucide-react';
import { Walkthrough } from '../components/site/Walkthrough';
import { useSite } from '../components/site/SiteSession';
import { BuildIllustration } from '../components/site/BuildIllustration';

const facts = [
  ['Source formats', 'Lua + Luau', Braces],
  ['Script limit', '512 KiB', FileCode2],
  ['Processing', 'On your device', Cpu],
] as const;
const questions = [
  [
    'Is my script uploaded or executed?',
    'No. ZeoxFucator reads your script as text in this browser tab. It never sends your source to a server or runs it.',
  ],
  [
    'Can the result still be read?',
    'Yes. Encoding rewrites plain quoted strings as decimal byte escapes. Identifiers keep their names, and Luau interpolated strings are left as written. Obfuscation is not encryption; don’t put secrets in your script.',
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
      <section className="launch" aria-labelledby="launch-title">
        <div className="site-width launch-inner">
          <div className="launch-copy">
            <p className="site-label">
              <i aria-hidden="true" /> Local Lua &amp; Luau source processing
            </p>
            <h1 id="launch-title">
              Lua <em>Obfuscator</em>
            </h1>
            <p className="launch-lead">
              Make your Lua or Luau script harder to read without uploading it. Encode strings, remove comments and
              compact spacing, then download the copy.
            </p>
            <div className="launch-actions">
              <Link className="site-cta" to={entry}>
                {guest ? 'Open dashboard' : 'Obfuscate a script'} <ArrowRight aria-hidden="true" />
              </Link>
              <Link className="site-text-link" to="#quick-start">
                See how it works <ArrowDown aria-hidden="true" />
              </Link>
            </div>
          </div>
          <BuildIllustration />
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
        <p>Ready to obfuscate?</p>
        <Link className="site-cta" to={entry}>
          {guest ? 'Open dashboard' : 'Continue to log in'} <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
