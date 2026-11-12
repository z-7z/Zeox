/**
 * Skeleton Download System — public API.
 *
 * Usage:
 *   const dl = new SkeletonDownloader({ onStateChange, onProgress });
 *   const manifest = await dl.download({ kind: 'github', owner, repo });
 *   const report = dl.inspect();
 *   const plan = dl.planImport({ paths: [...] }, existingFiles);
 *   await dl.import(plan, resolutions, writeFile);
 *   dl.cleanup();
 */
export { SkeletonDownloader } from './downloader';
export { classifyPath, inspectStructure, extractDependencies, isExecutable } from './inspector';
export type * from './types';
