import { ipcMain, dialog, BrowserWindow, app } from 'electron';
import * as fs from 'fs';
import * as path from 'path';

export function registerFileSystemHandlers(): void {
  ipcMain.handle(
    'fs:openFile',
    async (event, options?: { filters?: Array<{ name: string; extensions: string[] }> }) => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) return null;

      const result = await dialog.showOpenDialog(win, {
        properties: ['openFile'],
        filters: options?.filters ?? [
          { name: 'All Files', extensions: ['*'] },
          { name: 'Text Files', extensions: ['txt', 'md', 'json', 'ts', 'tsx', 'js', 'jsx', 'py', 'java', 'html', 'css'] },
        ],
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      const filePath = result.filePaths[0];
      const content = await fs.promises.readFile(filePath, 'utf-8');

      return { filePath, content };
    },
  );

  ipcMain.handle('fs:readFile', async (_event, filePath: string) => {
    const resolvedPath = path.resolve(filePath);
    const content = await fs.promises.readFile(resolvedPath, 'utf-8');
    return content;
  });

  ipcMain.handle('fs:saveFile', async (_event, filePath: string, content: string) => {
    const resolvedPath = path.resolve(filePath);
    await fs.promises.writeFile(resolvedPath, content, 'utf-8');
    return true;
  });

  ipcMain.handle('fs:readDir', async (_event, dirPath: string) => {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
    return entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory(),
    }));
  });

  ipcMain.handle('fs:getHomePath', async () => {
    return app.getPath('home') || process.cwd();
  });
}
