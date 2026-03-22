import { useState } from 'react';
import { FolderOpen, Search, GitBranch, Bug, Package, Plus, User } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FileExplorer } from './FileExplorer';

interface NavItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

const topItems: NavItem[] = [
  { id: 'explorer', label: 'EXPLORER', Icon: FolderOpen },
  { id: 'search', label: 'SEARCH', Icon: Search },
  { id: 'git', label: 'GIT', Icon: GitBranch },
  { id: 'debug', label: 'DEBUG', Icon: Bug },
  { id: 'market', label: 'MARKET', Icon: Package },
];

function NavButton({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false);
  const IconComponent = item.Icon;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 64,
        height: 56,
        padding: 0,
        border: 'none',
        borderLeft: isActive ? '2px solid #0099ff' : '2px solid transparent',
        background: isActive ? '#18181b' : hovered ? '#18181b' : 'transparent',
        color: isActive ? '#60a5fa' : hovered ? '#93c5fd' : '#52525b',
        cursor: 'pointer',
        gap: 3,
        transition: 'color 0.15s, background 0.15s',
      }}
    >
      <IconComponent size={18} />
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 1,
          fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
        }}
      >
        {item.label}
      </span>
    </button>
  );
}

export function SideNavBar(): React.JSX.Element {
  const [activeId, setActiveId] = useState<string | null>('explorer');
  const [addHovered, setAddHovered] = useState(false);

  const handleNavClick = (id: string) => {
    // Toggle: clicking active item closes the panel
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: 0 }}>
      {/* Icon bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 64,
          height: '100%',
          flexShrink: 0,
          backgroundColor: '#131313',
          borderRight: '1px solid #27272a',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onClick={() => handleNavClick(item.id)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingBottom: 12 }}>
          {/* Add button */}
          <button
            onMouseEnter={() => setAddHovered(true)}
            onMouseLeave={() => setAddHovered(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              background: addHovered ? 'rgba(0, 153, 255, 0.15)' : 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: '#0099ff',
              fontSize: 20,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <Plus size={16} />
          </button>
          {/* User avatar circle */}
          <div
            style={{
              width: 32,
              height: 32,
              backgroundColor: '#27272a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#71717a',
              fontSize: 14,
              fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
              fontWeight: 600,
            }}
          >
            <User size={16} />
          </div>
        </div>
      </div>

      {/* Explorer panel */}
      {activeId === 'explorer' && (
        <div
          style={{
            width: 220,
            height: '100%',
            backgroundColor: '#0e0e0e',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: 32,
              padding: '0 12px',
              flexShrink: 0,
              borderBottom: '1px solid #27272a',
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#71717a',
                fontFamily: "'Pretendard Variable', 'Pretendard', sans-serif",
              }}
            >
              EXPLORER
            </span>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <FileExplorer />
          </div>
        </div>
      )}
    </div>
  );
}
