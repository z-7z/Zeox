import { open, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import { readLift, READING_LIMIT } from '../src/lib/source/exf-reading.mjs';

export { readLift };

async function main([input, output, ...extra]) {
  if (!input || !output || extra.length || !output.toLowerCase().endsWith('.txt')) {
    throw new Error('Usage: node tools/read-exf.mjs "input.partial.lua.txt" "new.reading.txt"');
  }
  const file = await open(input, 'r');
  let source;
  try {
    const stat = await file.stat();
    if (!stat.isFile() || stat.size > READING_LIMIT) throw new Error('Choose a regular file up to 1 MiB.');
    source = new TextDecoder('utf-8', { fatal: true }).decode(await file.readFile());
  } finally { await file.close(); }
  const reading = readLift(source);
  await writeFile(output, reading, { flag: 'wx' }); // never replace the original or an earlier reading
  console.log(`New reading: ${output} (${Buffer.byteLength(reading)} bytes)`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(e => { console.error(e.message); process.exitCode = 1; });
}
