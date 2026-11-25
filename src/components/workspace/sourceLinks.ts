/** These ids serve both the real panels and the sidebar's bookmarkable shortcuts. */
export const sourcePanels = {
  file: { id: 'source-file', label: 'Source file', color: 'violet' },
  settings: { id: 'build-settings', label: 'Build settings', color: 'pink' },
  output: { id: 'build-output', label: 'Build output', color: 'red' },
} as const;
export const sourceLinks = Object.values(sourcePanels);
export const sourceLinkFor = (hash: string) => sourceLinks.find(link => `#${link.id}` === hash);
