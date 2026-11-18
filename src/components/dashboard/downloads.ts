import layoutCss from './layout.css?inline';
import skeletonCss from './skeleton.css?inline';
import { days, type Overview } from './model';

export function downloadText(filename: string, type: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadSales(data: Overview) {
  const rows = data.hourlySales.flatMap((row, d) => row.map((value, h) => `${days[d]},${String(h).padStart(2, '0')}:00,${value}`));
  downloadText('zeox-hourly-sales.csv', 'text/csv;charset=utf-8', ['Day,Hour,Sales (USD)', ...rows].join('\r\n') + '\r\n');
}

// The only markup passed here is our own rendered DashboardSkeleton, not
// workspace inputs. The result works offline: no scripts, fonts, or CDN URLs.
export function downloadSkeleton(skeletonMarkup: string) {
  downloadText('zeox-overview-skeleton.html', 'text/html;charset=utf-8', `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Zeox · Overview skeleton</title>
<style>body{margin:0;background:#0b0b0b}main{max-width:1500px;padding:24px;margin:auto}${layoutCss}\n${skeletonCss}</style></head>
<body class="db-scene"><main>${skeletonMarkup}</main></body></html>`);
}
