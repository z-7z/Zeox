import { useEffect, useRef, type ReactNode } from 'react';
import { Check, Code2, LockKeyhole, UnlockKeyhole } from 'lucide-react';
import { CardTitle } from '../orbit/Panels';
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
  suggestedName?: string;
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

export function DownloadPanel({ kind, note, job, result, suggestedName, failed, followJob, children }: Props) {
  const pending = !!job,
    body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pending && followJob) {
      body.current?.focus({ preventScroll: true });
      body.current?.scrollIntoView({ block: 'nearest' });
    }
  }, [pending, followJob]);
  const Icon = kind === 'script' ? Code2 : kind === 'encrypt' ? LockKeyhole : UnlockKeyhole;
  const extension = kind === 'script' ? 'LUA' : kind === 'encrypt' ? 'ZEOX' : 'FILE';
  const state = pending ? 'Working' : result ? 'Ready' : failed ? 'Not created' : 'Waiting';
  return (
    <section
      id="build-output"
      className="card download-panel"
      tabIndex={-1}
      aria-label={kind !== 'script' && result ? 'Archive result' : 'File download'}
      data-state={state}
    >
      <CardTitle
        step="03"
        title={
          kind === 'encrypt'
            ? 'Download your archive'
            : kind === 'decrypt'
              ? 'Download your restored file'
              : 'Download your script'
        }
      >
        <span className="output-state">
          <i aria-hidden="true" />
          {state}
        </span>
      </CardTitle>
      <div className="output-body" ref={body} tabIndex={-1}>
        <div className="file-stamp" aria-hidden="true">
          <Icon />
          <b>{extension}</b>
        </div>
        {job ? (
          <div className="pending-body">
            <Progress job={job} />
            <div className="download-skeleton" role="group" aria-busy="true" aria-label="Preparing download">
              <i />
              <i />
              <i />
            </div>
          </div>
        ) : (
          <>
            <div className="output-copy">
              {result ? (
                <>
                  <small className="ready-line">
                    <Check aria-hidden="true" />
                    File ready · {formatSize(result.size)}
                  </small>
                  <h3>
                    <FileName name={result.name} />
                  </h3>
                </>
              ) : failed ? (
                <h3>No download created</h3>
              ) : suggestedName ? (
                <>
                  <small>Suggested filename</small>
                  <h3>
                    <FileName name={suggestedName} />
                  </h3>
                </>
              ) : (
                <h3>
                  {kind === 'encrypt'
                    ? 'Encrypted copy (.zeox)'
                    : kind === 'decrypt'
                      ? 'Original file'
                      : 'Transformed copy'}
                </h3>
              )}
              <p>{note}</p>
            </div>
            {result && <div className="result-actions">{children}</div>}
          </>
        )}
      </div>
    </section>
  );
}
