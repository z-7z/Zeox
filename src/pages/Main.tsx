import { Link, useOutletContext } from 'react-router-dom';
import { Activity, ArrowDown, ArrowRight, ArrowUpRight, BookOpen, ChartPie, Compass, HardDrive } from 'lucide-react';
import type { WorkspaceTheme } from '../components/orbit/Workspace';
import cover from '../assets/guide/file-study.webp';
import sourceDark from '../assets/guide/source-dark.webp';
import sourceLight from '../assets/guide/source-light.webp';
import archiveDark from '../assets/guide/archive-dark.webp';
import archiveLight from '../assets/guide/archive-light.webp';

const workflows = [
  {
    id: 'source',
    number: '01',
    tool: 'Obfuscator',
    limit: '512 KiB max',
    title: 'Build a Lua script',
    shot: {
      dark: sourceDark,
      light: sourceLight,
      height: 522,
      alt: 'Build settings with the switches for text literals, comments and spacing enabled.',
    },
    caption: 'The three switches in Build settings.',
    steps: [
      <>
        Use <strong>Choose file</strong> or drop one UTF-8 <code>.lua</code> or <code>.luau</code> script.
      </>,
      <>
        In <strong>Build settings</strong>, choose whether to encode strings, remove comments or compact spacing.
      </>,
      <>
        Select <strong>Obfuscate file</strong>, then <strong>Download file</strong>. This saves a separate script; it
        does not encrypt it.
      </>,
    ],
    url: '/obfuscate',
    action: 'Start a build',
  },
  {
    id: 'archive',
    number: '02',
    tool: 'Encryption',
    limit: '25 MB max',
    title: 'Protect and restore a file',
    shot: {
      dark: archiveDark,
      light: archiveLight,
      height: 576,
      alt: 'Ready archive receipt showing game-config.luau.zeox and its Download .zeox button.',
    },
    caption: 'The download receipt for the built-in sample.',
    steps: [
      <>
        Choose <strong>Upload file</strong> for a Lua/Luau script, Roblox place/model or supported partial listing. To
        try the tool without a file, choose <strong>Use sample</strong>.
      </>,
      <>
        Enter and confirm a passphrase of at least 12 characters, then select <strong>Encrypt file</strong>. Keep the
        passphrase; there is no reset.
      </>,
      <>
        When Ready, select <strong>Download .zeox</strong>. To restore it later, switch to <strong>Decrypt</strong>,
        attach the archive and enter the same passphrase. Select <strong>Decrypt file</strong>, then{' '}
        <strong>Download original</strong>.
      </>,
    ],
    url: '/encrypt',
    action: 'Open encryption',
  },
] as const;

export function Main() {
  const theme = useOutletContext<WorkspaceTheme>();
  return (
    <div className="main-page">
      <header className="main-mast">
        <div className="main-path">
          <Compass aria-hidden="true" />
          <h1>Main</h1>
          <span aria-hidden="true">/</span>
          <p>Workspace guide</p>
        </div>
        <Link className="jump-link" to="#quick-start">
          How to use <ArrowDown aria-hidden="true" />
        </Link>
      </header>

      <section className="card guide-cover" aria-labelledby="cover-title">
        <div className="cover-copy">
          <p className="guide-label">
            <i aria-hidden="true" /> ZeoxFucator field guide
          </p>
          <h2 id="cover-title">
            Your local
            <br />
            <em>file studio.</em>
          </h2>
          <p className="cover-description">
            Build a new copy of a Lua script or protect a file with a passphrase. Both tools run in this tab and leave
            the original untouched.
          </p>
          <div className="cover-actions">
            <Link className="pill paper" to="/obfuscate">
              Open Obfuscator <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="pill" to="/encrypt">
              File encryption <ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <figure className="cover-plate">
          <img
            src={cover}
            width="1250"
            height="938"
            alt="A sheet of paper held in a lilac folder with a metal seal and an orbit ring."
          />
          <figcaption>
            <span>Fig. 01</span> File study
          </figcaption>
        </figure>
      </section>

      <section className="quick-start" id="quick-start" tabIndex={-1} aria-labelledby="quick-start-title">
        <header className="guide-section-heading">
          <div>
            <p className="guide-label">
              <BookOpen aria-hidden="true" /> Illustrated walkthroughs
            </p>
            <h2 id="quick-start-title">How to use ZeoxFucator</h2>
          </div>
          <p>Choose the guide that fits your file.</p>
        </header>
        <div className="guide-grid">
          {workflows.map(({ id, number, tool, title, limit, shot, caption, steps, url, action }) => (
            <article className="card workflow-guide" key={id} aria-labelledby={`${id}-guide-title`}>
              <header>
                <div className="guide-meta">
                  <span className="guide-label">
                    {number} / {tool}
                  </span>
                  <span className="quiet-badge">{limit}</span>
                </div>
                <h3 className="underlined" id={`${id}-guide-title`}>
                  {title}
                </h3>
              </header>
              <figure className="guide-example">
                <div className="guide-shot">
                  <img
                    src={shot[theme]}
                    width="848"
                    height={shot.height}
                    loading="lazy"
                    decoding="async"
                    alt={shot.alt}
                  />
                </div>
                <figcaption>
                  <b>Example</b> {caption}
                </figcaption>
              </figure>
              <ol className="guide-steps-list">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <div className="guide-foot">
                <Link className="pill" to={url}>
                  {action} <ArrowRight aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="card workspace-notes" aria-labelledby="workspace-notes-title">
        <div>
          <p className="guide-label">
            <HardDrive aria-hidden="true" /> Session notes
          </p>
          <h2 id="workspace-notes-title">Before you close this tab</h2>
          <p>
            Switching pages keeps your attached files. Refreshing or closing this tab clears the workspace, so save the
            downloads you want to keep.
          </p>
        </div>
        <div className="notes-links">
          <Link to="/usages">
            <Activity aria-hidden="true" />
            <span>
              <b>Usages</b>
              <small>See the successful operations in this tab.</small>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </Link>
          <Link to="/dashboard">
            <ChartPie aria-hidden="true" />
            <span>
              <b>Dashboard</b>
              <small>Explore a sample report, not your activity.</small>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
