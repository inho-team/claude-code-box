import { useState } from 'react';
import { useTerminalStore } from '@entities/terminal/model/terminal-store';
import { SplitContainer } from '@features/terminal-split/ui/SplitContainer';
import { Terminal, Plus, ChevronDown, X } from 'lucide-react';

function TerminalTab({
  id,
  isActive,
  onClick,
  onClose,
}: {
  id: string;
  isActive: boolean;
  onClick: () => void;
  onClose: () => void;
}): React.JSX.Element {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '0 12px',
        height: 32,
        fontSize: 11,
        fontWeight: isActive ? 700 : 400,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: 'pointer',
        color: isActive ? '#9fcaff' : '#71717a',
        opacity: isActive ? 1 : 0.4,
        whiteSpace: 'nowrap',
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        transition: 'color 0.15s, opacity 0.15s',
      }}
    >
      {/* Terminal icon */}
      {isActive && <Terminal size={12} style={{ color: '#9fcaff' }} />}
      <span>ZSH</span>
      {/* Status dot */}
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: isActive ? '#22c55e' : '#3f3f46',
          display: 'inline-block',
        }}
      />
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
          color: isActive ? '#9fcaff' : '#71717a',
          cursor: 'pointer',
          background: closeHovered ? '#2a2a2a' : 'transparent',
        }}
      >
        <X size={12} />
      </span>
    </div>
  );
}

function CommandBar(): React.JSX.Element {
  return (
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        padding: '0 12px',
        backgroundColor: '#131313',
        borderTop: '1px solid #18181b',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: '#52525b',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          }}
        >
          LN 1, COL 1
        </span>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            color: 'rgba(59, 130, 246, 0.6)',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
            fontWeight: 500,
          }}
        >
          Ready
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            color: '#52525b',
            fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
          }}
        >
          main
        </span>
      </div>
    </div>
  );
}

export function RightPanel(): React.JSX.Element {
  const terminalIds = useTerminalStore((s) => s.terminalIds);
  const activeTerminalId = useTerminalStore((s) => s.activeTerminalId);
  const setActiveTerminal = useTerminalStore((s) => s.setActiveTerminal);
  const addTerminal = useTerminalStore((s) => s.addTerminal);
  const removeTerminal = useTerminalStore((s) => s.removeTerminal);
  const splitRoot = useTerminalStore((s) => s.splitRoot);

  const [addHovered, setAddHovered] = useState(false);
  const [collapseHovered, setCollapseHovered] = useState(false);
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#131313',
      }}
    >
      {/* Terminal Tab Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 32,
          flexShrink: 0,
          backgroundColor: 'rgba(24, 24, 27, 0.5)',
          borderBottom: '1px solid #27272a',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flex: 1, overflow: 'auto' }}>
          {terminalIds.map((id) => (
            <TerminalTab
              key={id}
              id={id}
              isActive={id === activeTerminalId}
              onClick={() => setActiveTerminal(id)}
              onClose={() => removeTerminal(id)}
            />
          ))}
        </div>

        {/* Tab bar actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px', flexShrink: 0 }}>
          <button
            onClick={() => addTerminal()}
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              background: addHovered ? '#18181b' : 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: 16,
              cursor: 'pointer',
            }}
            title="New Terminal"
          >
            <Plus size={16} />
          </button>
          <button
            onMouseEnter={() => setCollapseHovered(true)}
            onMouseLeave={() => setCollapseHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              background: collapseHovered ? '#18181b' : 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: 12,
              cursor: 'pointer',
            }}
            title="Collapse"
          >
            <ChevronDown size={16} />
          </button>
          <button
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              background: closeHovered ? '#18181b' : 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: 14,
              cursor: 'pointer',
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Terminal Split Area */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <SplitContainer node={splitRoot} />
      </div>

      {/* Command Bar */}
      <CommandBar />
    </div>
  );
}
