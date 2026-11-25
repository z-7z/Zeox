import { useEffect, useRef, useState } from 'react';
import { formatSize } from '../../lib/vault/container';
import { SplitFace } from '../orbit/Panels';
import type { SourceArtifact } from './session';

export function OutputFile({ file, focusDownload }: { file: SourceArtifact; focusDownload: boolean }) {
  const [url, setUrl] = useState(''),
    link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const next = URL.createObjectURL(file.blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [file]);
  useEffect(() => {
    if (url && focusDownload) link.current?.focus({ preventScroll: true });
  }, [url, focusDownload]);
  return (
    <>
      <span className="sr-only" role="status">
        {file.name} ({formatSize(file.blob.size)})
      </span>
      {url && (
        <a
          ref={link}
          className="split-action"
          title={`${file.name} (${formatSize(file.blob.size)})`}
          href={url}
          download={file.name}
        >
          <SplitFace>Download file</SplitFace>
        </a>
      )}
    </>
  );
}
