import { contextBridge, ipcRenderer } from 'electron';

const terminalApi = {
  create: (id: string, options?: { cols?: number; rows?: number; shellPath?: string }) =>
    ipcRenderer.invoke('terminal:create', id, options),
  write: (id: string, data: string) =>
    ipcRenderer.invoke('terminal:write', id, data),
  resize: (id: string, cols: number, rows: number) =>
    ipcRenderer.invoke('terminal:resize', id, cols, rows),
  kill: (id: string) =>
    ipcRenderer.invoke('terminal:kill', id),
  onData: (id: string, callback: (data: string) => void) => {
    const channel = `terminal:data:${id}`;
    const listener = (_event: Electron.IpcRendererEvent, data: string) => callback(data);
    ipcRenderer.on(channel, listener);
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },
};

const fileSystemApi = {
  openFile: (options?: { filters?: Array<{ name: string; extensions: string[] }> }) =>
    ipcRenderer.invoke('fs:openFile', options),
  readFile: (filePath: string) =>
    ipcRenderer.invoke('fs:readFile', filePath),
  saveFile: (filePath: string, content: string) =>
    ipcRenderer.invoke('fs:saveFile', filePath, content),
  readDir: (dirPath: string) =>
    ipcRenderer.invoke('fs:readDir', dirPath),
  getHomePath: () =>
    ipcRenderer.invoke('fs:getHomePath'),
};

contextBridge.exposeInMainWorld('electronAPI', {
  terminal: terminalApi,
  fileSystem: fileSystemApi,
});
