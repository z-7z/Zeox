import { dayBeforeEnd, type SamplePeriod } from './period';

// Independent of the in-memory Usages ledger. All graphs use the SAME sample window.
const counts = [48,53,54,51,56,57,55,56,57,59,60,58,59,61,60,61,63,63,64,65,63,67,65,64,67,69,70,69,72,76];
// Three consecutive eight-hour input measurements per sample day (MB).
// The white trace uses their rolling 24h sum; its daily closes are exactly the table values.
const windows = [[23,25,24],[24,27,24],[21,24,25],[27,28,23],[21,20,23],[28,29,26],[25,29,27],[32,31,29],[29,33,27],[34,32,29],[27,31,25],[30,26,29],[23,26,27],[29,26,27],[23,25,26],[28,27,26],[29,31,27],[24,28,27],[34,31,29],[35,34,30],[37,39,32],[30,35,31],[26,29,28],[30,27,29],[24,29,25],[29,29,26],[33,32,29],[34,36,31],[28,31,29],[33,29,30]];
const unsaved = [4,5,6,4,5,5,3,4,5,3,6,5,4,5,4,4,5,3,5,4,5,5,6,4,3,5,4,4,6,4];
const days = counts.map((files, i) => ({ time: dayBeforeEnd(counts.length - i - 1), files, saved: files - unsaved[i], windows: windows[i], mb: windows[i].reduce((a,b)=>a+b,0) }));
const totals = (rows: typeof days) => rows.reduce((sum, d) => ({ files: sum.files + d.files, saved: sum.saved + d.saved, mb: sum.mb + d.mb }), { files: 0, saved: 0, mb: 0 });
const formats = ['Luau', 'Lua 5.1', 'Places', 'Models', 'Archives'];
const operations = ['Build', 'Encrypt', 'Restore'];
const breakdown = (labels: string[], values: number[]) => labels.map((label, i) => ({ label, value: values[i] }));
export const number = (value: number) => value.toLocaleString('en-US');
export const change = (current: number, previous: number) => (current / previous - 1) * 100;
export function sampleReport(period: SamplePeriod) {
  const rows = days.slice(-period), current = totals(rows);
  const previous = period === 7 ? totals(days.slice(-14, -7)) : { files: 1769, saved: 1591, mb: 2378 };
  return { period, rows, current, previous,
    formats: breakdown(formats, period === 7 ? [192,128,82,56,29] : [698,516,276,221,131]),
    operations: breakdown(operations, period === 7 ? [233,167,87] : [931,602,309]) };
}
export type Report = ReturnType<typeof sampleReport>;
