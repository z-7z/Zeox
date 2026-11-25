export const transforms = [
  ['encodeText', 'Encode text literals', 'Write plain quoted strings as decimal byte escapes.', 'Aa'],
  ['removeComments', 'Remove comments', 'Keep directives and license notices.', '//'],
  ['compactSpacing', 'Compact spacing', 'Remove extra whitespace without merging tokens.', '␣'],
] as const;
