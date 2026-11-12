import {
  classifyPath,
  extractDependencies,
  inspectStructure,
} from './inspector';
import type {
  FileConflict,
  ImportPlan,
  ImportResult,
  ImportSelection,
  SkeletonEvents,
  SkeletonFile,
  SkeletonManifest,
  SkeletonSource,
  SkeletonState,
  StructureReport,
  TempWorkspace,
} from './types';

const GITHUB_API = 'https://api.github.com';

/**
 * SkeletonDownloader — reusable engine for the Skeleton Download workflow.
 *
 * States: idle → downloading → downloaded → inspecting → inspected →
 *         selecting → (conflict confirmation) → importing → imported
 * with cleanup() available at any point after download.
 *
 * Safety rules enforced here:
 *  - Downloads land in an isolated TempWorkspace, never in app code.
 *  - Downloaded files are never executed.
 *  - Existing project files are never overwritten without an explicit
 *    per-file resolution ('overwrite' | 'rename' | 'skip').
 */
export class SkeletonDownloader {
  private state: SkeletonState = 'idle';
  private workspace: TempWorkspace | null = null;
  private manifest: SkeletonManifest | null = null;
  private report: StructureReport | null = null;

  constructor(private events: SkeletonEvents = {}) {}

  getState(): SkeletonState {
    return this.state;
  }

  getManifest(): SkeletonManifest | null {
    return this.manifest;
  }

  getReport(): StructureReport | null {
    return this.report;
  }

  getWorkspace(): TempWorkspace | null {
    return this.workspace;
  }

  private setState(state: SkeletonState, message: string) {
    this.state = state;
    this.events.onStateChange?.(state, message);
  }

  /** Step 1 — download a skeleton from a GitHub source into the temp workspace. */
  async download(source: SkeletonSource): Promise<SkeletonManifest> {
    this.setState('downloading', `Downloading skeleton from ${source.owner}/${source.repo}…`);

    const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };

    const repoRes = await fetch(`${GITHUB_API}/repos/${source.owner}/${source.repo}`, { headers });
    if (!repoRes.ok) throw new Error(`Repository not reachable: ${source.owner}/${source.repo} (${repoRes.status})`);
    const repoMeta = (await repoRes.json()) as { default_branch: string };
    const ref = source.ref ?? repoMeta.default_branch;

    const treeRes = await fetch(
      `${GITHUB_API}/repos/${source.owner}/${source.repo}/git/trees/${ref}?recursive=1`,
      { headers },
    );
    if (!treeRes.ok) throw new Error(`Could not read file tree for ref "${ref}" (${treeRes.status})`);
    const tree = (await treeRes.json()) as {
      tree: { path: string; type: string; size?: number }[];
      truncated?: boolean;
    };
    if (tree.truncated) {
      throw new Error('Repository tree is too large to inspect safely. Use a subdirectory or a smaller skeleton.');
    }

    const prefix = source.subdirectory ? `${source.subdirectory.replace(/\/+$/, '')}/` : '';
    const entries = tree.tree.filter(
      (e) => e.type === 'blob' && (!prefix || e.path.startsWith(prefix)),
    );

    const files: SkeletonFile[] = [];
    let done = 0;
    for (const entry of entries) {
      const res = await fetch(
        `${GITHUB_API}/repos/${source.owner}/${source.repo}/contents/${entry.path}?ref=${ref}`,
        { headers: { ...headers, Accept: 'application/vnd.github.raw' } },
      );
      const content = res.ok ? await res.text() : null;
      files.push({
        path: entry.path,
        role: classifyPath(entry.path),
        size: entry.size ?? 0,
        content,
      });
      done += 1;
      this.events.onProgress?.(done, entries.length, entry.path);
    }

    const manifests = files.filter((f) => f.role === 'dependency-manifest' && f.content);
    const deps = manifests.flatMap((m) => extractDependencies(m.content ?? '{}'));

    this.workspace = {
      id: `ws-${source.owner}-${source.repo}-${ref}`.replace(/[^a-zA-Z0-9-]/g, '_'),
      createdAt: Date.now(),
      files: new Map(files.map((f) => [f.path, f])),
    };
    this.manifest = { source: { ...source, ref }, resolvedRef: ref, files, dependencies: deps.dependencies, devDependencies: deps.devDependencies };
    this.setState('downloaded', `Downloaded ${files.length} files into temporary workspace "${this.workspace.id}".`);
    return this.manifest;
  }

  /** Step 2 — inspect the downloaded folder structure before importing. */
  inspect(): StructureReport {
    if (!this.workspace || !this.manifest) {
      throw new Error('Nothing downloaded yet. Call download() first.');
    }
    this.setState('inspecting', 'Inspecting downloaded structure…');
    this.report = inspectStructure(this.manifest.files);
    this.setState('inspected', `Inspected ${this.report.totalFiles} files. ${this.report.warnings.length} warning(s).`);
    return this.report;
  }

  /**
   * Step 3 — build an import plan for the selected files, detecting conflicts
   * against existing project files. Nothing is written yet.
   */
  planImport(
    selection: ImportSelection,
    existingFiles: Record<string, string>,
  ): ImportPlan {
    if (!this.workspace) throw new Error('Nothing downloaded yet. Call download() first.');

    const toCreate: string[] = [];
    const conflicts: FileConflict[] = [];

    for (const path of selection.paths) {
      const incoming = this.workspace.files.get(path);
      if (!incoming) continue;
      const existing = existingFiles[path];
      if (existing === undefined) {
        toCreate.push(path);
      } else {
        conflicts.push({ path, contentDiffers: existing !== incoming.content });
      }
    }

    this.setState('selecting', `Planned import: ${toCreate.length} new, ${conflicts.length} conflicting file(s).`);
    return { toCreate, conflicts, skipped: [] };
  }

  /**
   * Step 4 — execute the import. A conflict is only overwritten when the
   * caller passes an explicit 'overwrite' resolution for that exact path.
   */
  async import(
    plan: ImportPlan,
    resolutions: Record<string, 'skip' | 'overwrite' | 'rename'>,
    writeFile: (path: string, content: string) => Promise<void> | void,
  ): Promise<ImportResult> {
    if (!this.workspace) throw new Error('Nothing downloaded yet. Call download() first.');
    this.setState('importing', 'Importing selected files…');

    const imported: string[] = [];
    const skipped: string[] = [];
    const renamed: string[] = [];

    const writeOne = async (path: string) => {
      const file = this.workspace!.files.get(path);
      if (!file || file.content === null) {
        skipped.push(path);
        return;
      }
      await writeFile(path, file.content);
      imported.push(path);
    };

    for (const path of plan.toCreate) await writeOne(path);

    for (const conflict of plan.conflicts) {
      const resolution = resolutions[conflict.path] ?? 'skip';
      if (resolution === 'overwrite') {
        await writeOne(conflict.path);
      } else if (resolution === 'rename') {
        const rename = (p: string) => {
          const parts = p.split('.');
          const ext = parts.length > 1 ? `.${parts.pop()}` : '';
          const base = parts.join('.');
          return `${base}.imported${ext}`;
        };
        const target = rename(conflict.path);
        const file = this.workspace.files.get(conflict.path);
        if (file && file.content !== null) {
          await writeFile(target, file.content);
          renamed.push(target);
        }
      } else {
        skipped.push(conflict.path);
      }
    }

    this.setState('imported', `Imported ${imported.length} file(s), skipped ${skipped.length}, renamed ${renamed.length}.`);
    return { imported, skipped, renamed };
  }

  /** Step 5 — discard the temporary workspace. Never touches imported files. */
  cleanup(): void {
    if (this.workspace) {
      this.workspace.files.clear();
      this.workspace = null;
    }
    this.manifest = null;
    this.report = null;
    this.setState('idle', 'Temporary workspace cleaned up.');
  }
}
