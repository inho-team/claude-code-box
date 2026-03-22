import { useState } from 'react';
import { useTerminalStore } from '@entities/terminal/model/terminal-store';
import { useEditorStore } from '@entities/editor/model/editor-store';
import { usePanelStore } from '@entities/panel';
import { Menu, Columns2, Rows2, Minus, Square, X } from 'lucide-react';

const breadcrumbs = ['ROOT', 'SRC', 'CORE', 'v1.0.4'];

function BreadcrumbItem({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}): React.JSX.Element {
  return (
    <span
      style={{
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        fontSize: 13,
        fontWeight: isActive ? 700 : 400,
        textTransform: 'uppercase',
        letterSpacing: '-0.02em',
        color: isActive ? '#60a5fa' : '#71717a',
        borderBottom: isActive ? '2px solid #0099ff' : '2px solid transparent',
        paddingBottom: 4,
        cursor: 'pointer',
        transition: 'color 0.15s',
      }}
    >
      {label}
    </span>
  );
}

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={title}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 32,
        padding: 0,
        background: hovered ? '#18181b' : 'transparent',
        border: 'none',
        color: '#a1a1aa',
        fontSize: 14,
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function WindowButton({
  children,
  onClick,
  isClose,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  isClose?: boolean;
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 48,
        padding: 0,
        background: hovered ? (isClose ? '#c42b1c' : '#18181b') : 'transparent',
        border: 'none',
        color: hovered && isClose ? '#ffffff' : '#a1a1aa',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}

export function Toolbar(): React.JSX.Element {
  const activeTerminalId = useTerminalStore((s) => s.activeTerminalId);
  const splitTerminal = useTerminalStore((s) => s.splitTerminal);
  const addTerminal = useTerminalStore((s) => s.addTerminal);
  const openFile = useEditorStore((s) => s.openFile);
  const setLeftPanelType = usePanelStore((s) => s.setLeftPanelType);
  const [executeHovered, setExecuteHovered] = useState(false);

  const handleHorizontalSplit = () => {
    if (activeTerminalId) {
      splitTerminal(activeTerminalId, 'horizontal');
    }
  };

  const handleVerticalSplit = () => {
    if (activeTerminalId) {
      splitTerminal(activeTerminalId, 'vertical');
    }
  };

  const handleOpenFile = async () => {
    try {
      const result = await window.electronAPI?.fileSystem?.openFile();
      if (result) {
        const name = result.filePath.split(/[\\/]/).pop() ?? 'untitled';
        openFile({ path: result.filePath, name, content: result.content });
        setLeftPanelType('editor');
      }
    } catch (err) {
      console.error('Failed to open file:', err);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 48,
        flexShrink: 0,
        backgroundColor: '#131313',
        borderBottom: '1px solid #27272a',
        WebkitAppRegion: 'drag',
      }}
    >
      {/* Left: Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          flexShrink: 0,
          WebkitAppRegion: 'no-drag',
        }}
      >
        <span
          style={{
            color: '#0099ff',
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: '-0.05em',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          }}
        >
          Claude Code Box
        </span>
      </div>

      {/* Center: Breadcrumb Nav */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flex: 1,
          justifyContent: 'center',
          WebkitAppRegion: 'no-drag',
        }}
      >
        {breadcrumbs.map((item, i) => (
          <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {i > 0 && (
              <span
                style={{
                  color: '#3f3f46',
                  fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
                  fontSize: 13,
                }}
              >
                /
              </span>
            )}
            <BreadcrumbItem label={item} isActive={item === 'v1.0.4'} />
          </span>
        ))}
      </div>

      {/* Right: Icon buttons + EXECUTE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          paddingRight: 0,
          flexShrink: 0,
          WebkitAppRegion: 'no-drag',
        }}
      >
        <IconButton onClick={handleOpenFile} title="Open File">
          <Menu size={16} />
        </IconButton>
        <IconButton onClick={handleHorizontalSplit} title="Split Horizontal">
          <Columns2 size={16} />
        </IconButton>
        <IconButton onClick={handleVerticalSplit} title="Split Vertical">
          <Rows2 size={16} />
        </IconButton>

        <button
          onClick={() => addTerminal()}
          onMouseEnter={() => setExecuteHovered(true)}
          onMouseLeave={() => setExecuteHovered(false)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 28,
            padding: '0 12px',
            marginLeft: 4,
            background: executeHovered ? '#0088e6' : '#0099ff',
            border: 'none',
            color: '#002f54',
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            cursor: 'pointer',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
            transition: 'background 0.15s',
          }}
        >
          EXECUTE
        </button>

        {/* Separator */}
        <div
          style={{
            width: 1,
            height: 20,
            backgroundColor: '#27272a',
            margin: '0 4px',
          }}
        />

        {/* Window Controls */}
        <WindowButton>
          <Minus size={16} />
        </WindowButton>
        <WindowButton>
          <Square size={14} />
        </WindowButton>
        <WindowButton isClose>
          <X size={16} />
        </WindowButton>
      </div>
    </div>
  );
}
