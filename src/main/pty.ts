import { ipcMain, BrowserWindow } from 'electron';
import * as os from 'os';

// Lazy-load node-pty to prevent crash if not available
let pty: typeof import('node-pty') | null = null;
try {
  pty = require('node-pty');
} catch {
  console.warn('node-pty not available — terminal will not work');
}

type IPty = any;

const terminals: Map<string, IPty> = new Map();

function getDefaultShell(): string {
  if (os.platform() === 'win32') {
    return 'powershell.exe';
  }
  return process.env.SHELL || '/bin/bash';
}

export function registerPtyHandlers(): void {
  ipcMain.handle(
    'terminal:create',
    (event, id: string, options?: { cols?: number; rows?: number; shellPath?: string }) => {
      if (terminals.has(id)) {
        return;
      }

      if (!pty) {
        console.error('node-pty not available');
        return;
      }

      const shell = options?.shellPath || getDefaultShell();
      const cols = options?.cols ?? 80;
      const rows = options?.rows ?? 24;

      const ptyProcess: IPty = pty.spawn(shell, [], {
        name: 'xterm-256color',
        cols,
        rows,
        cwd: os.homedir(),
        env: process.env as Record<string, string>,
      });

      ptyProcess.onData((data: string) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        if (win && !win.isDestroyed()) {
          event.sender.send(`terminal:data:${id}`, data);
        }
      });

      ptyProcess.onExit(() => {
        terminals.delete(id);
      });

      terminals.set(id, ptyProcess);
    },
  );

  ipcMain.handle('terminal:write', (_event, id: string, data: string) => {
    const term = terminals.get(id);
    if (term) {
      term.write(data);
    }
  });

  ipcMain.handle('terminal:resize', (_event, id: string, cols: number, rows: number) => {
    const term = terminals.get(id);
    if (term) {
      term.resize(cols, rows);
    }
  });

  ipcMain.handle('terminal:kill', (_event, id: string) => {
    const term = terminals.get(id);
    if (term) {
      term.kill();
      terminals.delete(id);
    }
  });
}

export function killAllTerminals(): void {
  for (const [id, term] of terminals) {
    term.kill();
    terminals.delete(id);
  }
}
