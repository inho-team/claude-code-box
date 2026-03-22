import { FileCode, Terminal, Keyboard } from 'lucide-react';

const shortcuts = [
  { keys: 'Ctrl+O', description: 'Open File' },
  { keys: 'Ctrl+`', description: 'Quake Toggle' },
  { keys: 'Ctrl+Shift+T', description: 'New Terminal' },
  { keys: 'Ctrl+S', description: 'Save File' },
  { keys: 'Alt+1-5', description: 'Panel Switch' },
];

export function WelcomeScreen(): React.JSX.Element {
  const handleOpenFile = (): void => {
    const api = window.electronAPI?.fileSystem;
    if (api) {
      api.openFile();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#0e0e0e',
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        gap: 32,
      }}
    >
      {/* App Title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <Terminal size={32} color="#0099ff" strokeWidth={1.5} />
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: '#0099ff',
              margin: 0,
              letterSpacing: '-0.02em',
            }}
          >
            Claude Code Box
          </h1>
        </div>
        <span style={{ fontSize: 12, color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          v0.1.0
        </span>
      </div>

      {/* Keyboard Shortcuts */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          padding: '20px 24px',
          backgroundColor: '#131313',
          border: '1px solid #1e1e1e',
          minWidth: 280,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            color: '#71717a',
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          <Keyboard size={14} />
          <span>Keyboard Shortcuts</span>
        </div>
        {shortcuts.map((shortcut) => (
          <div
            key={shortcut.keys}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 0',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: '#a1a1aa',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {shortcut.keys}
            </span>
            <span style={{ fontSize: 12, color: '#52525b' }}>{shortcut.description}</span>
          </div>
        ))}
      </div>

      {/* Open File Button */}
      <button
        onClick={handleOpenFile}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 32px',
          background: '#0099ff',
          color: '#002f54',
          border: 'none',
          fontWeight: 700,
          cursor: 'pointer',
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          transition: 'opacity 0.15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '0.85';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.opacity = '1';
        }}
      >
        <FileCode size={14} />
        Open File
      </button>
    </div>
  );
}
