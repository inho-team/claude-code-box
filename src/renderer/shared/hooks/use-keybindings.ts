import { useEffect } from 'react';
import { matchKeybinding } from '@shared/lib/keybindings';
import { useTerminalStore } from '@entities/terminal/model/terminal-store';
import { useEditorStore } from '@entities/editor/model/editor-store';
import { usePanelStore } from '@entities/panel/model/panel-store';

export function useKeybindings(): void {
  const addTerminal = useTerminalStore((s) => s.addTerminal);
  const removeTerminal = useTerminalStore((s) => s.removeTerminal);
  const splitTerminal = useTerminalStore((s) => s.splitTerminal);
  const activeTerminalId = useTerminalStore((s) => s.activeTerminalId);

  const openFiles = useEditorStore((s) => s.openFiles);
  const activeFileId = useEditorStore((s) => s.activeFileId);
  const closeFile = useEditorStore((s) => s.closeFile);
  const setActiveFile = useEditorStore((s) => s.setActiveFile);

  const setLeftPanelType = usePanelStore((s) => s.setLeftPanelType);
  const leftPanelType = usePanelStore((s) => s.leftPanelType);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      const binding = matchKeybinding(e);
      if (!binding) return;

      // Monaco 에디터 내부 단축키와 충돌 방지
      const target = e.target as HTMLElement;
      const isInMonaco = target.closest('.monaco-editor') !== null;
      if (isInMonaco && ['file.save'].includes(binding.action)) return; // Monaco handles Ctrl+S

      e.preventDefault();
      e.stopPropagation();

      switch (binding.action) {
        case 'file.open':
          window.electronAPI?.fileSystem?.openFile()?.then((result: { filePath: string; content: string } | null) => {
            if (result) {
              const name = result.filePath.split(/[\\/]/).pop() ?? 'untitled';
              useEditorStore.getState().openFile({ path: result.filePath, name, content: result.content });
              setLeftPanelType('editor');
            }
          });
          break;

        case 'file.save': {
          const activeFile = openFiles.find((f) => f.id === activeFileId);
          if (activeFile) {
            window.electronAPI?.fileSystem?.saveFile(activeFile.path, activeFile.content);
          }
          break;
        }

        case 'tab.close':
          if (leftPanelType === 'editor' && activeFileId) {
            closeFile(activeFileId);
          }
          break;

        case 'tab.prev': {
          if (openFiles.length < 2 || !activeFileId) break;
          const idx = openFiles.findIndex((f) => f.id === activeFileId);
          const prevIdx = idx <= 0 ? openFiles.length - 1 : idx - 1;
          setActiveFile(openFiles[prevIdx].id);
          break;
        }

        case 'tab.next': {
          if (openFiles.length < 2 || !activeFileId) break;
          const idx = openFiles.findIndex((f) => f.id === activeFileId);
          const nextIdx = idx >= openFiles.length - 1 ? 0 : idx + 1;
          setActiveFile(openFiles[nextIdx].id);
          break;
        }

        case 'tab.switcher': {
          // Ctrl+Tab: 다음 탭으로 (IntelliJ 스타일)
          if (openFiles.length < 2 || !activeFileId) break;
          const idx = openFiles.findIndex((f) => f.id === activeFileId);
          const nextIdx = idx >= openFiles.length - 1 ? 0 : idx + 1;
          setActiveFile(openFiles[nextIdx].id);
          break;
        }

        case 'terminal.toggle':
          // Alt+F12: 터미널 패널 포커스 전환
          break;

        case 'terminal.new':
          addTerminal();
          break;

        case 'terminal.close':
          if (activeTerminalId) {
            removeTerminal(activeTerminalId);
          }
          break;

        case 'terminal.splitHorizontal':
          if (activeTerminalId) {
            splitTerminal(activeTerminalId, 'horizontal');
          }
          break;

        case 'terminal.splitVertical':
          if (activeTerminalId) {
            splitTerminal(activeTerminalId, 'vertical');
          }
          break;

        case 'panel.editor':
          setLeftPanelType('editor');
          break;

        case 'panel.browser':
          setLeftPanelType('webview');
          break;

        case 'focus.editor':
          // Escape: 에디터로 포커스 이동
          (document.querySelector('.monaco-editor textarea') as HTMLElement)?.focus();
          break;

        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [
    addTerminal, removeTerminal, splitTerminal, activeTerminalId,
    openFiles, activeFileId, closeFile, setActiveFile,
    setLeftPanelType, leftPanelType,
  ]);
}
