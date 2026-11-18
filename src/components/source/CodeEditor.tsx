import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { Compartment, EditorState, type Text } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { byteLength, SOURCE_LIMIT } from '../../lib/source/compact';
import { codeColors, luaSyntax } from './luaSyntax';

export interface EditorHandle { selectAll: () => void }
interface Props {
  value: string; label: string; filename: string; readOnly?: boolean; disabled?: boolean;
  onEdit?: (value: string) => void; onBuild?: () => void; onLimit?: () => void;
}
const access = new Compartment();
function accessMode({ label, readOnly, disabled }: Props) {
  return [EditorView.editable.of(!readOnly && !disabled), EditorState.readOnly.of(!!readOnly || !!disabled),
    EditorView.contentAttributes.of({ 'aria-label': label, 'aria-multiline': 'true', 'aria-readonly': String(!!readOnly || !!disabled),
      'aria-disabled': String(!!disabled), tabindex: disabled ? '-1' : '0', spellcheck: 'false', autocapitalize: 'off', autocorrect: 'off' })];
}

/** Viewport-rendered text, not a transparent textarea over a second copy of the
 * file. React owns the raw source/result; the editor owns selection and undo. */
export const CodeEditor = forwardRef<EditorHandle, Props>(function CodeEditor(props, ref) {
  const host = useRef<HTMLDivElement>(null), editor = useRef<EditorView | null>(null);
  const latest = useRef(props), synced = useRef<{ value: string; filename: string; readOnly?: boolean }>();
  const { value, filename, label, readOnly, disabled } = props;
  useLayoutEffect(() => { latest.current = props; });
  useImperativeHandle(ref, () => ({ selectAll() {
    const view = editor.current;
    if (view) { view.focus(); view.dispatch({ selection: { anchor: 0, head: view.state.doc.length } }); }
  } }), []);

  useLayoutEffect(() => {
    // Don't rebuild the view on keystrokes. A replaced document gets fresh
    // history so Undo won't bring back a previously cleared/imported file.
    if (editor.current && synced.current?.value === value && synced.current.filename === filename && synced.current.readOnly === readOnly) return;
    const config = latest.current;
    // CodeMirror models lines independently of their separators. Keep a
    // file's newline convention when serializing edits (including CRLF).
    const eol = value.match(/\r\n|\r|\n/)?.[0] ?? '\n';
    const serialize = (doc: Text) => doc.sliceString(0, undefined, eol);
    const state = EditorState.create({ doc: value, extensions: [
      /\.luau$/i.test(filename) ? luaSyntax.luau : luaSyntax.lua, codeColors, lineNumbers(),
      EditorView.theme({}, { dark: true }), EditorState.tabSize.of(4), access.of(accessMode(config)),
      ...(readOnly ? [] : [history(), placeholder('-- Paste your source here'),
        keymap.of([{ key: 'Mod-Enter', run() { if (!latest.current.disabled) latest.current.onBuild?.(); return true; } }, ...defaultKeymap, ...historyKeymap]),
        EditorState.changeFilter.of(tr => {
          if (!tr.docChanged || (tr.newDoc.length <= SOURCE_LIMIT && byteLength(serialize(tr.newDoc)) <= SOURCE_LIMIT)) return true;
          queueMicrotask(() => { if (editor.current) latest.current.onLimit?.(); }); return false;
        }),
        EditorView.updateListener.of(update => {
          if (!update.docChanged) return;
          const next = serialize(update.state.doc);
          synced.current = { value: next, filename, readOnly }; latest.current.onEdit?.(next);
        }),
      ]),
    ] });
    synced.current = { value, filename, readOnly };
    if (editor.current) { editor.current.setState(state); editor.current.scrollDOM.scrollTo(0, 0); }
    else editor.current = new EditorView({ state, parent: host.current! });
  }, [value, filename, readOnly]);
  useLayoutEffect(() => { editor.current?.dispatch({ effects: access.reconfigure(accessMode(latest.current)) }); }, [label, disabled, readOnly]);
  useLayoutEffect(() => () => { editor.current?.destroy(); editor.current = null; }, []);
  return <div ref={host} className={`src-editor${readOnly ? ' src-readonly' : ''}`} />;
});
