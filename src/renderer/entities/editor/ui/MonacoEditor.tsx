import { useCallback, useRef } from 'react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type * as monacoEditor from 'monaco-editor';

interface MonacoEditorProps {
  content: string;
  language: string;
  filePath: string;
  onChange: (value: string) => void;
}

export function MonacoEditor({ content, language, filePath, onChange }: MonacoEditorProps): React.JSX.Element {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(null);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      editor.addAction({
        id: 'save-file',
        label: 'Save File',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
        run: async () => {
          const value = editor.getValue();
          try {
            await window.electronAPI?.fileSystem?.saveFile(filePath, value);
          } catch (err) {
            console.error('Failed to save file:', err);
          }
        },
      });
    },
    [filePath],
  );

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <Editor
      height="100%"
      language={language}
      value={content}
      theme="vs-dark"
      onChange={handleChange}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
      }}
    />
  );
}
