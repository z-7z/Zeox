import { useRef, useState, type RefObject } from 'react';
import { ArrowUpRight, FileCode2, Upload, X } from 'lucide-react';
import { formatSize } from '../lib/vault/container';
import { SOURCE_LIMIT } from '../lib/source/compact';

export function FileName({ name }: { name: string }) {
  return (
    <bdi dir="ltr" className="file-name" title={name}>
      {name}
    </bdi>
  );
}
interface Props {
  legend: string;
  label: string;
  accept: string;
  hint: string;
  file: { name: string; size: number } | null;
  select: (files: File[]) => void;
  remove: () => void;
  browse: RefObject<HTMLButtonElement>;
  choose?: string;
  reading?: boolean;
  disabled?: boolean;
  errorId?: string;
  limit?: number;
}
export function FilePicker({
  legend,
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
  limit = SOURCE_LIMIT,
}: Props) {
  const input = useRef<HTMLInputElement>(null),
    depth = useRef(0),
    [drag, setDrag] = useState(false);
  const size = file ? formatSize(file.size) : '0 KB',
    [value, unit] = size.split(' ');
  return (
    <fieldset
      className="card file-card"
      id="source-file"
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
      <div className="file-card-inner">
        <div className="card-head">
          <h2 className="underlined">{legend}</h2>
          <button
            ref={browse}
            className="pill paper small"
            type="button"
            aria-describedby={errorId}
            onClick={() => input.current?.click()}
          >
            <Upload aria-hidden="true" />
            {file ? 'Replace file' : choose}
          </button>
        </div>
        <div className="file-value">
          <div className="metric-value">
            {value}
            <small>{unit}</small>
          </div>
          <span className="gain">
            <ArrowUpRight aria-hidden="true" />
            {file ? `${Math.min(100, Math.round((file.size / limit) * 100))}% used` : 'On device'}
          </span>
        </div>
        <div className="file-foot">
          {reading ? (
            <span role="status">Reading file…</span>
          ) : drag ? (
            <b>Drop to attach</b>
          ) : file ? (
            <>
              <FileCode2 aria-hidden="true" />
              <FileName name={file.name} />
            </>
          ) : (
            <span>{hint}</span>
          )}
          {(file || reading) && (
            <button
              type="button"
              className="round mini"
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
    </fieldset>
  );
}
