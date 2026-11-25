import { useSite } from './SiteSession';
import attachDark from '../../assets/guide/attach-dark.webp';
import attachLight from '../../assets/guide/attach-light.webp';
import settingsDark from '../../assets/guide/source-dark.webp';
import settingsLight from '../../assets/guide/source-light.webp';
import saveDark from '../../assets/guide/save-dark.webp';
import saveLight from '../../assets/guide/save-light.webp';

const steps = [
  {
    title: 'Choose your script',
    text: 'Enter as a guest. From Dashboard, select Obfuscate a script and choose or drop your file.',
    picture: {
      dark: attachDark,
      light: attachLight,
      height: 410,
      alt: 'The workspace file chooser with the drop area and Choose file button.',
    },
  },
  {
    title: 'Set the transforms',
    text: 'Choose which changes to apply in Build settings. Select Obfuscate file when you’re ready.',
    picture: {
      dark: settingsDark,
      light: settingsLight,
      height: 522,
      alt: 'The workspace build settings with text encoding, comment removal and compact spacing enabled.',
    },
  },
  {
    title: 'Download the copy',
    text: 'When the script is ready, select Download file. Your original stays exactly as you wrote it.',
    picture: {
      dark: saveDark,
      light: saveLight,
      height: 446,
      alt: 'The ready download for greeting.obf.luau in the workspace.',
    },
  },
] as const;

export function Walkthrough() {
  const { theme } = useSite();
  return (
    <section id="quick-start" tabIndex={-1} className="build-manual" aria-labelledby="guide-title">
      <div className="site-width">
        <header className="manual-heading">
          <div>
            <span className="section-index" aria-hidden="true">
              02
            </span>
            <h2 id="guide-title">How it works</h2>
          </div>
          <p>
            One UTF-8 <code>.lua</code> or <code>.luau</code> file · 512 KiB max
          </p>
        </header>
        <ol className="manual-steps">
          {steps.map(({ title, text, picture }, i) => (
            <li key={title}>
              <div className="step-print">
                <img
                  src={picture[theme]}
                  width="848"
                  height={picture.height}
                  loading="lazy"
                  decoding="async"
                  alt={picture.alt}
                />
              </div>
              <div className="step-text">
                <span aria-hidden="true">0{i + 1} /</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
