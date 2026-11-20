import { downloadText } from '../../lib/download';
import material from '../workspace/material.css?inline';
import layout from './layout.css?inline';
import placeholders from './skeleton.css?inline';
import tiles from './skeleton.html?raw';
import './layout.css';
import './skeleton.css';

// One static, authored fragment for both the loading state and the export.
// No file contents, usage data, user markup or remote resources are included.
export function DashboardSkeleton() {
  return <div className="overview-grid db-skeleton" role="status" aria-label="Opening dashboard" dangerouslySetInnerHTML={{ __html: tiles }} />;
}

export function downloadSkeleton() {
  downloadText('zeox-overview-skeleton.html', 'text/html;charset=utf-8', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zeox · Overview skeleton</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100vh}${material}\n${layout}\n${placeholders}</style></head>
<body class="db-scene"><main aria-label="Dashboard layout skeleton"><div class="overview-grid db-skeleton">${tiles}</div></main></body></html>`);
}
