import { useRef, useState, type DragEvent } from 'react';
import { CircleAlert, FileCode2, FileUp, RefreshCw, X } from 'lucide-react';
import { formatSize } from '../../lib/vault/container';
import type { SourceSession } from './session';

export function AttachmentField({ tool }: { tool: SourceSession }) {
  const input = useRef<HTMLInputElement>(null), browse = useRef<HTMLButtonElement>(null), depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const { file, reading, issue } = tool, fileIssue = issue?.field === 'file' ? issue.message : null;
  const action = file ? 'Replace file' : 'Choose file';
  function enter(e: DragEvent) {
    e.preventDefault(); if (e.dataTransfer.types.includes('Files')) { depth.current++; setDragging(true); }
  }
  function leave(e: DragEvent) {
    e.preventDefault(); depth.current = Math.max(0, depth.current - 1); if (!depth.current) setDragging(false);
  }
  function drop(e: DragEvent) {
    e.preventDefault(); depth.current = 0; setDragging(false);
    void tool.attach(Array.from(e.dataTransfer.files));
  }
  return <>
    <div className="src-intake intake-surface" role="group" aria-label="Source file" aria-busy={reading} data-dragging={dragging || undefined} data-attached={!!file || undefined}
      onDragEnter={enter} onDragLeave={leave} onDragOver={e => { e.preventDefault(); if (e.dataTransfer.types.includes('Files')) e.dataTransfer.dropEffect = 'copy'; }} onDrop={drop}>
      <input ref={input} type="file" accept=".lua,.luau" hidden aria-label="Attach Lua or Luau file" onChange={e => {
        const files = Array.from(e.currentTarget.files ?? []); e.currentTarget.value = ''; void tool.attach(files);
      }} />
      <button type="button" ref={browse} className="src-drop" aria-describedby={fileIssue ? 'src-file-error' : undefined} onClick={() => input.current?.click()}>
        <span className="src-file-stamp" aria-hidden="true"><FileCode2 strokeWidth={1.35} /></span>
        <span className="src-file-title" title={file?.name}>{dragging ? 'Drop to attach' : reading ? 'Reading file…' : file ? <bdi dir="ltr">{file.name}</bdi> : 'Drop your script here'}</span>
        <span className="src-file-meta">{file ? `${/\.luau$/i.test(file.name) ? 'Luau' : 'Lua'} · ${formatSize(file.size)} · UTF-8` : '.lua or .luau · 512 KiB max'}</span>
        <span className="src-browse">{file ? <RefreshCw size={14} /> : <FileUp size={15} />}{action}</span>
      </button>
      {(file || reading) && <button type="button" className="ws-quiet src-remove" aria-label="Remove file" title="Remove file" onClick={() => { tool.remove(); browse.current?.focus(); }}><X size={15} /></button>}
    </div>
    {fileIssue && <p className="src-error" role="alert" id="src-file-error"><CircleAlert size={15} aria-hidden="true" /><span>{fileIssue}{file && ' Your previous file is still attached.'}</span></p>}
  </>;
}
