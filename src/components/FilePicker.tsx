import { Fragment, useRef, type RefObject } from 'react';
import { formatSize } from '../lib/vault/container';

// Break opportunities affect display only, not the name passed to download.
export function FileName({ name }: { name: string }) {
  return <bdi dir="ltr">{name.match(/[\s\S]{1,16}/gu)?.map((part, i) =>
    <Fragment key={i}>{i > 0 && <wbr />}{part}</Fragment>)}</bdi>;
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
}

export function FilePicker({ legend, label, accept, hint, file, select, remove, browse, choose = 'Choose file', reading, disabled, errorId }: Props) {
  const input = useRef<HTMLInputElement>(null);
  return <fieldset id="source-file" tabIndex={-1} disabled={disabled} aria-busy={!!reading}
    onDragOver={e => e.preventDefault()}
    onDrop={e => { e.preventDefault(); if (!disabled) select(Array.from(e.dataTransfer.files)); }}>
    <legend>{legend}</legend>
    <input ref={input} type="file" hidden aria-label={label} accept={accept} onChange={e => {
      const files = Array.from(e.currentTarget.files ?? []);
      e.currentTarget.value = ''; // Selecting the same file again counts as a replacement.
      select(files);
    }} />
    <button ref={browse} type="button" aria-describedby={errorId} onClick={() => input.current?.click()}>
      {file ? 'Replace file' : choose}
    </button>{' '}
    {(file || reading) && <button type="button" onClick={() => { remove(); browse.current?.focus(); }}>Remove file</button>}
    <div>{hint}</div>
    {reading ? <div role="status">Reading file…</div> : file && <div><FileName name={file.name} /> ({formatSize(file.size)})</div>}
  </fieldset>;
}
