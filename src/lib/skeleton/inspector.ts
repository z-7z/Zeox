import type { FileRole, SkeletonFile, StructureReport } from './types';

/**
 * Classifies a file path into its role in a project skeleton.
 * Pure heuristics, no execution, no side effects.
 */
export function classifyPath(path: string): FileRole {
  const p = path.toLowerCase();
  const base = p.split('/').pop() ?? p;

  if (/(^|\/)(package\.json|pnpm-lock\.yaml|yarn\.lock|package-lock\.json|requirements\.txt|poetry\.lock)$/.test(base)) {
    return 'dependency-manifest';
  }
  if (/\.(tsx|jsx)$/.test(p)) {
    if (/(^|\/)(layout|layouts)\//.test(p) || /layout/i.test(base)) return 'layout';
    return 'component';
  }
  if (/\.(css|scss|sass|less|styl)$/.test(p) || /tailwind\.config\.(js|ts|cjs)$/.test(p)) {
    return 'style';
  }
  if (
    /(^|\/)(tsconfig|jsconfig|vite\.config|webpack\.config|next\.config|postcss\.config|\.eslintrc|\.editorconfig|\.gitignore|\.env\.example|tsconfig\..+\.json)$/.test(base) ||
    /\.(json|toml|ya?ml)$/.test(base)
  ) {
    return 'config';
  }
  if (/\.(png|jpe?g|gif|svg|webp|ico|woff2?|ttf|eot|mp4|webm)$/.test(p)) {
    return 'asset';
  }
  if (/\.md$/.test(p)) {
    return 'document';
  }
  if (/\.(sh|bash|zsh|ps1|py|pl|rb)$/.test(p) || /(^|\/)(Makefile|Dockerfile)$/.test(base)) {
    return 'script';
  }
  if (/\.(ts|js|mjs|cjs|lua|json)$/.test(p)) {
    return 'component';
  }
  return 'document';
}

/** Files that must never be executed automatically after download. */
export function isExecutable(file: SkeletonFile): boolean {
  return file.role === 'script' || /\.(sh|bash|ps1|py|pl|rb)$/.test(file.path.toLowerCase());
}

export function inspectStructure(files: SkeletonFile[]): StructureReport {
  const byRole = {} as Record<FileRole, string[]>;
  for (const f of files) {
    (byRole[f.role] ??= []).push(f.path);
  }

  const warnings: string[] = [];

  const hasDependencyManifest = (byRole['dependency-manifest'] ?? []).length > 0;
  if (!hasDependencyManifest) {
    warnings.push('No dependency manifest found. Dependencies must be reviewed manually before importing.');
  }

  for (const f of files) {
    if (isExecutable(f)) {
      warnings.push(`Executable file "${f.path}" will never be run automatically. Review before use.`);
    }
    if (/(^|\/)\.env($|\.)/.test(f.path) && !/\.env\.example$/.test(f.path)) {
      warnings.push(`Secret-like file "${f.path}" detected. Do not commit real secrets.`);
    }
  }

  const scripts = (byRole['script'] ?? []).length;
  if (scripts > 0) {
    warnings.push(`${scripts} script file(s) present. They are quarantined until reviewed.`);
  }

  return {
    totalFiles: files.length,
    byRole,
    layouts: byRole['layout'] ?? [],
    components: byRole['component'] ?? [],
    styles: byRole['style'] ?? [],
    configs: byRole['config'] ?? [],
    dependencyManifests: byRole['dependency-manifest'] ?? [],
    executableFiles: files.filter(isExecutable).map((f) => f.path),
    warnings,
  };
}

/** Extract dependency names from a package.json content string. */
export function extractDependencies(packageJsonContent: string): {
  dependencies: string[];
  devDependencies: string[];
} {
  try {
    const parsed = JSON.parse(packageJsonContent);
    return {
      dependencies: Object.keys(parsed.dependencies ?? {}),
      devDependencies: Object.keys(parsed.devDependencies ?? {}),
    };
  } catch {
    return { dependencies: [], devDependencies: [] };
  }
}
