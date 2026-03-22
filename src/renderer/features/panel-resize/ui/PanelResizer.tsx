import { useCallback, useRef, useState } from 'react';
import { usePanelStore } from '@entities/panel/model/panel-store';

const MIN_PANEL_PX = 200;

export function PanelResizer(): React.JSX.Element {
  const dividerRef = useRef<HTMLDivElement>(null);
  const setLeftPanelRatio = usePanelStore((s) => s.setLeftPanelRatio);
  const [hovered, setHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const divider = dividerRef.current;
      if (!divider) return;

      const parent = divider.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();

      const onMouseMove = (moveEvent: MouseEvent) => {
        const x = moveEvent.clientX - parentRect.left;
        const minRatio = MIN_PANEL_PX / parentRect.width;
        const maxRatio = 1 - MIN_PANEL_PX / parentRect.width;
        const ratio = Math.max(minRatio, Math.min(maxRatio, x / parentRect.width));
        setLeftPanelRatio(ratio);
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [setLeftPanelRatio],
  );

  return (
    <div
      ref={dividerRef}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 1,
        flexShrink: 0,
        backgroundColor: hovered ? 'rgba(0, 153, 255, 0.4)' : '#27272a',
        cursor: 'col-resize',
        zIndex: 10,
        transition: 'background-color 0.15s',
      }}
    />
  );
}
