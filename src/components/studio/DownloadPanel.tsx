import { useEffect, useRef, type ReactNode } from 'react';
import { Check, Code2, Download, FileCheck2, LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { FileName } from '../FilePicker';
import { formatSize } from '../../lib/vault/container';

export interface JobProgress {
  title: string;
  step: string;
  completed: number;
  total: number;
}
interface Props {
  kind: 'script' | 'encrypt' | 'decrypt';
  note: string;
  job?: JobProgress;
  result?: { name: string; size: number };
  failed?: boolean;
  followJob?: boolean;
  children?: ReactNode;
}

// A stage count describes completed operations, not estimated bytes or elapsed time.
// Web Crypto doesn't expose a percentage inside deriveKey/encrypt/decrypt.
function Progress({ job }: { job: JobProgress }) {
  const label = `${job.step} · Step ${job.completed + 1} of ${job.total}`;
  return (
    <div className="job-progress">
      <div className="progress-caption">
        <b role="status">{job.step}</b>
        <small>
          {String(job.completed + 1).padStart(2, '0')} / {String(job.total).padStart(2, '0')}
        </small>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={job.title}
        aria-valuemin={0}
        aria-valuemax={job.total}
        aria-valuenow={job.completed}
        aria-valuetext={label}
      >
        <i style={{ width: `${(100 * job.completed) / job.total}%` }} />
        <i className="current-stage" style={{ width: `${100 / job.total}%` }} />
      </div>
    </div>
  );
}

export function DownloadPanel({ kind, note, job, result, failed, followJob, children }: Props) {
  const pending = !!job,
    body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pending && followJob) {
      body.current?.focus({ preventScroll: true });
      body.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [pending, followJob]);
  const Icon = kind === 'script' ? Code2 : kind === 'encrypt' ? LockKeyhole : UnlockKeyhole;
  const extension = kind === 'script' ? 'LUA' : kind === 'encrypt' ? 'ZEOX' : 'ORIGINAL';
  const state = pending ? 'Working' : result ? 'Ready' : failed ? 'Not created' : 'Standby';
  return (
    <section
      id="build-output"
      className="download-panel"
      tabIndex={-1}
      aria-label={kind !== 'script' && result ? 'Archive result' : 'File download'}
      data-state={state}
    >
      <header className="output-head">
        <span>
          <Download aria-hidden="true" /> Download
        </span>
        <small className="output-state">
          <i />
          {state}
        </small>
      </header>
      <div className="artifact-stage" aria-hidden="true">
        <span className="cross c1" />
        <span className="cross c2" />
        <div className="artifact">
          <i className="paper-back" />
          <div className="file-sheet">
            <span className="paper-mark">ZF / 01</span>
            <Icon />
            <b>{extension}</b>
          </div>
        </div>
        <small>
          {kind === 'encrypt' ? 'ENCRYPTED ARCHIVE' : kind === 'script' ? 'SOURCE SCRIPT' : 'RESTORED FILE'}
        </small>
      </div>
      <div className="output-body" ref={body} tabIndex={-1}>
        {job ? (
          <>
            <Progress job={job} />
            <div className="download-skeleton" role="group" aria-busy="true" aria-label="Preparing download">
              <div aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
            </div>
          </>
        ) : result ? (
          <>
            <div className="ready-line">
              <FileCheck2 aria-hidden="true" />
              <span>
                File ready <i>·</i> {formatSize(result.size)}
              </span>
            </div>
            <h2 className="output-name">
              <FileName name={result.name} />
            </h2>
            <p>{note}</p>
            <div className="result-actions">{children}</div>
          </>
        ) : (
          <>
            <p className="output-label">{failed ? 'Job stopped' : 'Output tray'}</p>
            <h2>{failed ? 'No download created' : 'Waiting for output'}</h2>
            <p>{note}</p>
          </>
        )}
      </div>
      <footer className="output-footer">
        <Check aria-hidden="true" /> Your original file is never overwritten.
      </footer>
    </section>
  );
}
