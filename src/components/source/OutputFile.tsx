import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';
import { DownloadPanel } from '../studio/DownloadPanel';
import { formatSize } from '../../lib/vault/container';
import type { SourceArtifact } from './session';

export function SourceDownload({
  file,
  focusDownload,
  failed,
}: {
  file: SourceArtifact | null;
  focusDownload: boolean;
  failed: boolean;
}) {
  const [link, setLink] = useState<{ file: SourceArtifact; url: string } | null>(null),
    ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (!file) {
      setLink(null);
      return;
    }
    const url = URL.createObjectURL(file.blob);
    setLink({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const url = link?.file === file ? link?.url : undefined;
  useEffect(() => {
    if (url && focusDownload) ref.current?.focus();
  }, [url, focusDownload]);
  return (
    <DownloadPanel
      kind="script"
      result={file && url ? { name: file.name, size: file.blob.size } : undefined}
      failed={failed}
      job={
        file && !url ? { title: 'Preparing download', step: 'Preparing download', completed: 0, total: 1 } : undefined
      }
      note={
        failed
          ? 'Check the build error, then try again.'
          : file
            ? 'Your transformed script is ready to save.'
            : 'Build your script to get a downloadable Lua or Luau file.'
      }
    >
      {file && url && (
        <>
          <span className="sr-only" role="status">
            {file.name} ({formatSize(file.blob.size)})
          </span>
          <a className="run-action" ref={ref} href={url} download={file.name}>
            <Download aria-hidden="true" />
            Download file
          </a>
        </>
      )}
    </DownloadPanel>
  );
}
