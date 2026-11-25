import { useSite } from './SiteSession';
import sourceDark from '../../assets/guide/source-dark.webp';
import sourceLight from '../../assets/guide/source-light.webp';

export function Walkthrough() {
  const { theme } = useSite();
  return (
    <section id="quick-start" tabIndex={-1} className="site-width tour-section" aria-labelledby="tour-title">
      <header className="tour-heading">
        <p className="site-label">
          <i aria-hidden="true" /> 01 / Obfuscation guide
        </p>
        <h2 id="tour-title">
          How it works<span>.</span>
        </h2>
      </header>
      <div className="tour-spread">
        <figure className="tour-figure">
          <div className="tour-shot">
            <img
              src={theme === 'dark' ? sourceDark : sourceLight}
              width="848"
              height="522"
              loading="lazy"
              decoding="async"
              alt="The Obfuscator’s build settings with text encoding, comment removal and compact spacing enabled."
            />
          </div>
          <figcaption>
            <b>Build settings</b> Each transform can be switched on or off independently.
          </figcaption>
        </figure>
        <div className="tour-text">
          <p className="site-label">One script / 512 KiB max</p>
          <h3>From source to download.</h3>
          <ol>
            <li>
              <strong>Choose your script</strong>
              <p>
                From the Dashboard, select Obfuscate a script. Choose or drop one UTF-8 <code>.lua</code> or{' '}
                <code>.luau</code> file.
              </p>
            </li>
            <li>
              <strong>Set the transforms</strong>
              <p>
                Choose whether to encode quoted strings, strip ordinary comments or compact whitespace. Select Obfuscate
                file.
              </p>
            </li>
            <li>
              <strong>Download the copy</strong>
              <p>Select Download file to save your new script. Your original file stays untouched.</p>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
