import { useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { FileCheck2, FileUp, Upload, X } from 'lucide-react';
import { formatSize } from '../lib/vault/container';
import { CardTitle } from './orbit/Panels';

export function FileName({ name }: { name: string }) {
  return (
    <bdi dir="ltr" className="file-name" title={name}>
      {name}
    </bdi>
  );
}
interface Props {
  legend: string;
  title: string;
  feedback?: ReactNode;
  label: string;
  accept: string;
  hint: string;
  file: { name: string; size: number } | null;
  limitLabel: string;
  select: (files: File[]) => void;
  remove: () => void;
  browse: RefObject<HTMLButtonElement>;
  choose?: string;
  reading?: boolean;
  disabled?: boolean;
  errorId?: string;
  extra?: ReactNode;
}
export function FilePicker({
  legend,
  title,
  feedback,
  label,
  accept,
  hint,
  file,
  select,
  remove,
  browse,
  choose = 'Choose file',
  reading,
  disabled,
  errorId,
  limitLabel,
  extra,
}: Props) {
  const input = useRef<HTMLInputElement>(null),
    depth = useRef(0),
    [drag, setDrag] = useState(false),
    hintId = useId();
  return (
    <fieldset
      id="source-file"
      className="card intake"
      tabIndex={-1}
      disabled={disabled}
      aria-busy={!!reading}
      data-drag={drag || undefined}
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled && e.dataTransfer.types.includes('Files')) {
          depth.current++;
          setDrag(true);
        }
      }}
      onDragLeave={() => {
        depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setDrag(false);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDrag(false);
        if (!disabled) select(Array.from(e.dataTransfer.files));
      }}
    >
      <legend className="sr-only">{legend}</legend>
      <CardTitle step="01" title={title}>
        <span className="quiet-badge">{limitLabel} max</span>
      </CardTitle>
      <input
        ref={input}
        type="file"
        hidden
        aria-label={label}
        accept={accept}
        onChange={(e) => {
          const files = Array.from(e.currentTarget.files ?? []);
          e.currentTarget.value = '';
          select(files);
        }}
      />
      <div className="drop-zone">
        <div className="drop-symbol" aria-hidden="true">
          {file ? <FileCheck2 /> : <FileUp />}
        </div>
        <div className="drop-copy">
          <b>
            {drag ? (
              'Drop to attach'
            ) : reading ? (
              <span role="status">Reading file…</span>
            ) : file ? (
              <FileName name={file.name} />
            ) : (
              'Drop your file here'
            )}
          </b>
          <p id={hintId}>{file ? `${formatSize(file.size)} · Attached locally` : hint}</p>
        </div>
        <div className="upload-actions">
          <button
            ref={browse}
            type="button"
            className="pill paper"
            aria-describedby={[hintId, errorId].filter(Boolean).join(' ')}
            onClick={() => input.current?.click()}
          >
            <Upload aria-hidden="true" />
            {file ? 'Replace file' : choose}
          </button>
          {(file || reading) && (
            <button
              type="button"
              className="round"
              aria-label="Remove file"
              title="Remove file"
              onClick={() => {
                remove();
                browse.current?.focus();
              }}
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      {extra && (
        <div className="intake-extra">
          <span>No file handy?</span>
          {extra}
        </div>
      )}
      {feedback}
    </fieldset>
  );
}
