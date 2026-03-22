import { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useTerminalStore } from '../model/terminal-store';

interface TerminalViewProps {
  terminalId: string;
}

export function TerminalView({ terminalId }: TerminalViewProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const initializedRef = useRef(false);
  const setActiveTerminal = useTerminalStore((s) => s.setActiveTerminal);

  const handleFocus = useCallback(() => {
    setActiveTerminal(terminalId);
  }, [terminalId, setActiveTerminal]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || initializedRef.current) return;
    initializedRef.current = true;

    const term = new Terminal({
      cursorBlink: true,
      fontSize: 13,
      fontFamily: "'JetBrains Mono', monospace",
      theme: {
        background: '#131313',
        foreground: '#e5e2e1',
        cursor: '#0099ff',
        selectionBackground: 'rgba(0, 153, 255, 0.2)',
        black: '#131313',
        red: '#ffb4ab',
        green: '#22c55e',
        yellow: '#d3c878',
        blue: '#0099ff',
        magenta: '#b3c8e7',
        cyan: '#9fcaff',
        white: '#e5e2e1',
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);

    // Small delay to ensure DOM is ready for fit
    requestAnimationFrame(() => {
      try {
        fitAddon.fit();
      } catch {
        // ignore fit errors during initialization
      }
    });

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    // ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        try {
          fitAddon.fit();
        } catch {
          // ignore
        }
      });
    });
    resizeObserver.observe(container);

    // Connect to node-pty backend (only available in Electron)
    const api = window.electronAPI?.terminal;
    let onDataDisposable: { dispose: () => void } | null = null;
    let onResizeDisposable: { dispose: () => void } | null = null;
    let removeOnData: (() => void) | null = null;

    if (api) {
      const cols = term.cols;
      const rows = term.rows;
      api.create(terminalId, { cols, rows });

      onDataDisposable = term.onData((data) => {
        api.write(terminalId, data);
      });

      removeOnData = api.onData(terminalId, (data) => {
        term.write(data);
      });

      onResizeDisposable = term.onResize(({ cols, rows }) => {
        api.resize(terminalId, cols, rows);
      });
    } else {
      // Browser preview mode — v2 Hyper-Terminal style
      term.write('\x1b[1;34mClaude Code Box\x1b[0m - Terminal Preview\r\n\r\n');
      term.write('\x1b[33m\u26A0 Running in browser preview mode.\x1b[0m\r\n');
      term.write('\x1b[90mTerminal requires Electron runtime.\x1b[0m\r\n\r\n');
      term.write('\x1b[1;34m\u27A4\x1b[0m \x1b[90m~/workspace/claude-code-box\x1b[0m $ ');
    }

    cleanupRef.current = () => {
      onDataDisposable?.dispose();
      onResizeDisposable?.dispose();
      removeOnData?.();
      resizeObserver.disconnect();
      api?.kill(terminalId);
      term.dispose();
    };

    return () => {
      cleanupRef.current?.();
      initializedRef.current = false;
    };
  }, [terminalId]);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      const text = e.clipboardData.getData('text');
      if (text && text.includes('\n')) {
        const lineCount = text.split('\n').length;
        const confirmed = window.confirm(
          `You are about to paste ${lineCount} lines into the terminal.\nDo you want to continue?`,
        );
        if (!confirmed) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      onFocus={handleFocus}
      onPaste={handlePaste}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    />
  );
}
