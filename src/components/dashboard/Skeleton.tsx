import { downloadText } from '../../lib/download';
import material from '../workspace/material.css?inline';
import layout from './layout.css?inline';
import shimmer from './skeleton.css?inline';
import './layout.css';
import './skeleton.css';

const slots = ['portal', 'portal', 'module', 'module'] as const;
const tileClass = (slot: typeof slots[number]) => `glass-card sk-tile overview-${slot}`;
export function DashboardSkeleton() {
  return <div className="overview sk-overview" role="status" aria-label="Opening dashboard"><div className="sk-title" />
    <div className="overview-grid" aria-hidden="true">{slots.map((slot, i) => <div key={i} className={tileClass(slot)}><i /></div>)}</div>
  </div>;
}

// Export the same four slots, without any session data, scripts or remote assets.
export function downloadSkeleton() {
  const tiles = slots.map(slot => `<div class="${tileClass(slot)}"><i></i></div>`).join('');
  downloadText('zeox-overview-skeleton.html', 'text/html;charset=utf-8', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zeox · Dashboard skeleton</title>
<style>*{box-sizing:border-box}body{margin:0;padding:clamp(12px,3vw,40px);min-height:100vh;background:radial-gradient(ellipse at 78% 0,#333,transparent 60%),#101010}main{margin:auto}${material}\n${layout}\n${shimmer}</style></head>
<body class="db-scene"><main class="overview sk-overview" aria-label="Dashboard layout skeleton"><div class="sk-title"></div><div class="overview-grid" aria-hidden="true">${tiles}</div></main></body></html>`);
}
