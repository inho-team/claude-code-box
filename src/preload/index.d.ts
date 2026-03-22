interface TerminalApi {
  create: (id: string, options?: { cols?: number; rows?: number }) => Promise<void>;
  write: (id: string, data: string) => Promise<void>;
  resize: (id: string, cols: number, rows: number) => Promise<void>;
  kill: (id: string) => Promise<void>;
  onData: (id: string, callback: (data: string) => void) => () => void;
}

interface FileSystemApi {
  openFile: (options?: {
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => Promise<{ filePath: string; content: string } | null>;
  readFile: (filePath: string) => Promise<string>;
  saveFile: (filePath: string, content: string) => Promise<boolean>;
  readDir: (dirPath: string) => Promise<Array<{ name: string; path: string; isDirectory: boolean }>>;
  getHomePath: () => Promise<string>;
}

interface ElectronAPI {
  terminal: TerminalApi;
  fileSystem: FileSystemApi;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
