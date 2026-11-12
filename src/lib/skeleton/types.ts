/**
 * Skeleton Download System — shared types.
 *
 * A "skeleton" is an approved UI skeleton or project template stored in a
 * GitHub repository. Skeletons are always downloaded into an isolated,
 * temporary workspace first, inspected, and only then imported into the
 * project — file by file, with explicit conflict confirmation.
 */

export type SkeletonState =
  | 'idle'
  | 'downloading'
  | 'downloaded'
  | 'inspecting'
  | 'inspected'
  | 'selecting'
  | 'importing'
  | 'imported'
  | 'error';

export type FileRole =
  | 'layout'
  | 'component'
  | 'style'
  | 'config'
  | 'dependency-manifest'
  | 'asset'
  | 'document'
  | 'script'
  | 'other';

/** Source of a skeleton. Currently GitHub repositories are supported. */
export interface SkeletonSource {
  kind: 'github';
  owner: string;
  repo: string;
  /** Branch or tag. Defaults to the repo's default branch. */
  ref?: string;
  /** Optional subdirectory inside the repo that holds the skeleton. */
  subdirectory?: string;
}

export interface SkeletonFile {
  path: string;
  role: FileRole;
  size: number;
  content: string | null;
}

export interface SkeletonManifest {
  source: SkeletonSource;
  resolvedRef: string;
  files: SkeletonFile[];
  dependencies: string[];
  devDependencies: string[];
}

/** Classification of an inspected skeleton folder structure. */
export interface StructureReport {
  totalFiles: number;
  byRole: Record<FileRole, string[]>;
  layouts: string[];
  components: string[];
  styles: string[];
  configs: string[];
  dependencyManifests: string[];
  /** Files that would execute code if run. Never auto-executed. */
  executableFiles: string[];
  warnings: string[];
}

export interface ImportSelection {
  paths: string[];
}

export type ConflictResolution = 'skip' | 'overwrite' | 'rename';

export interface FileConflict {
  path: string;
  /** True when the existing file content differs from the incoming one. */
  contentDiffers: boolean;
  resolution?: ConflictResolution;
}

export interface ImportPlan {
  toCreate: string[];
  conflicts: FileConflict[];
  skipped: string[];
}

export interface ImportResult {
  imported: string[];
  skipped: string[];
  renamed: string[];
}

/** An isolated, temporary holding area for downloaded skeletons. */
export interface TempWorkspace {
  id: string;
  createdAt: number;
  files: Map<string, SkeletonFile>;
}

export interface SkeletonEvents {
  onStateChange?: (state: SkeletonState, message: string) => void;
  onProgress?: (done: number, total: number, path: string) => void;
}
