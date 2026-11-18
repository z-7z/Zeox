// Chart geometry from the approved overview (b14bbc3). The series are a
// bundled, illustrative workspace, not tracked visitors or local session data.
export const period = 30;
export const stages = [
  { name: 'Opened', value: 72000 }, { name: 'Imported', value: 38200 },
  { name: 'Built', value: 16800 }, { name: 'Saved', value: 5600 },
];
export const formats = [
  { name: 'Luau', value: 698 }, { name: 'Lua 5.1', value: 516 }, { name: 'Places', value: 276 },
  { name: 'Models', value: 221 }, { name: 'Archives', value: 131 },
];
export const inputs = [
  { name: 'Luau scripts', value: 4100 }, { name: 'Lua scripts', value: 2900 }, { name: 'Roblox places', value: 1600 },
  { name: 'Roblox models', value: 980 }, { name: 'Zeox archives', value: 620 },
];
// Sample throughput, in decimal kilobytes, for each hour of each day.
export const hourlyKB = [
  [320, 300, 190, 220, 320, 340, 590, 720, 850, 1170, 1090, 1340, 1730, 1340, 1640, 1790, 1710, 2180, 2290, 2230, 2870, 2400, 2040, 1710],
  [370, 280, 210, 230, 300, 390, 630, 700, 990, 1190, 1100, 1570, 1690, 1420, 1860, 1710, 1910, 2380, 2180, 2580, 2980, 2340, 2390, 1710],
  [390, 270, 240, 230, 300, 440, 600, 720, 1110, 1110, 1200, 1680, 1570, 1630, 1910, 1640, 2210, 2330, 2200, 2950, 2830, 2510, 2640, 1590],
  [370, 280, 270, 230, 330, 480, 570, 830, 1140, 1070, 1390, 1640, 1590, 1850, 1800, 1760, 2430, 2180, 2470, 3100, 2670, 2900, 2640, 1560],
  [360, 320, 290, 220, 390, 480, 580, 970, 1100, 1170, 1560, 1570, 1840, 1980, 1740, 2070, 2490, 2180, 2910, 3040, 2840, 3320, 2520, 1750],
  [400, 410, 300, 260, 480, 500, 730, 1120, 1150, 1500, 1730, 1710, 2340, 2110, 2000, 2580, 2580, 2650, 3460, 3680, 4440, 4800, 4160, 2240],
  [370, 350, 230, 240, 390, 390, 680, 870, 970, 1360, 1300, 1510, 2040, 1590, 1850, 2130, 2000, 2480, 2750, 2570, 2830, 3250, 3080, 2000],
];
export const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const hour = (h: number) => `${h % 12 || 12}${h % 24 < 12 ? 'a' : 'p'}`;
export const compact = (n: number) => n.toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 });
export const number = (n: number) => n.toLocaleString('en-US');
export const total = (values: number[]) => values.reduce((a, b) => a + b, 0);
export type Chart = 'flow' | 'formats' | 'inputs' | 'hours';
export type Inspect = (chart: Chart, row?: number) => void;
