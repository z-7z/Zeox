import { useEffect, useRef, useState } from 'react';
import { formatSize } from '../../lib/vault/container';
import { FileName } from '../FilePicker';
import type { SourceArtifact } from './session';

export function OutputFile({ file, focusDownload }: { file: SourceArtifact; focusDownload: boolean }) {
  const [url, setUrl] = useState(''), link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const next = URL.createObjectURL(file.blob); setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  useEffect(() => { if (url && focusDownload) link.current?.focus(); }, [url, focusDownload]);
  return <>
    <p role="status"><FileName name={file.name} /> ({formatSize(file.blob.size)})</p>
    {url && <a ref={link} href={url} download={file.name}>Download file</a>}
  </>;
}
