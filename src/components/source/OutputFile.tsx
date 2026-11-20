import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, FileCheck2 } from 'lucide-react';
import { formatSize } from '../../lib/vault/container';
import type { SourceArtifact } from './session';

export function OutputFile({ file, focusDownload }: { file: SourceArtifact; focusDownload: boolean }) {
  const [url, setUrl] = useState(''), link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const next = URL.createObjectURL(file.blob); setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  useEffect(() => { if (url && focusDownload) link.current?.focus({ preventScroll: true }); }, [url, focusDownload]);
  return <>
    <div className="src-result" role="status"><FileCheck2 size={20} aria-hidden="true" /><div>
      <small>Output ready · {formatSize(file.blob.size)}</small><bdi dir="ltr" title={file.name}>{file.name}</bdi>
    </div></div>
    {url && <a ref={link} href={url} download={file.name} className="ws-button ws-primary src-action"><ArrowDownToLine size={15} aria-hidden="true" />Download file</a>}
  </>;
}
