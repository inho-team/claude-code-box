import { useState, useCallback } from 'react';
import { usePanelStore } from '@entities/panel';
import { useEditorStore } from '@entities/editor/model/editor-store';
import { MonacoEditor } from '@entities/editor/ui/MonacoEditor';
import { WebViewPanel } from '@entities/editor/ui/WebViewPanel';
import { EditorSwitchBar } from '@features/editor-switch/ui/EditorSwitchBar';
import { WelcomeScreen } from './WelcomeScreen';

function FileTabs(): React.JSX.Element {
  const openFiles = useEditorStore((s) => s.openFiles);
  const activeFileId = useEditorStore((s) => s.activeFileId);
  const setActiveFile = useEditorStore((s) => s.setActiveFile);
  const closeFile = useEditorStore((s) => s.closeFile);

  if (openFiles.length === 0) return <></>;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 32,
        flexShrink: 0,
        backgroundColor: '#18181b',
        borderBottom: '1px solid #27272a',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        {openFiles.map((file) => {
          const isActive = file.id === activeFileId;
          return (
            <FileTab
              key={file.id}
              name={file.name}
              isActive={isActive}
              onClick={() => setActiveFile(file.id)}
              onClose={() => closeFile(file.id)}
            />
          );
        })}
      </div>
      {/* Right side: UTF-8 / Language */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          paddingRight: 12,
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            color: '#71717a',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          }}
        >
          UTF-8
        </span>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            color: '#71717a',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          }}
        >
          TypeScript
        </span>
      </div>
    </div>
  );
}

function FileTab({
  name,
  isActive,
  onClick,
  onClose,
}: {
  name: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        height: '100%',
        padding: '0 12px',
        backgroundColor: isActive ? '#0e0e0e' : hovered ? '#2a2a2a' : 'transparent',
        color: isActive ? '#60a5fa' : '#d4d4d8',
        fontSize: 11,
        fontWeight: isActive ? 700 : 400,
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        fontFamily: "'JetBrains Mono', monospace",
        transition: 'background 0.15s',
      }}
    >
      {/* File icon */}
      <span style={{ color: '#60a5fa', fontSize: 12 }}>{'\u25A0'}</span>
      <span>{name}</span>
      {/* Modified badge */}
      <span
        style={{
          color: '#52525b',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
        }}
      >
        {'\u25CF'}
      </span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        onMouseEnter={() => setCloseHovered(true)}
        onMouseLeave={() => setCloseHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          fontSize: 12,
          lineHeight: 1,
          color: isActive ? '#d4d4d8' : '#52525b',
          cursor: 'pointer',
          background: closeHovered ? '#2a2a2a' : 'transparent',
        }}
      >
        {'\u00D7'}
      </span>
    </div>
  );
}

function EditorPanel(): React.JSX.Element {
  const openFiles = useEditorStore((s) => s.openFiles);
  const activeFileId = useEditorStore((s) => s.activeFileId);
  const updateContent = useEditorStore((s) => s.updateContent);

  const activeFile = openFiles.find((f) => f.id === activeFileId) ?? null;

  const handleChange = useCallback(
    (value: string) => {
      if (activeFileId) {
        updateContent(activeFileId, value);
      }
    },
    [activeFileId, updateContent],
  );

  if (!activeFile) {
    return <WelcomeScreen />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <FileTabs />
      <div style={{ flex: 1, overflow: 'hidden', backgroundColor: '#0e0e0e' }}>
        <MonacoEditor
          content={activeFile.content}
          language={activeFile.language}
          filePath={activeFile.path}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export function LeftPanel(): React.JSX.Element {
  const leftPanelType = usePanelStore((s) => s.leftPanelType);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#0e0e0e',
      }}
    >
      <EditorSwitchBar />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {leftPanelType === 'editor' ? <EditorPanel /> : <WebViewPanel />}
      </div>
    </div>
  );
}
