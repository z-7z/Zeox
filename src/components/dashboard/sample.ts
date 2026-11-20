import { dayBeforeEnd, type SamplePeriod } from './period';

// Independent of the in-memory Usages ledger. All graphs use the SAME sample window.
const counts = [48,53,54,51,56,57,55,56,57,59,60,58,59,61,60,61,63,63,64,65,63,67,65,64,67,69,70,69,72,76];
const megabytes = [72,73,74,70,74,77,77,76,78,80,81,80,79,80,81,81,82,82,83,84,85,87,82,86,87,86,89,90,89,92];
const unsaved = [4,5,6,4,5,5,3,4,5,3,6,5,4,5,4,4,5,3,5,4,5,5,6,4,3,5,4,4,6,4];
const days = counts.map((files, i) => ({ time: dayBeforeEnd(counts.length - i - 1), files, saved: files - unsaved[i], mb: megabytes[i] }));
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
