import { GitBranch, XCircle, AlertTriangle, Wifi } from 'lucide-react';

function StatusItem({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '0 8px',
        height: '100%',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function StatusBar(): React.JSX.Element {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 24,
        flexShrink: 0,
        backgroundColor: 'transparent',
        borderTop: '1px solid #27272a',
        color: '#71717a',
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        fontSize: 10,
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        padding: '0 4px',
      }}
    >
      {/* Left Section */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <StatusItem>
          <Wifi size={10} style={{ color: '#22c55e' }} />
          <span style={{ color: '#71717a' }}>Connected</span>
        </StatusItem>
        <StatusItem>
          <span style={{ color: '#71717a' }}>Uptime: 2h 14m</span>
        </StatusItem>
        <StatusItem>
          <XCircle size={10} style={{ color: '#a1a1aa' }} />
          <span style={{ color: '#a1a1aa' }}>0</span>
        </StatusItem>
        <StatusItem>
          <AlertTriangle size={10} style={{ color: '#a1a1aa' }} />
          <span style={{ color: '#a1a1aa' }}>0</span>
        </StatusItem>
      </div>

      {/* Right Section */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <StatusItem>
          <span style={{ color: '#a1a1aa' }}>Ln 1, Col 1</span>
        </StatusItem>
        <StatusItem>
          <span style={{ color: '#a1a1aa' }}>Spaces: 2</span>
        </StatusItem>
        <StatusItem>
          <span style={{ color: '#a1a1aa' }}>UTF-8</span>
        </StatusItem>
        <StatusItem>
          <span style={{ color: '#a1a1aa' }}>TypeScript JSX</span>
        </StatusItem>
        <StatusItem>
          <span style={{ color: 'rgba(59, 130, 246, 0.6)' }}>Ready</span>
        </StatusItem>
        <StatusItem>
          <GitBranch size={12} style={{ color: '#71717a' }} />
          <span style={{ color: '#a1a1aa' }}>main</span>
        </StatusItem>
      </div>
    </div>
  );
}
