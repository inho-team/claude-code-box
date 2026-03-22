import { useState } from 'react';
import { usePanelStore, type PanelType } from '@entities/panel';

const tabs: { key: PanelType; label: string }[] = [
  { key: 'editor', label: 'Editor' },
  { key: 'webview', label: 'Browser' },
];

function SwitchTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
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
        height: '100%',
        padding: '0 16px',
        background: 'none',
        border: 'none',
        borderBottom: isActive ? '2px solid #0099ff' : '2px solid transparent',
        backgroundColor: isActive ? '#0e0e0e' : hovered ? '#2a2a2a' : 'transparent',
        color: isActive ? '#60a5fa' : hovered ? '#d4d4d8' : '#71717a',
        fontSize: 11,
        fontWeight: isActive ? 700 : 400,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        cursor: 'pointer',
        transition: 'color 0.15s, background-color 0.15s',
        fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
      }}
    >
      {label}
    </button>
  );
}

export function EditorSwitchBar(): React.JSX.Element {
  const leftPanelType = usePanelStore((s) => s.leftPanelType);
  const setLeftPanelType = usePanelStore((s) => s.setLeftPanelType);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        height: 32,
        flexShrink: 0,
        backgroundColor: '#18181b',
        borderBottom: '1px solid #27272a',
      }}
    >
      {tabs.map((tab) => {
        const isActive = leftPanelType === tab.key;
        return (
          <SwitchTab
            key={tab.key}
            label={tab.label}
            isActive={isActive}
            onClick={() => setLeftPanelType(tab.key)}
          />
        );
      })}
    </div>
  );
}
