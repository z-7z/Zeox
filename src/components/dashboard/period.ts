// A dated, bundled illustration, never 'today' or live usage data.
export type SamplePeriod = 7 | 30;
export const sampleEnd = Date.UTC(2026, 4, 15);
export const dayBeforeEnd = (offset: number) => sampleEnd - offset * 86_400_000;
const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
export const dayLabel = (time: number) => date.format(time);
export const dateRange = (period: SamplePeriod) => `${dayLabel(dayBeforeEnd(period - 1))} – ${dayLabel(sampleEnd)}, 2026`;
