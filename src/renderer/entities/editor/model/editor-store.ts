import { create } from 'zustand';

export interface OpenFile {
  id: string;
  path: string;
  name: string;
  content: string;
  language: string;
}

interface EditorState {
  openFiles: OpenFile[];
  activeFileId: string | null;
  workspacePath: string | null;
  openFile: (file: Omit<OpenFile, 'id' | 'language'>) => void;
  closeFile: (id: string) => void;
  setActiveFile: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  setWorkspacePath: (path: string) => void;
}

function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    md: 'markdown',
    html: 'html',
    htm: 'html',
    css: 'css',
    scss: 'scss',
    less: 'less',
    py: 'python',
    java: 'java',
    kt: 'kotlin',
    go: 'go',
    rs: 'rust',
    c: 'c',
    cpp: 'cpp',
    h: 'c',
    hpp: 'cpp',
    sh: 'shell',
    bash: 'shell',
    yml: 'yaml',
    yaml: 'yaml',
    xml: 'xml',
    sql: 'sql',
    graphql: 'graphql',
    toml: 'toml',
    ini: 'ini',
    dockerfile: 'dockerfile',
    txt: 'plaintext',
  };
  return languageMap[ext] ?? 'plaintext';
}

function generateFileId(filePath: string): string {
  return filePath.replace(/[^a-zA-Z0-9]/g, '_');
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: [],
  activeFileId: null,
  workspacePath: null,

  openFile: (file) => {
    const { openFiles } = get();
    const id = generateFileId(file.path);
    const existing = openFiles.find((f) => f.id === id);

    if (existing) {
      set({ activeFileId: id });
      return;
    }

    const language = detectLanguage(file.name);
    const newFile: OpenFile = { id, path: file.path, name: file.name, content: file.content, language };
    set({ openFiles: [...openFiles, newFile], activeFileId: id });
  },

  closeFile: (id) => {
    const { openFiles, activeFileId } = get();
    const filtered = openFiles.filter((f) => f.id !== id);
    let newActiveId = activeFileId;

    if (activeFileId === id) {
      const index = openFiles.findIndex((f) => f.id === id);
      newActiveId = filtered.length > 0 ? filtered[Math.min(index, filtered.length - 1)].id : null;
    }

    set({ openFiles: filtered, activeFileId: newActiveId });
  },

  setActiveFile: (id) => set({ activeFileId: id }),

  updateContent: (id, content) => {
    set((state) => ({
      openFiles: state.openFiles.map((f) => (f.id === id ? { ...f, content } : f)),
    }));
  },

  setWorkspacePath: (path) => set({ workspacePath: path }),
}));
