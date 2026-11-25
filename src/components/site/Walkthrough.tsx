import { useState } from 'react';
import { Braces, LockKeyhole } from 'lucide-react';
import { useSite } from './SiteSession';
import sourceDark from '../../assets/guide/source-dark.webp';
import sourceLight from '../../assets/guide/source-light.webp';
import archiveDark from '../../assets/guide/archive-dark.webp';
import archiveLight from '../../assets/guide/archive-light.webp';

const guides = [
  {
    label: 'Script build',
    icon: Braces,
    title: 'Build a separate script.',
    limit: '512 KiB max',
    shot: {
      dark: sourceDark,
      light: sourceLight,
      height: 522,
      alt: 'Build settings showing switches for string encoding, comment removal and compact spacing.',
    },
    caption: 'The three source transforms in Build settings.',
    steps: [
      ['Attach a script', 'In Obfuscator, choose or drop one UTF-8 .lua or .luau file.'],
      [
        'Choose the transforms',
        'Switch text encoding, comment removal and compact spacing on or off. Select Obfuscate file.',
      ],
      [
        'Save the new copy',
        'Choose Download file. The original stays unchanged; this transforms source text, it does not encrypt it.',
      ],
    ],
  },
  {
    label: 'File archive',
    icon: LockKeyhole,
    title: 'Protect and restore a file.',
    limit: '25 MB max',
    shot: {
      dark: archiveDark,
      light: archiveLight,
      height: 576,
      alt: 'A ready .zeox archive receipt with its filename and Download .zeox button.',
    },
    caption: 'A download receipt from the built-in sample.',
    steps: [
      [
        'Choose a file',
        'Open File encryption from Obfuscator. Upload a script, Roblox asset or supported partial listing, or select Use sample.',
      ],
      [
        'Set a passphrase',
        'Enter and confirm at least 12 characters, then select Encrypt file. Keep the passphrase; there is no reset.',
      ],
      [
        'Download and restore',
        'When Ready, save the .zeox. To restore it, choose Decrypt, attach the archive and enter its passphrase. Select Decrypt file, then Download original.',
      ],
    ],
  },
] as const;

export function Walkthrough() {
  const { theme } = useSite();
  const [index, setIndex] = useState(0);
  const { title, limit, shot, caption, steps } = guides[index];
  return (
    <section id="quick-start" tabIndex={-1} className="site-width tour-section" aria-labelledby="tour-title">
      <div className="tour-heading">
        <div>
          <p className="site-label">
            <i aria-hidden="true" /> 01 / Field guide
          </p>
          <h2 id="tour-title">
            How it works<span>.</span>
          </h2>
        </div>
        <div className="tour-picker" role="group" aria-label="Choose a walkthrough">
          {guides.map(({ label, icon: Icon }, i) => (
            <button
              type="button"
              key={label}
              aria-pressed={index === i}
              aria-controls="walkthrough"
              onClick={() => setIndex(i)}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="tour-spread" id="walkthrough" role="region" aria-labelledby="walkthrough-title">
        <figure className="tour-figure">
          <div className="tour-shot">
            <img src={shot[theme]} width="848" height={shot.height} loading="lazy" decoding="async" alt={shot.alt} />
          </div>
          <figcaption>
            <b>FIG. 0{index + 2}</b> {caption}
          </figcaption>
        </figure>
        <div className="tour-text">
          <p className="site-label">
            {guides[index].label} <span>/</span> {limit}
          </p>
          <h3 id="walkthrough-title">{title}</h3>
          <ol>
            {steps.map(([name, detail]) => (
              <li key={name}>
                <strong>{name}</strong>
                <p>{detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
